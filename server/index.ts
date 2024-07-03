import { createServer } from "node:http";
import { Server } from "socket.io";
import { PORT } from "@/config";
import { ExpressApp, socketHandler } from "@/app";
import { redis, subClient } from "./db";

const server = createServer(ExpressApp);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["authorization"],
  },
});

subClient.on("error", (err) => console.log("Redis Client Error", err));
redis.on("error", (err) => console.log("Redis Client Error", err));

socketHandler(io);

server.listen(PORT, async () => {
  console.log("server started on port", PORT);
});
