import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";
import { AppContext } from "@/contexts/AppContext";
import {
  isAuthorizedRoute,
  getRedirectPathOnDenied,
  getDefaultRedirectPath,
} from "@/services/authorizationHelper";

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  </div>
);

const PrivateRoute = ({ children }) => {
  const { auth, isInitializing } = useAuth();
  const { userData, listMenu } = useContext(AppContext);
  const location = useLocation();

  const [authState, setAuthState] = useState({
    isChecking: true,
    isAllowed: false,
    redirectTo: null,
  });

  useEffect(() => {
    if (isInitializing) {
      setAuthState({ isChecking: true, isAllowed: false, redirectTo: null });
      return;
    }

    if (!auth?.accessToken) {
      setAuthState({
        isChecking: false,
        isAllowed: false,
        redirectTo: "/",
      });
      return;
    }

    if (!userData) {
      setAuthState({ isChecking: true, isAllowed: false, redirectTo: null });
      return;
    }

    const menusWithStaticRoutes = [
      ...(listMenu || []),
      { path: "/satuan-kerja" },
      { path: "/" },
      { path: "/compilation" },
      { path: "/user-management" },
      { path: "/soon" },
    ];

    const isAllowed = isAuthorizedRoute(
      location.pathname,
      userData,
      menusWithStaticRoutes
    );

    if (isAllowed) {
      setAuthState({
        isChecking: false,
        isAllowed: true,
        redirectTo: null,
      });
      return;
    }

    const redirectPath = getRedirectPathOnDenied(
      location.pathname,
      userData.role
    );

    console.log("Access denied, redirecting to:", redirectPath);

    setAuthState({
      isChecking: false,
      isAllowed: false,
      redirectTo: redirectPath,
    });
  }, [
    isInitializing,
    auth?.accessToken,
    userData,
    listMenu,
    location.pathname,
    auth,
  ]);

  if (authState.isChecking) {
    return <LoadingScreen />;
  }

  if (authState.redirectTo) {
    return (
      <Navigate
        to={authState.redirectTo}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (authState.isAllowed) {
    return children;
  }

  return <LoadingScreen />;
};

export default PrivateRoute;
