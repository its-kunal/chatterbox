import { Paper, Typography, Box, TextField, Button } from "@mui/material";
import React, { ReactEventHandler, useCallback, useRef } from "react";
import { loginUser } from "../../api/http";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const loginHandler = useCallback(
    async (e: Parameters<typeof loginUser>[0]) => {
      try {
        const message = await loginUser(e);
        alert(message);
        navigate("/chat");
      } catch (_err: unknown) { /* empty */ }
    },
    [navigate]
  );

  const handleSubmit: ReactEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const username: string = e.currentTarget["username"]?.value;
    const password: string = e.currentTarget["password"]?.value;
    loginHandler({ username, password });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4">Log In</Typography>
      <Box
        component={"form"}
        sx={{ display: "flex", flexDirection: "column", gap: 2, my: 4 }}
        id="signup_form"
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          autoComplete="username"
          name="username"
          required
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          autoComplete="password"
          type="password"
          name="password"
          required
        />
        <Box>
          <Button variant="contained" type="submit">
            Log In
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
