import { io } from "socket.io-client";

// const socket = io(`ws://${import.meta.env.VITE_SERVER_HOST_NAME}`, {

const socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
  autoConnect: false,
  extraHeaders: {
    authorization: `Bearer ${localStorage.getItem("auth_token")}`,
  },
});

export default socket;
