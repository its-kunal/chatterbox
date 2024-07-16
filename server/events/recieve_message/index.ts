import { messageChannel, redisSubClient } from "@/db";
import { Server } from "socket.io";

async function recieveMessage(io: Server) {
  const subscriberListener: Parameters<typeof redisSubClient.subscribe>[1] = (
    message,
    channel
  ) => {
    if (channel !== messageChannel) return;
    console.log(message, " message");
    io.emit("message:receive", message);
  };
  redisSubClient.subscribe(messageChannel, subscriberListener);
}

export default recieveMessage;
