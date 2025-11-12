import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// ✅ Load .env file
dotenv.config();

const DB_URL = process.env.DB_URL;


const sequelize = new Sequelize(DB_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

export default sequelize;
