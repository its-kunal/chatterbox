import { Button, Container, Divider, Typography } from "@mui/material";
import HeroSvg from "../../assets/hero.svg";
import { Google } from "@mui/icons-material";
import {
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
  signInWithPopup,
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

  return (
    <Container sx={{ px: 2 }} maxWidth="md">
      <Typography variant="h3" textAlign={"center"} mt={2}>
        Welcome to Chatterbox
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: 2,
          my: 2,
        }}
      >
        <img src={HeroSvg} height={300} />
        <Button
          startIcon={<Google />}
          variant="contained"
          onClick={loginHandler}
        >
          Sign In Now
        </Button>
      </Container>
    </Container>
  );
}

export default Auth;
