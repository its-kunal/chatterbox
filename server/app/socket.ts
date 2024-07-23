import { Server } from "socket.io";
import dotenv from "dotenv";
import recieveMessage, { recieveMessage2 } from "@/events/recieve_message";
import { socketMiddleware } from "@/middleware/auth";
import { socketConnection } from "@/events/connection";

dotenv.config();

const socketHandler = async (io: Server) => {
  socketConnection(io);
  socketMiddleware(io);
  recieveMessage(io);
  recieveMessage2(io);
};

export { socketHandler };
