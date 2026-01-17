import { fetchMenu, fetchUser } from "@/pages/Menu/menuHooks";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContexts";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { auth } = useAuth();
  const [menuName, setMenuName] = useState("");
  const [listMenu, setListMenu] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isSAdmin, setIsSAdmin] = useState(null);
  const token = auth?.accessToken;

  useEffect(() => {
    if (token) {
      const loadMenu = async () => {
        try {
          const menuData = await fetchMenu(token);
          console.log(auth?.accessToken, menuData);
          setListMenu(menuData.data);
        } catch (error) {
          console.error("Error loading menu:", error);
        }
      };

      loadMenu();
    }
  }, [setListMenu, token]);

  const handleChangeMenu = (value) => {
    setMenuName(value);
  };
  useEffect(() => {
    if (userData) {
      if (userData?.role === "admin") {
        setIsAdmin(true);
      }
      if (userData?.role === "super_admin") {
        setIsSAdmin(true);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (token) {
      LoadUser();
    }
  }, [token]);

  const LoadUser = async () => {
    try {
      const userData = await fetchUser(token);
      setUserData(userData.data);
    } catch (error) {
      console.error("Error loading menu:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        menuName,
        handleChangeMenu,
        listMenu,
        setListMenu,
        userData,
        setUserData,
        LoadUser,
        isAdmin,
        isSAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppProvider = () => useContext(AppContext);
