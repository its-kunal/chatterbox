import { messageChannel, subClient } from "@/db";
import { Server } from "socket.io";

async function recieveMessage(io: Server) {
  subClient.subscribe(messageChannel);
  subClient.on("message", (channel, message) => {
    if (channel !== messageChannel) return;
    console.log(message, " message");
    io.emit("message:receive", message);
  });
}

export default recieveMessage;
