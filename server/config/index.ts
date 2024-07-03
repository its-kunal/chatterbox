import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT!;

const USER = "user";
const CHAT = "chat";
const SECRET = process.env.SECRET!;

if (typeof PORT === undefined || typeof SECRET === undefined)
  throw new Error("Incorrect Environment Variables");

export { PORT, USER, CHAT, SECRET };
