import BotSVG from "../../assets/bot.svg";
import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useRef, useState } from "react";
import { Chat, lastChats } from "../../api/http";
import socket from "../../api/socket";
import { useChatContext } from "./ChatContext";

dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);

const MESSAGE_RECEIVE_EVENT = "message:receive";

function MyListItemText({ chat }: { chat: Chat }) {
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
      primary={chat.data}
      secondary={currentDiff + " by " + chat.username}
    />
  );
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const { isSocketConnected } = useChatContext();

  const messageReceiveHandler = (message: string) => {
    const chat = JSON.parse(message) as unknown as Chat;
    setChats((prev) => [
      ...prev,
      { ...chat, diff: dayjs(chat.timestamp).fromNow() },
    ]);
  };

  useEffect(() => {
    if (isSocketConnected) {
      socket.on(MESSAGE_RECEIVE_EVENT, messageReceiveHandler);
    }
    return () => {
      socket.off(MESSAGE_RECEIVE_EVENT, messageReceiveHandler);
    };
  }, [isSocketConnected]);

  useEffect(() => {
    const debounceCall = setTimeout(async () => {
      const data = await lastChats();
      const prevChats: Chat[] = data.map((v) => {
        const c: Chat = {
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
              <ListItemIcon title={chat.username}>
                {chat.username === "Chatterbot" ? (
                  <img src={BotSVG} height={30} width={30} />
                ) : (
                  (() => {
                    const avatar = createAvatar(thumbs, {
                      seed: chat.username,
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
              <MyListItemText chat={chat} />
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      })}
    </List>
  );
}
