import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";

import { useCallback } from "react";
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

export default function Appbar() {
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();
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

  return (
    <Box sx={{  }}>
      <AppBar position="sticky">
        <Toolbar>
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
    </Box>
  );
}
