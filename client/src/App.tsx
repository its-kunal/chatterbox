import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Auth from "./screens/auth";
import ChatScreen from "./screens/chat";
import Delete from "./screens/delete";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      navigate("/auth");
    } else {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/chat" element={<ChatScreen />} />
      <Route path="/del123" element={<Delete />} />
    </Routes>
  );
}

export default App;
