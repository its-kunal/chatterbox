import { Router } from "express";
import { notificationChannelKey, redisClient, userNotificationChannel } from "@/db";
import { authMiddleware } from "@/middleware/auth";
import { messaging } from "@/firebase";

const router = Router();

router.use(authMiddleware);

// get the current status of a user
/*
listening notifications or not
uid
*/

router.get("/notify/status", async (req, res) => {
  const uid = req.headers.uid as string;
  const myNotificationChannel = userNotificationChannel(uid);
  const status = await redisClient.get(`${myNotificationChannel}:status`);
  if (status === null) {
    await redisClient.set(`${myNotificationChannel}:status`, "false");
  }
  let newStatus =
    (await redisClient.get(`${myNotificationChannel}:status`)) || "";
  return res.json({ status: newStatus });
});

// post request to change notifications
/*
uid, isListening, token
*/

router.post("/notify", async (req, res) => {
  const uid = req.headers.uid as string;
  const myNotificationChannel = userNotificationChannel(uid);
  const { status, token } = req.body;
  await redisClient.set(`${myNotificationChannel}:status`, String(status));
  if (status === true) {
    await messaging.subscribeToTopic(token, notificationChannelKey);
  } else {
    await messaging.unsubscribeFromTopic(token, notificationChannelKey);
  }
  return res.json({ message: "Status Successfully Updated" });
});

export { router as ProfileRouter };
