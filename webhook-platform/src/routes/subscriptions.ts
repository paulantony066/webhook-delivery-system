import { Router, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../db";
import dotenv from "dotenv";
import "dotenv/config";
import { boolean } from "zod";





const router = Router();

router.post("/", async (req, res) => {
  try {
    const { userId, targetUrl, eventType, description } = req.body;
    console.log(description)


    if (!userId || !targetUrl || !eventType) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, targetUrl, and eventType are required." 
      });
    }

    const secretKey = randomUUID();

    for (const event of eventType){


      await pool.query('insert into subscriptions (user_id, target_url, event_type,description, secret_key, is_active) values($1,$2,$3,$4,$5,TRUE)',[userId,targetUrl,event,description,secretKey])

     
    }




    const sub_data=await pool.query("select*from subscriptions where subscriptions.user_id=$1",[userId])

    if (sub_data.rowCount==0){
       return res.status(400).json({message:"failed to register subscription"});
    }
    const subscription=sub_data.rows[0]

    return res.status(201).json({
      message: "Webhook subscription registered successfully!",
      subscription: subscription
    });









  } catch (error: any) {
    console.error("Error registering subscription:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.post('/get_subscriptions', async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required',
      })
    }

    const result = await pool.query(
      `SELECT
        id,
        target_url AS "targetUrl",
        event_type AS "eventType",
        description,
        is_active AS "isActive",
        created_at AS "createdAt"
       FROM subscriptions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    )

    res.status(200).json({
      subscriptions: result.rows,
    })

  } catch (error) {
    console.error('Error fetching subscriptions:', error)

    res.status(500).json({
      message: 'Failed to fetch subscriptions',
    })
  }
})


router.patch('/enable_disable/:id',async (req,res)=>{

  try{
  
  const id=req.params.id

  const {is_active}=req.body;

  
  

  const data = await pool.query("update subscriptions set is_active=$1 where id=$2",[is_active,id])

  return res.status(200).json({message:"updated active status"})

  }catch(error){

    console.log(error)

    return res.status(500).json({message:error})

  }





})

export default router;