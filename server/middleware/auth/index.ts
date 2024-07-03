import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET!;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined) return res.status(401).send("Unauthorized");
  const token = authHeader.split(" ")[1];
  verify(token, SECRET, (err, decoded: any) => {
    if (err) return res.status(403).send("Forbidden");
    req.headers.username = decoded["username"];
    next();
  });
};

export { authMiddleware };
