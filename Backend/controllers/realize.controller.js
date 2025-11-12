import {realizeTable} from "../models/realize.model.js";
import {TradeTable} from "../models/trade.model.js";
import {LotTable} from "../models/Lot.model.js";
import {Sequelize} from "sequelize";
import logger from "../config/winston.js"

 export const getRealizedPnL = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      logger.warn("❗ Missing userId in getRealizedPnL");
      return res.status(400).json({ message: "userId is required" });
    }

    // ✅ Fetch all realized trades (with trade + lot joined)
    const realizedTrades = await realizeTable.findAll({
      include: [
        {
          model: TradeTable,
          as: "trade", // 👈 alias MUST match association
          attributes: ["symbol", "tradeType", "userId"],
          where: { userId },
        },
        {
          model: LotTable,
          as: "lot",
          attributes: ["symbol", "avgPrice"],
        },
      ],
      order: [["timestamp", "DESC"]],
    });

    // ✅ Aggregate total profit per symbol using the joined table
    const summary = await realizeTable.findAll({
      attributes: [
        [Sequelize.col("trade.symbol"), "symbol"],
        [Sequelize.fn("SUM", Sequelize.col("realize.qty")), "totalQty"],
        [Sequelize.fn("SUM", Sequelize.col("realize.profit")), "totalProfit"],
      ],
      include: [
        {
          model: TradeTable,
          as: "trade", // 👈 use alias here too
          attributes: [],
          where: { userId },
        },
      ],
      group: ["trade.symbol"],
      raw: true,
    });

    logger.info(`💰 Realized PnL fetched for user ${userId}`);

    return res.status(200).json({
      summary,
      realizedTrades,
    });
  } catch (error) {
    logger.error(`❌ Error fetching realized PnL: ${error.stack}`);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};