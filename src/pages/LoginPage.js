import React, { useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { fetchHelper } from "../services/FetchHelper";
// import { useAuth } from "../auth/AuthContext";
import { useAuth } from "../contexts/AuthContexts";
import { useAppProvider } from "../contexts/AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import { validationSchema } from "../services/GeneralHelper";
import { toast } from "react-toastify";

function LoginPage() {
  const navigate = useNavigate();
  const { LoadUser } = useAppProvider();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({
    satker: "",
    password: "",
  });

  // State untuk mendeteksi desktop
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  // Update isDesktop saat resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var CryptoJS = require("crypto-js");
    var encryptedPass = CryptoJS.AES.encrypt(
      formData.password,
      "YzDWFXF8LmfUMdOn0RtZ0rYC90zF5wpoz87oCk"
    ).toString();

    try {
      const response = await fetchHelper(
        "https://rokeubmn.kemnaker.go.id/api/auth/login",
        "POST",
        { kode_biro: parseInt(formData.satker), password: encryptedPass }
      );
      if (response?.success) {
        login(response?.data?.access_token);
        sessionStorage.setItem("justLoggedIn", "true");
        LoadUser();
        navigate("/dashboard-utama");
        setErrorMessage(null);
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      setErrorMessage(
        err.toString().includes("Unauthorized")
          ? "Kode Satuan Kerja atau Password salah!"
          : err.toString()
      );
      console.log(err, err.toString());
      toast.error(err);
    } finally {
    }
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "45vw 55vw" : "1fr",
          height: "100vh",
        }}
      >
        <div style={{ margin: "25% 30%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <img src="/logo-kemnaker-ori.png" alt="logo" width="200"></img>
          </div>
          <div
            style={{
              width: "100%",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 28 }}>
              Selamat Datang di SiAKBAR
            </span>
            <br></br>
            <span style={{ fontWeight: 600, fontSize: 16 }}>
              Anggaran, Keuangan, dan Barang
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: 20, flexDirection: "column" }}
          >
            <Input
              label="Satuan Kerja"
              name="satker"
              required
              value={formData.satker}
              validate={validationSchema.onlyNumber}
              onChange={handleChange}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            {errorMessage && (
              <span style={{ fontSize: 16, textAlign: "center", color: "red" }}>
                {errorMessage}
              </span>
            )}

            <Button type="submit" style={{ width: "100%" }}>
              Login
            </Button>
          </form>
        </div >
         {isDesktop && (
        <div
          style={{
            backgroundImage: 'url("/login-background-2.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
            width: "100%",
          }}
        ></div>
         )}
      </div>
    </div>
  );
}

export default LoginPage;
