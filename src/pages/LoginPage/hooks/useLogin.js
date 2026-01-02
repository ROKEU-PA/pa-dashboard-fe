import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchHelper } from "@/services/FetchHelper";
import { useAuth } from "@/contexts/AuthContexts";
import { useAppProvider } from "@/contexts/AppContext";
import { encryptPassword } from "@/utils/encryption";
import { ROUTES, TEXT, SESSION_KEYS } from "../constants";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { LoadUser } = useAppProvider();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = useCallback(
    async (formData) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (!formData.satker || !formData.password) {
          throw new Error("Satuan Kerja dan Password harus diisi");
        }

        const encryptedPassword = encryptPassword(formData.password);
        const payload = {
          kode_biro: parseInt(formData.satker, 10),
          password: encryptedPassword,
        };

        const response = await fetchHelper(
          process.env.REACT_APP_API_BASE_URL + `/auth/login`,
          "POST",
          payload
        );

        if (response?.success) {
          const accessToken = response?.data?.access_token;

          login(accessToken);
          sessionStorage.setItem(SESSION_KEYS.JUST_LOGGED_IN, "true");

          await LoadUser();

          // Navigate to dashboard
          navigate(ROUTES.DASHBOARD);

          toast.success("Login berhasil!");
          return { success: true };
        } else {
          const errorMsg = response?.message || TEXT.ERROR_GENERIC;
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (error) {
        console.error("Login error:", error);

        const errorMsg = error.toString().includes("Unauthorized")
          ? TEXT.ERROR_UNAUTHORIZED
          : error.message || TEXT.ERROR_GENERIC;

        setErrorMessage(errorMsg);
        toast.error(errorMsg);

        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, login, LoadUser]
  );

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    isLoading,
    errorMessage,
    handleLogin,
    clearError,
  };
};
