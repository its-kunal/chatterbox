import { chatChannel, messageChannel, redisSubClient } from "@/db";
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

async function recieveMessage2(io: Server) {
  try {
    const subscriberListener: Parameters<typeof redisSubClient.subscribe>[1] = (
      message,
      channel
    ) => {
      if (channel !== chatChannel) return;
      console.log(message, " message");
      io.emit("message:receive2", message);
    };
    redisSubClient.subscribe(chatChannel, subscriberListener);
  } catch {}
}

export { recieveMessage2 };

export default recieveMessage;
