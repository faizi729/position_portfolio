import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "trade-service",
  brokers: ["localhost:9092"],
});

export const tradeProducer = kafka.producer();
export const tradeConsumer = kafka.consumer({ groupId: "trade-group" });

export const connectKafka = async () => {
  try {
    await tradeProducer.connect();
    await tradeConsumer.connect();
    console.log("✅ Kafka connected successfully");
  } catch (error) {
    console.error("❌ Kafka connection failed:", error);
  }
};
