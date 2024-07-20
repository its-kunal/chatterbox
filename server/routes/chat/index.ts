import { redisClient, CHAT } from "@/db";
import { authMiddleware } from "@/middleware/auth";
import { Router } from "express";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const messages = await redisClient.lRange("message", 0, 10);
  const newMessages = messages.map((message) => JSON.parse(message));
  res.json(newMessages);
});

router.get("/2", async (req, res) => {
  const messages = await redisClient.lRange(CHAT, 0, 10);
  const newMessages = messages.map((message) => JSON.parse(message));
  res.json(newMessages);
});

export { router as ChatRouter };
