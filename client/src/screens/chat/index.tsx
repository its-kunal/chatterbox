import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import SendIcon from "@mui/icons-material/Send";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { ReactEventHandler, useEffect, useRef, useState } from "react";
import { Chat, lastChats } from "../../api/http";
import socket from "../../api/socket";
import BotSVG from "../../assets/bot.svg";

dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);

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

export default function ChatScreen() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [userCount, setUserCount] = useState(1);
  const [chats, setChats] = useState<Chat[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [message, setMessage] = useState<string>("");

  const messageRecieveHandler = (message: string) => {
    const chat = JSON.parse(message) as unknown as Chat;
    setChats((prev) => [
      ...prev,
      { ...chat, diff: dayjs(chat.timestamp).fromNow() },
    ]);
  };

  const userCountHandler = (message: number) => {
    setUserCount(message);
  };

  useEffect(() => {
    socket.connect();
    socket.on("message:receive", messageRecieveHandler);
    socket.on("users:count", userCountHandler);
    const debounceCall = setTimeout(async () => {
      const data = await lastChats();
      const prevChats: Chat[] = data.map((v) => {
        const c: Chat = {
          ...v,
        };
        return c;
      });
      setChats(prevChats.reverse());
    }, 500);
    return () => {
      clearTimeout(debounceCall);
      socket.off("message:receive", messageRecieveHandler);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isConnected]);

  const submitHandler: ReactEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (message === "") {
      alert("Please enter a message");
      return;
    }
    socket.emit("message:send", message);
    e.currentTarget.reset();
    setMessage("");
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return isConnected ? (
    <>
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
        <div ref={bottomRef} />
      </List>
      <Box sx={{ py: 1, borderTop: 1 }}>
        <Container sx={{ maxWidth: 310 }}>
          {userCount > 1 && (
            <Typography
              variant="caption"
              color={"GrayText"}
              sx={{ display: "flex", alignItems: "center", columnGap: 1 }}
            >
              <Box
                component={"div"}
                sx={(theme) => ({
                  display: "inline-block",
                  height: 12,
                  width: 12,
                  borderRadius: "100%",
                  backgroundColor: theme.palette.success.main,
                })}
              ></Box>
              Active Users: {userCount}
            </Typography>
          )}
        </Container>
        <Box
          sx={(theme) => ({
            display: "flex",
            my: 1,
            bottom: 0,
            backgroundColor: theme.palette.background.default,
            justifyContent: "center",
            width: "100%",
            py: 1,
          })}
        >
          <Box
            component="form"
            sx={(theme) => ({
              pl: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: 1,
              borderRadius: theme.spacing(1),
              py: 1,
            })}
            onSubmit={submitHandler}
          >
            <Autocomplete
              value={message}
              onChange={(_msg, value) => {
                value && setMessage(value);
              }}
              options={["Chatterbot:"]}
              freeSolo
              renderInput={(params) => {
                const { InputLabelProps, InputProps, ...rest } = params;
                return (
                  <InputBase
                    placeholder="Enter your message"
                    name="message"
                    {...params.InputProps}
                    {...rest}
                    sx={{ width: { xs: 210, md: 500 } }}
                  />
                );
              }}
            />
            <IconButton type="submit" sx={{ mr: 2 }} disabled={!isConnected}>
              <SendIcon color="primary" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  ) : (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}
