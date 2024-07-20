import SendIcon from "@mui/icons-material/Send";
import {
  Autocomplete,
  Box,
  Container,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import { ReactEventHandler, useEffect, useState } from "react";
import socket from "../../api/socket";
import ImageUpload from "./ImageUpload";
import { Close as CloseIcon } from "@mui/icons-material";

import { useChatContext } from "./ChatContext";

const USERS_COUNT_EVENT = "users:count";
const MESSAGE_SEND_EVENT = "message:send";
const MESSAGE_SEND_EVENT_2 = "message:send2";

export default function ChatMessageForm() {
  const [userCount, setUserCount] = useState(1);
  const [message, setMessage] = useState<string>("");
  const [messageBoxDisabled, setMessageBoxDisabled] = useState(false);
  const { isSocketConnected, imageContent, setImageContent } = useChatContext();

  const theme = useTheme();

  const submitHandler: ReactEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setMessageBoxDisabled(true);
    try {
      if (imageContent) {
        socket.emit(
          MESSAGE_SEND_EVENT_2,
          JSON.stringify({ kind: "image", data: imageContent })
        );
        setImageContent(null);
      }
      if (message) {
        if (message === "") {
          alert("Please enter a message");
          return;
        }
        socket.emit(
          MESSAGE_SEND_EVENT_2,
          JSON.stringify({ kind: "text", data: message })
        );
        e.currentTarget.reset();
        setMessage("");
      }
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
                  endAdornment={
                    imageContent && (
                      <Box
                        sx={{
                          position: "relative",
                          borderRadius: theme.shape.borderRadius,
                          overflow: "hidden",
                          boxShadow: theme.shadows[1],
                        }}
                        height={100}
                        width={100}
                      >
                        <img
                          src={imageContent}
                          style={{
                            objectFit: "contain",
                            height: "100%",
                            width: "100%",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => setImageContent(null)}
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            cursor: "pointer",
                            backgroundColor: "white",
                            borderRadius: "100%",
                            zIndex: 10,
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    )
                  }
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
