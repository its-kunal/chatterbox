import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Close as CloseIcon, Person } from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Pin";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCallback, useState } from "react";
import { useFirebaseAuth } from "../../firebase/authContext";

import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import {
  GoogleAuthProvider,
  browserSessionPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";

interface AppBarDrawerParameterTypes {
  open: boolean;
  onClose: () => void;
}

function AppBarDrawer({ open, onClose }: AppBarDrawerParameterTypes) {
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();

  const chatHandler = () => {
    navigate("/chat");
    onClose();
  };
  const AboutHandler = () => {
    navigate("/about");
    onClose();
  };
  const profileHandler = () => {
    navigate("/profile");
    onClose();
  };
  const LoginHandler = () => {
    navigate("/auth");
    onClose();
  };
  const LogoutHandler = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          columnGap: 4,
          py: 1,
          px: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Chatterbox</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItemButton onClick={chatHandler}>
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText>Chats</ListItemText>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={AboutHandler}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText>About Project</ListItemText>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={profileHandler}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={user ? LogoutHandler : LoginHandler}>
          <ListItemIcon>{user ? <LogoutIcon /> : <LoginIcon />}</ListItemIcon>
          <ListItemText>{user ? "Logout" : "Login"}</ListItemText>
        </ListItemButton>
        <Divider />
      </List>
    </Drawer>
  );
}

export default function Appbar() {
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const loginHandler = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      await setPersistence(auth, browserSessionPersistence)
        .then(() => {
          return signInWithPopup(auth, provider);
        })
        .catch(() => {
          return;
        });
      navigate("/chat");
    } catch (_err: unknown) {
      /* empty */
    }
  }, [navigate]);

  const logoutHandler = useCallback(async () => {
    await signOut(auth);
    localStorage.removeItem("auth_token");
  }, []);

  const toogleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <Box sx={{}}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toogleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chatterbox
          </Typography>
          {user ? (
            <Button color="inherit" onClick={logoutHandler}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={loginHandler}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <AppBarDrawer open={open} onClose={closeDrawer} />
    </Box>
  );
}
