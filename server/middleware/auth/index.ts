import { Request, Response, NextFunction } from "express";
import { auth } from "@/firebase";
import { Server } from "socket.io";

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
    if (typeof user.displayName !== "string" || user.displayName === undefined)
      req.headers.username = "Anonymous";
    req.headers.uid = user.uid;
    next();
  } catch (err) {
    return res.status(403).send("Forbidden");
  }
};

function socketMiddleware(io: Server) {
  io.use(async (socket, next) => {
    const error = new Error("not authorized");
    if (socket.handshake.headers.authorization) {
      const token = socket.handshake.headers.authorization.split(" ")[1];
      try {
        const decodedToken = await auth.verifyIdToken(token);
        const user = await auth.getUser(decodedToken.uid);
        socket.handshake.headers.user = JSON.stringify(user);
        socket.handshake.headers.username = user.displayName;
        if (
          typeof user.displayName !== "string" ||
          user.displayName === undefined
        )
          socket.handshake.headers.username = "Anonymous";
        next();
      } catch (err) {
        next(error);
      }
    } else {
      next(error);
    }
  });
}

export { authMiddleware, socketMiddleware };
