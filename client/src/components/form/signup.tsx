import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { ReactEventHandler, useCallback, useRef } from "react";
import { signupUser } from "../../api/http";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const signupHandler = useCallback(
    async (e: Parameters<typeof signupUser>[0]) => {
      try {
        const message = await signupUser(e);
        alert(message);
        navigate("/chat");
      } catch (_err: unknown) {
        /** */
      }
    },
    [navigate]
  );

  const submitHandler: ReactEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const username: string = e.currentTarget["username"]?.value;
    const password: string = e.currentTarget["password"]?.value;
    const confirmPassword: string = e.currentTarget["confirm_password"]?.value;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    signupHandler({ username, password });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4">Sign Up</Typography>
      <Box
        component={"form"}
        sx={{ display: "flex", flexDirection: "column", gap: 2, my: 4 }}
        id="signup_form"
        ref={formRef}
        onSubmit={submitHandler}
      >
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          autoComplete="username"
          name="username"
          required
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: "100%",
          }}
        >
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            autoComplete="password"
            type="password"
            name="password"
            fullWidth
            required
          />
          <TextField
            id="cnf-password"
            label="Confirm Password"
            variant="outlined"
            autoComplete="password"
            type="password"
            name="confirm_password"
            fullWidth
            required
          />
        </Box>
        <Box>
          <Button variant="contained" type="submit">Sign Up</Button>
        </Box>
      </Box>
    </Paper>
  );
}
