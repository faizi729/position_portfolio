import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import "./models/User.model.js"; // Load models (ensure associations are defined inside model files)
 // example route file
import morgan from "morgan";
import cors from "cors";
import { login, register } from "./controllers/user.controller.js";
import { connectKafka } from "./config/kafka.js";
import { startTradeConsumer } from "./kafka/consumers/trade.consumer.js";
import { tradeController } from "./controllers/trade.controller.js";
import {  getPositionsController } from "./controllers/lot.controller.js";
import { getRealizedPnL } from "./controllers/realize.controller.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.post("/api/register", register);
app.post("/api/login",login)
app.post("/api/trades",tradeController)
app.get("/api/positions", getPositionsController);
app.get("/api/realized-pnl", getRealizedPnL);

// Database Connection & Server Start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    await sequelize.sync({ alter: true });
    console.log("✅ All tables created & associated successfully.");

    await connectKafka();
    await startTradeConsumer();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); // Exit the process if DB fails
  }
};

startServer();
