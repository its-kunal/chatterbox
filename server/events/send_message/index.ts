import { Server, Socket } from "socket.io";
import { messageChannel, redis } from "@/db";

async function sendMessage(io: Server, socket: Socket, data: string) {
  const username = socket.handshake.headers.username;
  const timestamp = new Date(Date.now()).toISOString();
  const messageJSON = JSON.stringify({ username, data, timestamp });
  await redis.lpush("message", messageJSON);
  let listLen = await redis.llen("message");
  while (listLen > 25) {
    await redis.rpop("message");
    listLen--;
  }
  await redis.publish(messageChannel, messageJSON);
  console.log(messageJSON, " published");
}

export default sendMessage;
