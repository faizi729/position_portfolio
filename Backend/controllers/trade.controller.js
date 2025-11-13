import { Op } from "sequelize";
import logger from "../config/winston.js";
import { LotTable } from "../models/Lot.model.js";
import { TradeTable } from "../models/Trade.model.js";
import { realizeTable } from "../models/realize.model.js";
import { tradeProducer } from "../config/kafka.js";

async function publishTradeToKafka(trade) {
  try {
    await tradeProducer.send({
      topic: "trades",
      messages: [{ value: JSON.stringify(trade) }],
    });
    logger.info(`📤 Trade published to Kafka: ${trade.symbol}`);
  } catch (err) {
    logger.error(`❌ Kafka publish error: ${err.message}`);
  }
}

// 🔹 Main Trade Controller
export const tradeController = async (req, res) => {
  const transaction = await TradeTable.sequelize.transaction();

  try {
    const { symbol, quantity, price, tradeDate, tradeType, userId } = req.body;

    // Validate fields
    if (!symbol || !quantity || !price || !tradeType || !tradeDate || !userId) {
      logger.warn("❗ Missing required fields in tradeController");
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔸 Create Trade record
    const trade = await TradeTable.create(
      { symbol, quantity, price, tradeType, tradeDate, userId },
      { transaction }
    );

    // ✅ BUY Trade: create a new lot
    if (tradeType.toLowerCase() === "buy") {
      await LotTable.create(
        {
          symbol,
          tradeId:trade.id,
          originalQty: quantity,
          openQty: quantity,
          avgPrice: price,
          userId,
        },
        { transaction }
      );

      await transaction.commit();
      if(process.env.NODE_ENV !== "production"){

        await publishTradeToKafka(trade);
      }

      logger.info(`✅ BUY Trade created and lot opened for ${symbol}`);
      return res.status(201).json({
        message: "Buy trade created successfully",
        trade,
      });
    }

    // 🔴 SELL Trade: apply FIFO matching
    if (tradeType.toLowerCase() === "sell") {
      let toSell = Math.abs(quantity);
      let totalProfit = 0;

      // Fetch oldest open lots (FIFO)
      const openLots = await LotTable.findAll({
        where: { userId, symbol, openQty: { [Op.gt]: 0 } },
        order: [["createdAt", "ASC"]],
        transaction,
      });

      // Check if user has enough holdings
      const totalAvailable = openLots.reduce((sum, l) => sum + l.openQty, 0);
      if (totalAvailable < toSell) {
        await transaction.rollback();
        logger.warn(`⚠️ Insufficient quantity for ${symbol} by user ${userId}`);
        return res.status(400).json({
          message: "Not enough quantity to sell",
        });
      }

      // Process FIFO matching
      for (const lot of openLots) {
        if (toSell <= 0) break;

        const sellQty = Math.min(lot.openQty, toSell);
        const proceeds = sellQty * price;
        const cost = sellQty * lot.avgPrice;
        const profit = proceeds - cost;
        totalProfit += profit;

        // Create realized PnL record
        await realizeTable.create(
          {
            symbol,
            qty: sellQty,
            proceeds,
            cost,
            profit,
            timestamp: tradeDate,
            sourceTradeId: trade.id,
            sourceLotId: lot.id,
            userId,
          },
          { transaction }
        );

        // Update lot (reduce openQty, close if 0)
        lot.openQty -= sellQty;
        if (lot.openQty === 0) lot.closedAt = new Date();
        await lot.save({ transaction });

        toSell -= sellQty;
      }

      await transaction.commit();
      if(process.env.NODE_ENV !== "production"){

        await publishTradeToKafka(trade);
      }

      logger.info(
        `💰 SELL Trade executed for ${symbol}, Profit: ${totalProfit.toFixed(2)}`
      );

      return res.status(201).json({
        message: "Sell trade executed successfully (FIFO applied)",
        totalProfit,
        trade,
      });
    }

    // Invalid trade type
    await transaction.rollback();
    logger.warn(`Invalid trade type received: ${tradeType}`);
    return res.status(400).json({ message: "Invalid trade type" });
  } catch (error) {
    await transaction.rollback();
    logger.error(`❌ Trade processing error: ${error.stack}`);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
