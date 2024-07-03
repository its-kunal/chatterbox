import { Box, Grid, Typography } from "@mui/material";
import Signup from "../../components/form/signup";
import Login from "../../components/form/login";

function Auth() {
  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="h3" textAlign={"center"} mt={2}>
        Welcome to Chatterbox
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Grid container maxWidth="md" spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Signup />
          </Grid>
          <Grid item xs={12} md={6}>
            <Login />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Auth;
