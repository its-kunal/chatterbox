import { Server } from "socket.io";
import { socketDisconnectEvent } from "@/events/disconnect";
import { sendMessageEvent2, sendMessageEvent } from "@/events/send_message";
import { userCount } from "@/events/user_count";

function socketConnection(io: Server) {
  io.on("connection", async (socket) => {
    sendMessageEvent2(io, socket);
    sendMessageEvent(io, socket);
    await userCount(io);
    socketDisconnectEvent(io, socket);
  });
}
export { socketConnection };
