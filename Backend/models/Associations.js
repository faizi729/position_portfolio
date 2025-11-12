import { TradeTable } from "./Trade.model.js";
import { LotTable } from "./Lot.model.js";
import {  realizeTable } from "./realize.model.js";

TradeTable.hasMany(LotTable, { foreignKey: "tradeId", onDelete: "CASCADE" });
LotTable.belongsTo(TradeTable, { foreignKey: "tradeId" });

TradeTable.hasMany(realizeTable, { foreignKey: "sourceTradeId", onDelete: "CASCADE" });
realizeTable.belongsTo(TradeTable, { foreignKey: "sourceTradeId" });

LotTable.hasMany(realizeTable, { foreignKey: "sourceLotId", onDelete: "CASCADE" });
realizeTable.belongsTo(LotTable, { foreignKey: "sourceLotId" });

export { TradeTable, LotTable, realizeTable };