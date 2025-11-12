// config/logger.js
import winston from "winston";
import "winston-daily-rotate-file";

// Define custom log levels (optional but cleaner)
const customLevels = {
  levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
  colors: { error: "red", warn: "yellow", info: "green", http: "magenta", debug: "blue" },
};

winston.addColors(customLevels.colors);

// Define log file rotation
const transport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%-app.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

// Create logger instance
const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message, stack }) =>
        `${timestamp} [${level.toUpperCase()}] ${stack || message}`
    )
  ),
  transports: [new winston.transports.Console(), transport],
});

export default logger;
