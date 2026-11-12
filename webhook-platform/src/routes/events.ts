
import { Router, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { pool } from "../db";
import dotenv from "dotenv";
import "dotenv/config";
import { enqueueDelivery } from "../queue";

const router = Router();








router.post("/", async (req: Request, res: Response) => {
 

  const eventId = randomUUID();
  

  const { userId ,type, data } = req.body;
   

  const client = await pool.connect();


  try {

    await client.query("BEGIN");

 
    const eventResult = await client.query(
      `INSERT INTO events (id, type, data) VALUES ($1, $2, $3) RETURNING id`,
      [eventId, type, data]
    );

    
    
    const subscribedEvents = await client.query(
      `SELECT * FROM subscriptions 
       WHERE event_type = $1 AND user_id = $2 AND is_active = TRUE`,
      [type, userId]
    );

    if (subscribedEvents.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "No active subscriptions for this event" });
    }

    const createdDeliveries = [];

    
    for (const sub of subscribedEvents.rows) {
      const deliveryId = randomUUID();
      await client.query(
        `INSERT INTO deliveries (id, event_id, subscription_id, target_url, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [deliveryId, eventId, sub.id, sub.target_url, "pending"]
      );

      createdDeliveries.push(deliveryId);
    }

    await client.query("COMMIT");

 
    for (const deliveryId of createdDeliveries) {
      try {
        await enqueueDelivery(deliveryId);
      } catch (error) {
        console.error("Failed to enqueue delivery job:", { deliveryId, error });
        
      }
    }

    return res.status(202).json({
      message: "Event accepted and fan-out deliveries queued",
      eventId,
      totalDeliveriesQueued: createdDeliveries.length,
      deliveryIds: createdDeliveries
    });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error processing event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }


  finally {
    client.release();
  }
});

export default router;
