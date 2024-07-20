import { Server, Socket } from "socket.io";
import {
  CHAT,
  chatChannel,
  messageChannel,
  notificationChannelKey,
  redisClient,
} from "@/db";
import {
  getTextAfterChatterbot,
  isChatterbotString,
  messageInterpreter,
} from "@/functions/langchain";
import { CHATTERBOT } from "@/config";
import { messaging } from "@/firebase";
import { ChatV2 } from "@/types/chat";
import { compressBase64Image } from "@/functions/sharp";
import { UserInfo } from "firebase-admin/auth";

async function sendMessage(io: Server, socket: Socket, data: string) {
  const username = socket.handshake.headers.username;
  const timestamp = new Date(Date.now()).toISOString();
  const messageJSON = JSON.stringify({ username, data, timestamp });
  await redisClient.lPush("message", messageJSON);
  let listLen = await redisClient.lLen("message");
  while (listLen > 25) {
    await redisClient.rPop("message");
    listLen--;
  }
  await redisClient.publish(messageChannel, messageJSON);
  console.log(messageJSON, " published");
  if (isChatterbotString(data)) {
    const message = getTextAfterChatterbot(data);
    const response = await messageInterpreter({ message });
    const messageJSON1 = JSON.stringify({
      data: response,
      timestamp,
      username: CHATTERBOT,
    });
    await redisClient.lPush("message", messageJSON1);
    await redisClient.publish(messageChannel, messageJSON1);
  }
  messaging.sendToTopic(notificationChannelKey, {
    data: {},
    notification: { title: "New Message", body: data + " from " + username },
  });
}

async function sendMessage2(io: Server, socket: Socket, data: string) {
  console.log("Hello send message 2");
  const userJSON = socket.handshake.headers.user as string;
  const user = JSON.parse(userJSON) as UserInfo;
  const timestamp = new Date(Date.now()).toISOString();
  const dataObj: Pick<ChatV2, "kind" | "data"> = JSON.parse(data);
  console.log(dataObj);
  try {
    if (dataObj.kind === "image") {
      dataObj.data = await compressBase64Image(dataObj.data);
    }
  } catch (err) {
    console.log("Image Compression failed");
    console.log(err);
    socket.emit("error", "Something went wrong, try again later");
    return;
  }
  let chat: ChatV2 = {
    data: dataObj.data,
    kind: dataObj.kind,
    timestamp,
    user,
  };
  const chatJSON = JSON.stringify(chat);

  await redisClient.lPush(CHAT, chatJSON);
  let listLen = await redisClient.lLen(CHAT);
  while (listLen > 25) {
    await redisClient.rPop(CHAT);
    listLen--;
  }
  const list = await redisClient.lRange(CHAT, 0, 10);
  console.log(list.length);
  await redisClient.publish(chatChannel, chatJSON);
  console.log(chatJSON, " published");
  if (dataObj.kind === "text" && isChatterbotString(dataObj.data)) {
    const subChat = getTextAfterChatterbot(data);
    const response = await messageInterpreter({ message: subChat });
    const chatterbotChatObj: ChatV2 = {
      kind: "text",
      data: response,
      timestamp,
      user: {
        displayName: "Chatterbot",
        email: "",
        phoneNumber: "",
        photoURL: "",
        providerId: "",
        uid: "Chatterbot",
        toJSON: () => ({
          displayName: "Chatterbot",
          email: "",
          phoneNumber: "",
          photoURL: "",
          providerId: "",
          uid: "Chatterbot",
        }),
      },
    };
    const chatterbotChatJSON = JSON.stringify(chatterbotChatObj);
    await redisClient.lPush(CHAT, chatterbotChatJSON);
    await redisClient.publish(chatChannel, chatterbotChatJSON);
    messaging.sendToTopic(notificationChannelKey, {
      data: {},
      notification: {
        title: "New Message",
        body: dataObj.data + " from " + user.displayName || "Anonymous",
      },
    });
  }
}

export { sendMessage2 };
export default sendMessage;
