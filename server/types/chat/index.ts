import { User } from "../user";

interface Chat {
  message: string;
  timestamp: Date;
  user: User;
}

export type { Chat };
