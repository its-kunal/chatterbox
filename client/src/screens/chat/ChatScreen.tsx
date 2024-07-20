import ChatLoader from "./ChatLoader";
import ChatList from "./ChatList";
import ChatMessageForm from "./ChatMessageForm";
import { useChatContext } from "./ChatContext";

export default function ChatScreen() {
  const { isSocketConnected } = useChatContext();

  return isSocketConnected ? (
    <>
      <ChatList />
      <ChatMessageForm />
    </>
  ) : (
    <ChatLoader />
  );
}
