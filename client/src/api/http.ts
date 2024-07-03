import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
    // if (error.response.status === 403) {
    //   localStorage.removeItem("token");
    //   window.location.href = "/auth";
    // }
  }
);

axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  (err) => {
    console.log("Hello");
    if (err.response.status === 403) {
      localStorage.removeItem("token");
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

async function lastChats() {
  const { data } = await axiosInstance.get<Array<Chat>>("/chat");
  return data;
}

async function deleteChats(){
  const { data } = await axiosInstance.get("/del123");
  return data;
}

export { loginUser, signupUser, lastChats, deleteChats };
