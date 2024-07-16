import { Router } from "express";
import { sign } from "jsonwebtoken";
import { createHash } from "node:crypto";
import dotenv from "dotenv";
import { redisClient } from "@/db";
import { USER } from "@/config";

dotenv.config();

const SECRET = process.env.SECRET || "";

const router = Router();


// signup
router.post("/signup", async (req, res) => {
  const hash = createHash("sha256");
  const { username, password } = req.body;
  if (!(username || password))
    return res.json({ message: "Username and password are required" });
  hash.update(password);
  const hashPassword = hash.digest("hex");
  if (await redisClient.get(`${USER}:${username}`))
    return res.json({ message: "Username already exists" });
  await redisClient.set(`${USER}:${username}`, hashPassword);
  const token = sign({ username }, SECRET, { expiresIn: "3h" });
  return res.json({ message: "User created successfully", token });
});

// login
router.post("/login", async (req, res) => {
  const hash = createHash("sha256");
  const { username, password } = req.body;
  if (!(username || password))
    return res.json({ message: "Username and password are required" });
  const authorizedUser = await redisClient.get(`${USER}:${username}`);
  if (!authorizedUser) return res.json({ message: "User not found" });
  hash.update(password);
  const hashPassword = hash.digest("hex");
  if (hashPassword === authorizedUser) {
    const token = sign({ username }, SECRET, { expiresIn: "3h" });
    return res.json({ message: "Login successful", token });
  }
  return res.json({ message: "Invalid password" });
});

export { router as AuthRouter };
