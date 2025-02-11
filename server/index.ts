import { createServer } from "node:http";
import { Server } from "socket.io";
import { PORT } from "@/config";
import { ExpressApp, socketHandler } from "@/app";
import { redisClient, redisSubClient } from "@/db";

const server = createServer(ExpressApp);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["authorization"],
  },
  maxHttpBufferSize: 1e7,
});

socketHandler(io);

server.listen(PORT, async () => {
  await redisClient.connect();
  await redisSubClient.connect();
  console.log("server started on port", PORT);
});
