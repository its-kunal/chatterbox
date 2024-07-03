import { ReactEventHandler, useEffect, useRef, useState } from "react";
import { Chat, lastChats } from "../../api/http";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
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
  const [connection, setConnection] = useState(false);
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
    setConnection(true);
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
  }, [chats]);

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
    if (!socket.connected) {
      alert("Wait Connecting to server");
      return;
    }
    const message = e.currentTarget.message.value;
    if (message === "") {
      alert("Please enter a message");
      return;
    }
    socket.connect();
    setConnection(false);
    socket.emit("message:send", message);
    e.currentTarget.reset();
    setConnection(true);
    return () => {
      socket.disconnect();
    };
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[100],
            width: "100%",
            py: 2,
          })}
        >
          <Typography variant="h3" textAlign={"center"}>
            Chatterbox{" "}
          </Typography>
        </Box>
        <Box
          sx={{
            height: 400,
            overflow: "auto",
            width: "100%",
          }}
        >
          <List ref={listRef}>
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
        </Box>
        <Box sx={{ display: "flex", mx: 2, mt: 1 }}>
          <Paper
            component="form"
            sx={{
              pl: 2,
              display: "flex",
              justifyContent: "space-between",
              border: 1,
            }}
            onSubmit={submitHandler}
            elevation={0}
          >
            <InputBase
              placeholder="Enter your message"
              name="message"
            ></InputBase>
            <IconButton type="submit" sx={{ mr: 2 }} disabled={!connection}>
              <SendIcon />
            </IconButton>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}
