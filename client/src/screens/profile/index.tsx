import {
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { useFirebaseAuth } from "../../firebase/authContext";
import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";
import slug from "slug";
import { Edit } from "@mui/icons-material";
import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase/config";
import { useCallback, useEffect, useState } from "react";
import {
  getNotificationStatus,
  updateNotificationStatus,
} from "../../api/http";

export default function ProfileScreen() {
  const { user } = useFirebaseAuth();
  const theme = useTheme();
  if (!user) return null;
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [switchDisabled, setSwitchDisabled] = useState(false);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });
        localStorage.setItem("message_token", token);
        // send this token to server
      } else {
        alert("You denied the notification request");
      }
    } catch (err) {
      alert("You denied the notification request");
    }
  };

  const getNotificationStatusCallback = useCallback(async () => {
    try {
      const { status } = await getNotificationStatus();
      let newNotificationStatus = status === "true" ? true : false;
      setNotificationStatus(newNotificationStatus);
    } catch (err) {}
  }, []);

  const handleNotificationChange = async (
    _event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSwitchDisabled(true);
    try {
      if (Notification.permission !== "granted") requestPermission();
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      localStorage.setItem("message_token", token);
      await updateNotificationStatus({ status: !notificationStatus, token });
      await getNotificationStatusCallback();
    } catch (err) {
    } finally {
      setSwitchDisabled(false);
    }
  };

  useEffect(() => {
    const debounceCall = setTimeout(() => {
      getNotificationStatusCallback();
    }, 500);
    return () => {
      clearInterval(debounceCall);
    };
  });

  return (
    <Container
      sx={{
        pt: 2,
        borderRight: "dashed",
        borderLeft: "dashed",
        borderColor: theme.palette.grey["200"],
        flex: 1,
      }}
      maxWidth="sm"
    >
      {/* section for user avatar and name */}
      <Box
        sx={{
          display: "flex",
          columnGap: 2,
          rowGap: 2,
          alignItems: "start",
          width: "100%",
        }}
      >
        <Box
          sx={{
            height: { xs: 75, md: 100 },
            borderRadius: theme.shape.borderRadius,
            aspectRatio: 1,
            overflow: "hidden",
          }}
        >
          {(() => {
            const avatarUri = createAvatar(thumbs, {
              seed: user.displayName || "Anonymous",
            }).toDataUri();
            return (
              <img
                src={avatarUri}
                height={"100%"}
                width={"100%"}
                style={{ aspectRatio: 1 }}
              />
            );
          })()}
        </Box>
        <Box sx={{ display: "flex", rowGap: 1, flexDirection: "column" }}>
          <Typography variant="h3" sx={{ fontSize: { xs: 24, md: 32 } }}>
            {user.displayName || "Anonymous"}
          </Typography>
          <Container
            sx={(theme) => ({
              backgroundColor: theme.palette.grey[100],
              borderRadius: theme.shape.borderRadius,
              py: 0.5,
              width: "100%",
            })}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: theme.typography.caption.fontSize,
                  md: theme.typography.body1.fontSize,
                },
              }}
            >
              {slug(user.displayName || "Anonymous")}
            </Typography>
          </Container>
        </Box>
        <Box>
          <IconButton color="primary">
            <Edit />
          </IconButton>
        </Box>
      </Box>
      <List>
        <ListItem>
          <ListItemText primary={"Allow Notifications"} />
          <ListItemSecondaryAction>
            <Switch
              onChange={handleNotificationChange}
              disabled={switchDisabled}
              checked={notificationStatus}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Container>
  );
}
