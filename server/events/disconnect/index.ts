import { Server, Socket } from "socket.io";
import { userCount } from "@/events/user_count";

function socketDisconnectEvent(io: Server, socket: Socket) {
  socket.on("disconnect", async () => {
    await userCount(io);
  });
}

export { socketDisconnectEvent };
