import { tradeConsumer } from "../../config/kafka.js";
import logger from "../../config/winston.js";

 

export const startTradeConsumer = async () => {
  await tradeConsumer.subscribe({ topic: "trade-events", fromBeginning: true });

  await tradeConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      logger.info(`📥 Consumed trade event: ${data.tradeType} ${data.symbol} for user ${data.userId}`);
      // Here you could trigger notifications, analytics updates, etc.
    },
  });
};
