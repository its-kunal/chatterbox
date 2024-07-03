import { useEffect } from "react";
import { deleteChats } from "../../api/http";
import { useNavigate } from "react-router-dom";

export default function Delete() {
  const navigate = useNavigate();
  useEffect(() => {
    deleteChats().then(() => {
      navigate("/auth");
    });
  }, [navigate]);
  return <div>Hey</div>;
}
