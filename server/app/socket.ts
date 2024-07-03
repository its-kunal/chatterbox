import { Server } from "socket.io";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
import sendMessage from "@/events/send_message";
import recieveMessage from "@/events/recieve_message";

dotenv.config();

const SECRET = process.env.SECRET!;

const socketHandler = async (io: Server) => {
  io.on("connection", async (socket) => {
    socket.on("message:send", (data) => {
      sendMessage(io, socket, data);
    });
  });
  io.use((socket, next) => {
    const error = new Error("not authorized");
    if (socket.handshake.headers.authorization) {
      const token = socket.handshake.headers.authorization.split(" ")[1];
      verify(token, SECRET, (err, decoded) => {
        if (err) next(error);
        // @ts-ignore
        else socket.handshake.headers.username = decoded.username;
        next();
      });
    } else {
      next(error);
    }
  });
  recieveMessage(io);
};

export { socketHandler };
