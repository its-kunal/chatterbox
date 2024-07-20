import { UserRecord } from "firebase-admin/auth";

interface User {
  name: string;
  id: string;
  dateOfBirth: Date;
  address: string;
  avatar: string;
  password: string;
}

interface UserV2 extends UserRecord {}

export type { User, UserV2 };
