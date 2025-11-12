 
import { Op } from "sequelize";
import logger from "../config/winston.js";
import { LotTable } from "../models/Lot.model.js";
import { TradeTable } from "../models/Trade.model.js";

export const getPositionsController = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // ✅ Fetch each open lot individually (don’t merge)
    const openLots = await LotTable.findAll({
      where: { userId, openQty: { [Op.gt]: 0 } },
      order: [["createdAt", "ASC"]], // FIFO order
    });

    if (!openLots.length) {
      return res
        .status(200)
        .json({ message: "No open positions", positions: [] });
    }

    // ✅ Format for frontend directly
    const positions = openLots.map((lot) => ({
      id: lot.id,
      symbol: lot.symbol,
      openQty: lot.openQty,
      avgPrice: lot.avgPrice,
      createdAt: lot.createdAt,
    }));

    logger.info(`📊 Open lots fetched for user ${userId}`);
    return res.status(200).json(positions);
  } catch (error) {
    logger.error(`❌ Error fetching positions: ${error.stack}`);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
