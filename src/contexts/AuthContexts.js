// contexts/AuthContexts.jsx
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Helper functions
const getStoredAuth = () => {
  try {
    const stored = sessionStorage.getItem("auth");
    return stored ? JSON.parse(stored) : { accessToken: null, user: null };
  } catch {
    return { accessToken: null, user: null };
  }
};

const setStoredAuth = (authData) => {
  if (authData.accessToken) {
    sessionStorage.setItem("auth", JSON.stringify(authData));
  } else {
    sessionStorage.removeItem("auth");
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth());
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setStoredAuth(auth);
  }, [auth]);

  useEffect(() => {
    setIsInitializing(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });

      const authData = {
        accessToken: res.data.accessToken,
        user: res.data.user,
      };

      setAuth(authData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    setAuth({ accessToken: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, isInitializing, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
