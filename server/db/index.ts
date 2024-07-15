import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis(process.env.REDIS_URI!, { lazyConnect: true });
const subClient = redis.duplicate();

const messageChannel = "message:channel";

const notificationChannelKey = "notify";

const userNotificationChannel = (uid: string) =>
  `${notificationChannelKey}:${uid}`;

export {
  redis,
  subClient,
  messageChannel,
  notificationChannelKey,
  userNotificationChannel,
};
