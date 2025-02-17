import BotSVG from "../../assets/bot.svg?react";
import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useRef, useState } from "react";
import { ChatV2, lastChats2 } from "../../api/http";
import socket from "../../api/socket";
import { useChatContext } from "./ChatContext";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);

// const MESSAGE_RECEIVE_EVENT = "message:receive";
const MESSAGE_RECEIVE_EVENT_2 = "message:receive2";

function MyListItemText({ chat }: { chat: ChatV2 }) {
  const [currentDiff, setCurrentDiff] = useState(dayjs(chat.timestamp).toNow());
  useEffect(() => {
    const myInterval = setInterval(() => {
      setCurrentDiff(dayjs(chat.timestamp).toNow());
    }, 1000 * 60 * 1);
    return () => {
      clearInterval(myInterval);
    };
  }, []);
  return (
    <ListItemText
      title={dayjs(chat.timestamp).format("L LT")}
      primary={<Markdown remarkPlugins={[remarkGfm]}>{chat.data}</Markdown>}
      secondary={currentDiff + " by " + (chat.user.displayName || "Anonymous")}
    />
  );
}

function MyListItemAudio({ chat }: { chat: ChatV2 }) {
  const audioSrc = `data:audio/webm;base64,${chat.data}`;
  // console.log(audioURL);
  return (
    <Box>
      <audio controls src={audioSrc}></audio>
    </Box>
  );
}

export default function ChatList() {
  const [chats, setChats] = useState<ChatV2[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const { isSocketConnected } = useChatContext();
  const theme = useTheme();

  const messageReceiveHandler = (message: string) => {
    const chat = JSON.parse(message) as unknown as ChatV2;
    setChats((prev) => [...prev, chat]);
  };

  useEffect(() => {
    if (isSocketConnected) {
      socket.on(MESSAGE_RECEIVE_EVENT_2, messageReceiveHandler);
    }
    return () => {
      socket.off(MESSAGE_RECEIVE_EVENT_2, messageReceiveHandler);
    };
  }, [isSocketConnected]);

  useEffect(() => {
    const debounceCall = setTimeout(async () => {
      const data = await lastChats2();
      const prevChats: ChatV2[] = data.map((v) => {
        const c: ChatV2 = {
          ...v,
        };
        return c;
      });
      setChats(prevChats.reverse());
    }, 100);
    return () => {
      clearTimeout(debounceCall);
    };
  }, []);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isSocketConnected]);

  return (
    <List ref={listRef} sx={{ flex: 1, overflowY: "auto" }}>
      <ListSubheader>Chats</ListSubheader>
      {chats.map((chat, idx) => {
        return (
          <React.Fragment key={idx}>
            <ListItem key={idx}>
              <ListItemIcon title={chat.user.displayName || "Anonymous"}>
                {chat.user.displayName === "Chatterbot" ? (
                  <BotSVG height={30} width={30} />
                ) : (
                  (() => {
                    const avatar = createAvatar(thumbs, {
                      seed: chat.user.displayName || chat.user.uid,
                    });
                    const svg = avatar.toDataUri();
                    return (
                      <img
                        src={svg}
                        height={30}
                        width={30}
                        style={{
                          border: "1px solid",
                          borderRadius: "100%",
                        }}
                      />
                    );
                  })()
                )}
              </ListItemIcon>
              {chat.kind === "text" && <MyListItemText chat={chat} />}
              {chat.kind === "image" && (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box
                    sx={{
                      border: 1,
                      borderRadius: theme.shape.borderRadius,
                      overflow: "hidden",
                      maxHeight: "200px",
                      maxWidth: "250px",
                    }}
                  >
                    <img
                      src={chat.data}
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </Box>
                  <MyListItemText chat={{ ...chat, data: "" }} />
                </Box>
              )}
              {chat.kind === "audio" && (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <MyListItemAudio chat={chat} />
                  <MyListItemText chat={{ ...chat, data: "" }} />
                </Box>
              )}
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      })}
    </List>
  );
}
