import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { LotTable } from "./Lot.model.js";
import { realizeTable } from "./realize.model.js";

export const TradeTable = sequelize.define("trade",{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,  
        primaryKey:true
    },
    symbol:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    tradeType:{
        type:DataTypes.ENUM('BUY','SELL'),
        allowNull:false,
    },
    tradeDate:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    userId:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:'User',
            key:'id'  
    }
}
}
, {
    tableName: "trade", // 👈 explicit
  })


TradeTable.hasMany(LotTable, { foreignKey: "tradeId" });
LotTable.belongsTo(TradeTable, { foreignKey: "tradeId" });

TradeTable.hasMany(realizeTable, { foreignKey: "sourceTradeId" });
realizeTable.belongsTo(TradeTable, { foreignKey: "sourceTradeId" });