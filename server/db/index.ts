import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const messageChannel = "message:channel";

const chatChannel = "chat:channel";

const notificationChannelKey = "notify";

const CHAT = "CHAT";

const userNotificationChannel = (uid: string) =>
  `${notificationChannelKey}:${uid}`;

const redisClient = createClient({
  url: process.env.REDIS_URI!,
  pingInterval: 3000,
});
const redisSubClient = redisClient.duplicate();

redisClient.on("ready", () => console.log("Redis Client Ready"));
redisSubClient.on("ready", () => console.log("Redis Subscriber Client Ready"));

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisSubClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.on("end", () => {
  console.log("Redis connection ended");
});
redisSubClient.on("end", () => {
  console.log("Redis connection ended");
});

export {
  redisClient,
  redisSubClient,
  messageChannel,
  notificationChannelKey,
  userNotificationChannel,
  CHAT,
  chatChannel,
};
