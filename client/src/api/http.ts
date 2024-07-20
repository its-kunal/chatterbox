import axios from "axios";

function isLocalhost() {
  return ["localhost", "127.0.0.1", "192.168.0.104"].includes(
    window.location.hostname
  );
}

const axiosInstance = axios.create({
  baseURL: isLocalhost()
    ? import.meta.env.VITE_LOCAL_SERVER_URL
    : import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*",
    "X-Requested-With": "*",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    if (error.response.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  (err) => {
    console.log("Hello");
    if (err.response.status === 403) {
      localStorage.removeItem("auth_token");
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);

interface UserParams {
  username: string;
  password: string;
}

interface AuthAPIResponse {
  token: string;
  message: string;
}

async function loginUser(payload: UserParams) {
  const { data } = await axiosInstance.post<AuthAPIResponse>(
    "/auth/login",
    payload
  );
  if (data.token !== undefined) localStorage.setItem("token", data.token);
  return data.message;
}

async function signupUser(payload: UserParams) {
  const { data } = await axiosInstance.post<AuthAPIResponse>(
    "/auth/signup",
    payload
  );
  if (data.token !== undefined) localStorage.setItem("token", data.token);
  return data.message;
}

export interface Chat {
  username: string;
  timestamp: string; // ISO string
  data: string;
}

export interface ChatV2 {
  kind: "text" | "image" | "audio";
  data: string;
  timestamp: string;
  user: {
    displayName?: string;
    email: string;
    phoneNumber: string;
    photoURL: string;
    providerId: string;
    uid: string;
  };
}

async function lastChats() {
  const { data } = await axiosInstance.get<Array<Chat>>("/chat");
  return data;
}

async function lastChats2() {
  const { data } = await axiosInstance.get<Array<ChatV2>>("/chat/2");
  return data;
}

async function deleteChats() {
  const { data } = await axiosInstance.get("/del123");
  return data;
}

interface NotificationResponseType {
  status: string;
}

async function getNotificationStatus() {
  const { data } = await axiosInstance.get<NotificationResponseType>(
    "/profile/notify/status"
  );
  return data;
}

interface UpdateNotificationPayload {
  status: boolean;
  token: string;
}

interface UpdateNotificationResponseType {
  message: string;
}

async function updateNotificationStatus(payload: UpdateNotificationPayload) {
  const { data } = await axiosInstance.post<UpdateNotificationResponseType>(
    "/profile/notify",
    payload
  );
  return data;
}

export {
  loginUser,
  signupUser,
  lastChats,
  lastChats2,
  deleteChats,
  getNotificationStatus,
  updateNotificationStatus,
};
