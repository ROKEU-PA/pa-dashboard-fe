// contexts/AuthContexts.jsx
import { Axios } from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: null,
    user: null,
  });

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await Axios.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );

        setAuth((prev) => ({
          ...prev,
          accessToken: res.data.accessToken,
        }));
      } catch {
        setAuth({ accessToken: null, user: null });
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
