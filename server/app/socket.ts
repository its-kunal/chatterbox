import { Server } from "socket.io";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
import sendMessage from "@/events/send_message";
import recieveMessage from "@/events/recieve_message";
import { auth } from "@/firebase";
import { userCount } from "@/events/user_count";

dotenv.config();

const SECRET = process.env.SECRET!;

const socketHandler = async (io: Server) => {
  io.on("connection", async (socket) => {
    socket.on("message:send", (data) => {
      sendMessage(io, socket, data);
    });
    await userCount(io);
    socket.on("disconnect", async () => {
      await userCount(io);
    });
  });
  io.use(async (socket, next) => {
    const error = new Error("not authorized");
    if (socket.handshake.headers.authorization) {
      const token = socket.handshake.headers.authorization.split(" ")[1];
      try {
        const decodedToken = await auth.verifyIdToken(token);
        const user = await auth.getUser(decodedToken.uid);
        socket.handshake.headers.username = user.displayName;
        next();
      } catch (err) {
        next(error);
      }
    } else {
      next(error);
    }
  });
  recieveMessage(io);
};

export { socketHandler };
