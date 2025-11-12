import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { TradeTable } from "./Trade.model.js";

export const UserTable = sequelize.define("User", {
id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
},
email:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true
},
password:{
    type:DataTypes.STRING,
    allowNull:false
},

},
 {
    tableName: "User", // 👈 explicit
  })

UserTable.hasMany(TradeTable, { foreignKey: "userId" });
TradeTable.belongsTo(UserTable, { foreignKey: "userId" });