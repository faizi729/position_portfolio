import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const realizeTable = sequelize.define("realize",{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    symbol:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    qty:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    proceeds:{
        type:DataTypes.DECIMAL,
        allowNull:false,
    },
    cost:{
        type:DataTypes.DECIMAL,
        allowNull:false,
    },
    profit:{
        type:DataTypes.DECIMAL,
        allowNull:false,
    },
    timestamp:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    sourceTradeId:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:'trade',
            key:'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",

    },
    sourceLotId:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:'lot',
            key:'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }
    }
)