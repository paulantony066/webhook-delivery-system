
import express from "express";
import dotenv from "dotenv";
import eventsRouter from "./routes/events";
import loginRouter from "./routes/login";
import subscibeRouter from "./routes/subscriptions";
import authRouter from "./routes/auth";
import activityRouter from "./routes/getactivity";
import cors from "cors";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import session from "express-session";





const app = express();


app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

dotenv.config();



app.use(express.json());


const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

redisClient.connect();

const redisStore = new RedisStore({
    client: redisClient,
    prefix: "session:",
    ttl: 86400
});

app.use(session({
    store: redisStore,
    name: "sid",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // localhost HTTP
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    }
}));


app.use("/login",loginRouter);
app.use("/events", eventsRouter);
app.use("/subscribe",subscibeRouter);
app.use("/auth",authRouter)
app.use("/getactivity",activityRouter)


const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
