import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { auth } from "@/firebase";

dotenv.config();

const SECRET = process.env.SECRET!;

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined) return res.status(401).send("Unauthorized");
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    const user = await auth.getUser(decodedToken.uid);
    req.headers.username = user.displayName;
    next();
  } catch (err) {
    return res.status(403).send("Forbidden");
  }
};

export { authMiddleware };
