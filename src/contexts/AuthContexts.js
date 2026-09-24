import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

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
    const handleTokenRefreshed = (e) => {
      setAuth((prev) => ({ ...prev, accessToken: e.detail }));
    };

    const handleForceLogout = () => {
      setAuth({ accessToken: null, user: null });
    };

    window.addEventListener("onTokenRefreshed", handleTokenRefreshed);
    window.addEventListener("forceLogout", handleForceLogout);

    return () => {
      window.removeEventListener("onTokenRefreshed", handleTokenRefreshed);
      window.removeEventListener("forceLogout", handleForceLogout);
    };
  }, []);

  useEffect(() => {
    setIsInitializing(false);
  }, []);

  const logout = async () => {
    try {
      if (auth.accessToken) {
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${auth.accessToken}`
          },
          credentials: "include"
        });
      }
    } catch (error) {
      console.error("Gagal lapor logout ke backend:", error);
    } finally {
      setAuth({ accessToken: null, user: null });
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, isInitializing, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);