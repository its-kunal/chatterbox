import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis(process.env.REDIS_URI!, { lazyConnect: true });
const subClient = redis.duplicate();

const messageChannel = "message:channel";

export { redis, subClient, messageChannel };
