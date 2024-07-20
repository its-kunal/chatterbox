import SendIcon from "@mui/icons-material/Send";
import {
  Autocomplete,
  Box,
  Container,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import { ReactEventHandler, useEffect, useState } from "react";
import socket from "../../api/socket";
import ImageUpload from "./ImageUpload";

import { useChatContext } from "./ChatContext";

const USERS_COUNT_EVENT = "users:count";
const MESSAGE_SEND_EVENT = "message:send";

export default function ChatMessageForm() {
  const [userCount, setUserCount] = useState(1);
  const [message, setMessage] = useState<string>("");
  const [messageBoxDisabled, setMessageBoxDisabled] = useState(false);
  const { isSocketConnected } = useChatContext();

  const submitHandler: ReactEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setMessageBoxDisabled(true);
      if (message === "") {
        alert("Please enter a message");
        return;
      }
      socket.emit(MESSAGE_SEND_EVENT, message);
      e.currentTarget.reset();
      setMessage("");
    } catch (err) {
    } finally {
      setMessageBoxDisabled(false);
    }
  };

  const userCountHandler = (message: number) => {
    setUserCount(message);
  };

  useEffect(() => {
    socket.on(USERS_COUNT_EVENT, userCountHandler);
    return () => {
      socket.off(USERS_COUNT_EVENT, userCountHandler);
    };
  }, [isSocketConnected]);

  return (
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
            pr: 1,
          })}
          onSubmit={submitHandler}
        >
          <Autocomplete
            disabled={messageBoxDisabled}
            value={message}
            onInputChange={(e) => {
              try {
                let newString;
                // @ts-ignore
                e.target && (newString = e.target.value || "");
                setMessage(newString);
              } catch (err) {}
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
          <IconButton type="submit" disabled={!isSocketConnected}>
            <SendIcon color="primary" />
          </IconButton>
          <ImageUpload />
        </Box>
      </Box>
    </Box>
  );
}
