import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHelper } from "@/services/FetchHelper";
import { useAuth } from "@/contexts/AuthContexts";
import { useAppProvider } from "@/contexts/AppContext";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { validationSchema } from "@/services/GeneralHelper";
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
    <div className="h-[100vh]">
      <div className="w-full h-[25vh] bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] align-middle content-center">
        <img
          src="/logo-kemnaker.webp"
          alt="logo"
          width="250"
          className="ml-[12%]"
        ></img>
        <img
          src="/logo-kemnaker-decoration.webp"
          alt="logo"
          width=""
          height=""
          className="ml-[12%]"
        ></img>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "45vw 55vw",
          height: "75vh",
        }}
      >
        <div
          style={{
            margin: "5rem auto",
            display: "flex",
            gap: "2rem",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "90%",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 28 }}>
              Selamat Datang di SiAKBAR
            </span>
            <br></br>
            <span style={{ fontWeight: 600, fontSize: 16, color: "#898A8D" }}>
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
        </div>
        {/* <div
          style={{
            backgroundImage: 'url("/login-background-2.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            // height: "100vh",
            width: "100%",
          }}
        ></div> */}
      </div>
    </div>
  );
}

export default LoginPage;
