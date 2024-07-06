import { ReactEventHandler, useEffect, useRef, useState } from "react";
import { Chat, lastChats } from "../../api/http";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import socket from "../../api/socket";
import SendIcon from "@mui/icons-material/Send";
import React from "react";

dayjs.extend(relativeTime);

interface ChatUI extends Chat {
  diff: string;
}

export default function ChatScreen() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chats, setChats] = useState<ChatUI[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const messageRecieveHandler = (message: string) => {
    const chat = JSON.parse(message) as unknown as Chat;
    setChats((prev) => [
      ...prev,
      { ...chat, diff: dayjs(chat.timestamp).fromNow() },
    ]);
  };

  useEffect(() => {
    socket.connect();
    socket.on("message:receive", messageRecieveHandler);
    const debounceCall = setTimeout(async () => {
      const data = await lastChats();
      const prevChats: ChatUI[] = data.map((v) => {
        const c: ChatUI = {
          ...v,
          diff: dayjs(v.timestamp).fromNow(),
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

  useEffect(() => {
    const debounceTimeInterval = setInterval(() => {
      setChats((prevChats) => {
        const chats = prevChats.map((v) => {
          v.diff = dayjs(v.timestamp).toNow();
          return v;
        });
        return chats;
      });
      console.log("hello");
    }, 2 * 60 * 1000);
    return () => {
      clearInterval(debounceTimeInterval);
    };
  }, []);

  const submitHandler: ReactEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const message = e.currentTarget.message.value;
    if (message === "") {
      alert("Please enter a message");
      return;
    }
    socket.emit("message:send", message);
    e.currentTarget.reset();
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
    <Container sx={{ mx: "auto", px: 0, height: "100%" }}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <List ref={listRef} sx={{ flex: 1, overflowY: "auto", height: "80%" }}>
          <ListSubheader>Chats</ListSubheader>
          {chats.map((chat, idx) => {
            return (
              <React.Fragment key={idx}>
                <ListItem key={idx}>
                  <ListItemText
                    primary={chat.data}
                    secondary={chat.diff + " by " + chat.username}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
          <div ref={bottomRef} />
        </List>
        <Box
          sx={(theme) => ({
            display: "flex",
            my: 1,
            bottom: 0,
            backgroundColor: theme.palette.background.default,
            justifyContent: "center",
            width: "100%",
            position: "sticky",
            py: 1,
          })}
        >
          <Box
            component="form"
            sx={(theme) => ({
              pl: 2,
              display: "flex",
              justifyContent: "space-between",
              border: 1,
              borderRadius: theme.spacing(1),
              py: 1,
            })}
            onSubmit={submitHandler}
          >
            <InputBase
              placeholder="Enter your message"
              name="message"
            ></InputBase>
            <IconButton type="submit" sx={{ mr: 2 }} disabled={!isConnected}>
              <SendIcon color="primary" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Container>
  ) : (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}
