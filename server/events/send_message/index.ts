import { Server, Socket } from "socket.io";
import { messageChannel, redis } from "@/db";
import {
  getTextAfterChatterbot,
  isChatterbotString,
  messageInterpreter,
} from "@/functions/langchain";
import { CHATTERBOT } from "@/config";

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
  if (isChatterbotString(data)) {
    const message = getTextAfterChatterbot(data);
    const response = await messageInterpreter({ message });
    const messageJSON1 = JSON.stringify({
      data: response,
      timestamp,
      username: CHATTERBOT,
    });
    await redis.lpush("message", messageJSON1);
    await redis.publish(messageChannel, messageJSON1);
  }
}

export default sendMessage;
