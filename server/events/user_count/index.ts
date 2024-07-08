import { Server } from "socket.io";

async function userCount(io: Server) {
  const userCount = (await io.fetchSockets()).length;
  io.emit("users:count", userCount);
}

export { userCount };
