import { ChatRouter } from "@/routes/chat";
import { AuthRouter as AuthRouter } from "@/routes/auth";
import express from "express";
import cors from "cors";
import { redis } from "@/db";
import { auth } from "@/firebase";
import { ProfileRouter } from "@/routes/profile";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", AuthRouter);
app.use("/chat", ChatRouter);
app.use("/profile", ProfileRouter);

// error handling
app.get("/del123", async (req, res) => {
  await redis.ltrim("message", 0, -1);
  await redis.del("message");
  res.send("done");
});

app.get("/user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]!;
  const decodedToken = await auth.verifyIdToken(token);
  const user = await auth.getUser(decodedToken.uid);
  console.log(user);
  res.send("done");
});

export { app };
