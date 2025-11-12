import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { realizeTable } from "./realize.model.js";

export const LotTable = sequelize.define("lot",{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,  
        primaryKey:true
    },
    symbol:{
        type:DataTypes.STRING,
        allowNull:false,},
    originalQty:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    openQty:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    avgPrice:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    closedAt: { type: DataTypes.DATE,
         allowNull: true },
    userId: { type: DataTypes.UUID,
         allowNull: true
        , references:{
            model:'User',
            key:'id'  
    }
         },
    

},
 {
    tableName: "lot", // 👈 explicit
  })

LotTable.hasMany(realizeTable, { foreignKey: "sourceLotId" });
realizeTable.belongsTo(LotTable, { foreignKey: "sourceLotId" });