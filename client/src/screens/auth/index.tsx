import { Button, Container, Typography } from "@mui/material";
import HeroSvg from "./HeroSvg.svg";
import { Google } from "@mui/icons-material";
import {
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";
import { useCallback } from "react";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

function Auth() {
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

  const anonymousSignInHandler = useCallback(async () => {
    try {
      await signInAnonymously(auth);
      navigate("/chat");
    } catch (_err: unknown) {
      /* empty */
    }
  }, []);

  return (
    <Container sx={{ px: 2 }} maxWidth="md">
      <Typography variant="h3" textAlign={"center"} mt={2}>
        Welcome to Chatterbox
      </Typography>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: 2,
          my: 1,
          maxHeight: 600,
        }}
      >
        <HeroSvg />
        <Button
          startIcon={<Google />}
          variant="contained"
          onClick={loginHandler}
        >
          Sign In Now
        </Button>
        <Button onClick={anonymousSignInHandler}>Sign In Anonymously</Button>
      </Container>
    </Container>
  );
}

export default Auth;
