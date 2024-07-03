import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Auth from "./screens/auth";
import ChatScreen from "./screens/chat";
import Delete from "./screens/delete";
import { useFirebaseAuth } from "./firebase/authContext";

function App() {
  const navigate = useNavigate();
  const { loading, user } = useFirebaseAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/chat");
      } else {
        navigate("/auth");
      }
    }
  }, [navigate, user, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/chat" element={<ChatScreen />} />
      <Route path="/del123" element={<Delete />} />
    </Routes>
  );
}

export default App;
