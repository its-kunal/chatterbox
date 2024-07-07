import { applicationDefault, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import dotenv from "dotenv";

dotenv.config();

const ENV = process.env.ENV;

const app = initializeApp({
  ...(ENV && {
    credential: cert("C:/Users/Kunal/Downloads/kunal-d1c1e-70924d775881.json"),
  }),
});
const auth = getAuth(app);

export { app, auth };
