import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import dotenv from "dotenv";
import { getMessaging } from "firebase-admin/messaging";

dotenv.config();

const ENV = process.env.ENV;

const app = initializeApp({
  ...(ENV && {
    credential: cert("C:/Users/Kunal/Downloads/kunal-d1c1e-70924d775881.json"),
  }),
});
const auth = getAuth(app);
const messaging = getMessaging(app);

export { app, auth, messaging };
