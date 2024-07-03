import { Box, Container, Grid, Typography } from "@mui/material";
import GoogleSignIn from "../../components/form/googleSignIn";
import LogoutFn from "../../components/form/logout";
import { useFirebaseAuth } from "../../firebase/authContext";

function Auth() {
  const { user } = useFirebaseAuth();
  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="h3" textAlign={"center"} mt={2}>
        Welcome to Chatterbox
      </Typography>
      {user && (
        <Container maxWidth="sm" sx={{ mt: 2 }}>
          <LogoutFn />
        </Container>
      )}
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Grid container maxWidth="sm" spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <GoogleSignIn />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Auth;
