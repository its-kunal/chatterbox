import { Request, Response, NextFunction } from "express";
import { auth } from "@/firebase";

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
    req.headers.uid = user.uid;
    next();
  } catch (err) {
    return res.status(403).send("Forbidden");
  }
};

export { authMiddleware };
