import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import "./models/User.model.js"; // Load models (ensure associations are defined inside model files)

import morgan from "morgan";
import cors from "cors";

import { connectKafka } from "./config/kafka.js";
import { startTradeConsumer } from "./kafka/consumers/trade.consumer.js";

import router from "./routes/route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes

app.use("/api",router)
// Database Connection & Server Start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    await sequelize.sync({ alter: true });
    console.log("✅ All tables created & associated successfully.");

   if (process.env.ENABLE_KAFKA === "true") {
  await connectKafka();
  await startTradeConsumer();
}

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Server startup failed:", error.message || error);
    process.exit(1);
  }
};
startServer();
