import { User } from "../user";
import { UserInfo } from "firebase-admin/auth";

interface Chat {
  message: string;
  timestamp: Date;
  user: User;
}

interface ChatV2Util {
  data: string;
  timestamp: string;
  user: UserInfo;
}

interface ImageChat extends ChatV2Util {
  kind: "image";
}

interface TextChat extends ChatV2Util {
  kind: "text";
}

interface AudioChat extends ChatV2Util {
  kind: "audio";
}

type ChatV2 = ImageChat | TextChat | AudioChat;

export type { Chat, ChatV2 };
