// config/kafka.js
import { Kafka } from "kafkajs";

let tradeProducer;
let tradeConsumer;

export const connectKafka = async () => {
  try {
    const kafka = new Kafka({
      clientId: "trade-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });

    tradeProducer = kafka.producer();
    tradeConsumer = kafka.consumer({ groupId: "trade-group" });

    await tradeProducer.connect();
    await tradeConsumer.connect();
    console.log("✅ Kafka connected successfully to Railway");
  } catch (error) {
    console.error("❌ Kafka connection failed:", error);
  }
};

export { tradeProducer, tradeConsumer };
