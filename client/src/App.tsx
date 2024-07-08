import { Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
const Auth = lazy(() => import("./screens/auth"));
const ChatScreen = lazy(() => import("./screens/chat"));
const Delete = lazy(() => import("./screens/delete"));
import { useFirebaseAuth } from "./firebase/authContext";
import { Box, CircularProgress, Container } from "@mui/material";
import Appbar from "./components/navbar/appbar";

function Spinner() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Container>
  );
}

function App() {
  const navigate = useNavigate();
  const { loading, user } = useFirebaseAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      }
    }
  }, [navigate, user, loading]);

  if (loading) return <Spinner />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "100vh",
        height: "100vh",
      }}
    >
      <Appbar />
      <Routes>
        <Route
          path="/auth"
          element={
            <Suspense fallback={<Spinner />}>
              <Auth />
            </Suspense>
          }
        />
        <Route
          path="/chat"
          element={
            <Suspense fallback={<Spinner />}>
              <ChatScreen />
            </Suspense>
          }
        />
        <Route
          path="/del123"
          element={
            <Suspense fallback={<Spinner />}>
              <Delete />
            </Suspense>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
