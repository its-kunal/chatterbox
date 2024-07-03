import { Logout } from "@mui/icons-material";
import { Button, Container } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

export default function LogoutFn() {
  const logoutHandler = async () => {
    await signOut(auth);
    localStorage.removeItem("auth_token");
  };
  return (
    <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button startIcon={<Logout />} onClick={logoutHandler}>
        Log Out
      </Button>
    </Container>
  );
}
