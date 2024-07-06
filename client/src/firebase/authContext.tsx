import { User, onAuthStateChanged } from "firebase/auth";
import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "./config";
import socket from "../api/socket";

interface AuthContextType {
  user?: User;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  loading: true,
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [user, setUser] = useState<AuthContextType["user"]>(undefined);
  const [loading, setLoading] = useState<AuthContextType["loading"]>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user !== null) {
        setUser(user);
        const authToken = await user.getIdToken();
        localStorage.setItem("auth_token", authToken);
        // @ts-ignore
        socket.io.opts.extraHeaders["authorization"] = `Bearer ${authToken}`;
      } else {
        setUser(undefined);
        localStorage.removeItem("auth_token");
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  return useContext(AuthContext);
}
