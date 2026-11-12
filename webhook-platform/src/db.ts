import "dotenv/config";
import { error } from "node:console";
import { Pool } from "pg";

if(!process.env.DATABASE_URL){
    throw new Error("db url missing");
}

export const pool = new Pool({
    connectionString:
    process.env.DATABASE_URL,
    max:10,
    connectionTimeoutMillis:5000,
    idleTimeoutMillis:30000
});