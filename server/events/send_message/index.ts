import {
  CHAT,
  chatChannel,
  messageChannel,
  notificationChannelKey,
  redisClient,
} from "@/db";
import { Server, Socket } from "socket.io";
import {
  getTextAfterChatterbot,
  isChatterbotString,
  messageInterpreter,
} from "@/functions/langchain";

import { CHATTERBOT } from "@/config";
import { ChatV2 } from "@/types/chat";
import { UserInfo } from "firebase-admin/auth";
import { compressBase64Image } from "@/functions/sharp";
import { messaging } from "@/firebase";

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

  messaging.send({
    data: {},
    notification: { title: "New Message", body: data + " from " + username },
    topic: notificationChannelKey,
  });
}

async function sendMessage2(io: Server, socket: Socket, data: string) {
  console.log("Hello send message 2");
  const userJSON = socket.handshake.headers.user as string;
  const user = JSON.parse(userJSON) as UserInfo;
  const timestamp = new Date(Date.now()).toISOString();
  const dataObj: Pick<ChatV2, "kind" | "data"> = JSON.parse(data);
  if (dataObj.data === "") throw new Error("Empty message not allowed.");
  if (dataObj.kind === "image") {
    try {
      if (dataObj.data === "") throw new Error("Invalid Image");
      dataObj.data = await compressBase64Image(dataObj.data);
    } catch (err) {
      console.log("Image Compression failed");
      console.log(err);
      socket.emit("error", "Something went wrong, try again later");
      return;
    }
  } else if (dataObj.kind === "text") {
    try {
      if (dataObj.data === "") throw new Error("Empty message not allowed.");
    } catch (err: any) {
      socket.emit("error", err.message);
      return;
    }
  }
  let chat: ChatV2 = {
    data: dataObj.data,
    kind: dataObj.kind,
    timestamp,
    user,
  };
  const chatJSON = JSON.stringify(chat);
  await redisClient.lPush(CHAT, chatJSON);
  await redisClient.publish(chatChannel, chatJSON);
  await redisClient.lTrim(CHAT, 0, 10);
  console.log(chatJSON, " published");
  // call chatterbot
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
  }
  try {
    if (dataObj.kind === "text") {
      messaging.send({
        data: {},
        notification: {
          title: "New Message",
          body: dataObj.data + " from " + (user.displayName || "Anonymous"),
        },
        topic: notificationChannelKey,
      });
    } else if (dataObj.kind === "image") {
      messaging.send({
        data: {},
        notification: {
          title: "New Message",
          body:
            "An Image has been shared by " + (user.displayName || "Anonymous"),
        },
        topic: notificationChannelKey,
      });
    } else if (dataObj.kind === "audio") {
      messaging.send({
        data: {},
        notification: {
          title: "New Message",
          body:
            "An Voice Note has been shared by " +
            (user.displayName || "Anonymous"),
        },
        topic: notificationChannelKey,
      });
    }
  } catch (err) {
    console.log("Error sending notification", JSON.stringify(err));
  }
}

function sendMessageEvent2(io: Server, socket: Socket) {
  socket.on("message:send2", (data) => {
    try {
      sendMessage2(io, socket, data);
    } catch {}
  });
}

function sendMessageEvent(io: Server, socket: Socket) {
  socket.on("message:send", (data) => {
    sendMessage(io, socket, data);
  });
}

export { sendMessage2, sendMessageEvent, sendMessageEvent2 };
export default sendMessage;
