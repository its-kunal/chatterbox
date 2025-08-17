import { cert, initializeApp } from "firebase-admin/app";

import dotenv from "dotenv";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";

dotenv.config();

const CERT_PATH = process.env.CERT_PATH;

const app = initializeApp({
  ...(CERT_PATH && {
    credential: cert(CERT_PATH),
  }),
});

const auth = getAuth(app);
const messaging = getMessaging(app);

export { app, auth, messaging };
