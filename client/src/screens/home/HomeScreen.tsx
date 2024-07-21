import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/chat");
  }, []);
  return <></>;
}
