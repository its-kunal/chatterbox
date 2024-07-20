import ChatContextProvider from "./ChatContext";
import MyChatScreen from "./ChatScreen";

export default function ChatScreen() {
  return (
    <ChatContextProvider>
      <MyChatScreen />
    </ChatContextProvider>
  );
}
