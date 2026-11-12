
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(
  process.env.REDIS_HOST || "redis://localhost:6379",
  {
    maxRetriesPerRequest:null
  }
);

export const deliveryQueue = new Queue("webhook-deliveries", {
  connection
});

export async function enqueueDelivery(deliveryId: string) {
  return deliveryQueue.add(
    "deliver-webhook",
    { deliveryId },
    {
      jobId: deliveryId,
      attempts:5,
      backoff:{
        type:"exponential",
        delay:20000
      }
    }
  );
}
