console.log("Worker script is running!");
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { pool } from "./db";
import { randomUUID } from "node:crypto";
import { performance } from "perf_hooks";

const connection = new IORedis(
  process.env.REDIS_HOST || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null
  }
);

const worker = new Worker(
  "webhook-deliveries", 
  async (job) => {
    const { deliveryId } = job.data as { deliveryId: string };

    const result = await pool.query(
      'SELECT d.id as deliveryId, d.target_url, e.id as eventId, e.type, e.data FROM deliveries d JOIN events e ON e.id = d.event_id WHERE d.id = $1',
      [deliveryId]
    );

    if (result.rows.length === 0) {
      throw new Error(`Delivery not found: ${deliveryId}`);
    }

    const delivery = result.rows[0];
    const attemptNumber = job.attemptsMade + 1;
    const startTime = performance.now();
    const deliveryAttemptId = randomUUID();

    let responseStatus: number | null = null;
    let responseError: string | null = null;
    let errorMessage: string | null = null;

    try {
      const response = await fetch(delivery.target_url, {
        method: 'POST',
        headers: {
          "content-type": 'application/json',
          "event-id": delivery.eventid,
          "event-type": delivery.type
        },
        body: JSON.stringify({
          id: delivery.deliveryid,
          type: delivery.type,
          data: delivery.data
        }),
        signal: AbortSignal.timeout(10000)
      });

      responseStatus = response.status;
      const endTime = performance.now();
      const responseTimeMs = Math.round(endTime - startTime);
      

      
      
      await pool.query(
        'INSERT INTO delivery_attempts (id, delivery_id, attempt_number, http_status, response_time_ms, error) VALUES ($1, $2, $3, $4, $5, $6)',
        [deliveryAttemptId, deliveryId, attemptNumber, responseStatus, responseTimeMs, null]
      );

      if (!response.ok) {
        throw new Error(`Webhook returned HTTP ${response.status}`);
      }


      await pool.query(
        'UPDATE deliveries SET status = $1, response_status = $2 WHERE id = $3',
        ["success", responseStatus, deliveryId]
      );

      console.log(`Delivery successful: ${deliveryId} (HTTP ${response.status})`);
      return { deliveryId, responseStatus: response.status };

    } catch (error: any) {
      errorMessage = error.message || "Unknown error occurred";
      const endTime = performance.now();
      const responseTimeMs = Math.round(endTime - startTime);
      responseError = error.message;

      
      if (responseStatus !== null && !job.failedReason) {
        await pool.query(
          'INSERT INTO delivery_attempts (id, delivery_id, attempt_number, http_status, response_time_ms, error) VALUES ($1, $2, $3, $4, $5, $6)',
          [deliveryAttemptId, deliveryId, attemptNumber, responseStatus, responseTimeMs, responseError]
        ).catch(() => {}); 
      }

      const maxAttempts = job.opts.attempts || 1;
      if (attemptNumber >= maxAttempts) {
        await pool.query(
          `UPDATE deliveries SET status = 'failed', response_status = $1 WHERE id = $2`,
          [responseStatus, deliveryId]
        );
        console.log(`Job ${job.id} permanently failed after ${maxAttempts} attempts. DB updated to failed.`);
      }

      console.error(`Delivery failed: ${deliveryId}`, error);
      throw error;
    }

    finally{
        try {
        await pool.query(
          'update delivery_attempts set error=$1 where id=$2',[errorMessage,deliveryAttemptId]
          
        );
      } catch (dbErr) {
        console.error("Failed to insert delivery attempt audit log:", dbErr);
      }
    }


    
  },
  { 
    connection,
    concurrency: 1
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully!`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error: ${err.message}`);
});