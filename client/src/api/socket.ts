import { io } from "socket.io-client";

// const socket = io(`ws://${import.meta.env.VITE_SERVER_HOST_NAME}`, {

function isLocalhost() {
  return ["localhost", "127.0.0.1", "192.168.0.104"].includes(
    window.location.hostname
  );
}

const socket = io(
  isLocalhost()
    ? import.meta.env.VITE_LOCAL_SERVER_URL
    : import.meta.env.VITE_SERVER_URL,
  {
    autoConnect: false,
    extraHeaders: {
      authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
  }
);

export default socket;
