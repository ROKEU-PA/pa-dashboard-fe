import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchHelper } from "@/services/FetchHelper";
import { useAuth } from "@/contexts/AuthContexts";
import { useAppProvider } from "@/contexts/AppContext";
import { encryptPassword } from "@/utils/encryption";
import { ROUTES, TEXT } from "../constants";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { LoadUser } = useAppProvider();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = useCallback(
    async (formData) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (!formData?.satker || !formData?.password) {
          throw new Error("Satuan Kerja dan Password harus diisi");
        }

        const encryptedPassword = encryptPassword(formData.password);

        const payload = {
          kode_biro: Number(formData.satker),
          password: encryptedPassword,
          captcha: formData.captcha || "",
        };
        
        const response = await fetchHelper(
          `${process.env.REACT_APP_API_BASE_URL}/auth/loginV2`,
          "POST",
          payload,
          { credentials: "include" }                            
        );

        if (!response?.success) {
          throw new Error(response?.message || TEXT.ERROR_GENERIC);
        }

        const accessToken = response?.data?.access_token;
        
        setAuth({
          accessToken,
          user: null, 
        });

        await LoadUser(); 

        toast.success("Login berhasil!");
        navigate(ROUTES.DASHBOARD);

        return { success: true };
      } catch (error) {
        console.error("Login error:", error);

        let errorMsg = error.message || TEXT.ERROR_GENERIC;
        let statusCode = 400;

        if (errorMsg.includes("Unauthorized") || errorMsg.includes("salah")) {
          errorMsg = "Biro Code atau Password salah.";
          statusCode = 401;
        } else if (errorMsg.includes("Terlalu banyak percobaan") || errorMsg.includes("Too Many Attempts")) {
          errorMsg = error.message;
          statusCode = 429;
        }

        setErrorMessage(errorMsg);
        toast.error(errorMsg);

        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setAuth, LoadUser]
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