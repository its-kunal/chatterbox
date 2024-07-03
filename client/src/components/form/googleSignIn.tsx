import { Box, Button, Paper, Typography } from "@mui/material";
import {
  GoogleAuthProvider,
  browserSessionPersistence,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../../firebase/config";
import { Google } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function GoogleSignIn() {
  const navigate = useNavigate();

  const authenticateUser = async () => {
    const provider = new GoogleAuthProvider();
    await setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithPopup(auth, provider);
      })
      .catch(() => {
        return;
      });
    navigate("/chat");
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4">Please Authenticate Yourself</Typography>
      <Box sx={{ display: "flex", mt: 2, justifyContent: "center" }}>
        <Button
          onClick={authenticateUser}
          startIcon={<Google />}
          variant="contained"
        >
          Sign in with Google
        </Button>
      </Box>
    </Paper>
  );
}
