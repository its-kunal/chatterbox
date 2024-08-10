import { createContext, useContext, useEffect, useState } from "react";
import socket from "../../api/socket";

interface ChatContextType {
  isSocketConnected: boolean;
  setSocketConnected: React.Dispatch<React.SetStateAction<boolean>>;
  textContent: string | null;
  imageContent: string | null;
  audioContent: string | null;
  setTextContent: React.Dispatch<React.SetStateAction<string | null>>;
  setImageContent: React.Dispatch<React.SetStateAction<string | null>>;
  setAudioContent: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType>({
  imageContent: null,
  textContent: null,
  isSocketConnected: false,
  setImageContent: () => {},
  setSocketConnected: () => {},
  setTextContent: () => {},
  loading: true,
  setLoading: () => {},
  audioContent: null,
  setAudioContent: () => {},
});

type ChatContextProviderProps = {
  children: React.ReactNode;
};

export function useChatContext() {
  return useContext(ChatContext);
}

export default function ChatContextProvider({
  children,
}: ChatContextProviderProps) {
  const [imageContent, setImageContent] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [audioContent, setAudioContent] = useState<string | null>(null);
  const [isSocketConnected, setSocketConnected] = useState(socket.connected);
  const [loading, setLoading] = useState(!socket.connected);

  useEffect(() => {
    function onConnect() {
      setSocketConnected(true);
    }

    function onDisconnect() {
      setSocketConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        imageContent,
        setImageContent,
        textContent,
        setTextContent,
        audioContent,
        setAudioContent,
        isSocketConnected,
        setSocketConnected,
        loading,
        setLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
