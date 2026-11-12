import { Router, Request, Response } from "express";

import { pool } from "../db";

const router = Router();



router.post("/",async (req:Request,res:Response)=>{

    
    try{

        const {userId}=req.body


        const result = await pool.query(
  `
  SELECT
      d.id AS delivery_id,
      d.status AS status,
      e.type AS event,
      d.target_url AS endpoint,
      latest.http_status AS code,
      latest.response_time_ms AS latency,
      COALESCE(attempts.total, 0) AS attempts,
      d.created_at AS timestamp,
      latest.created_at AS last_attempt_at

  FROM deliveries d

  JOIN events e
      ON d.event_id = e.id

  JOIN subscriptions s
      ON d.subscription_id = s.id

  LEFT JOIN LATERAL (
      SELECT
          http_status,
          response_time_ms,
          created_at
      FROM delivery_attempts
      WHERE delivery_id = d.id
      ORDER BY attempt_number DESC
      LIMIT 1
  ) latest ON true

  LEFT JOIN LATERAL (
      SELECT COUNT(*) AS total
      FROM delivery_attempts
      WHERE delivery_id = d.id
  ) attempts ON true

  WHERE s.user_id = $1

  ORDER BY d.created_at DESC;
  `,
  [userId]
);

res.status(200).json({
  deliveries: result.rows
});

    }catch(error){

        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });

    }

});

export default router;