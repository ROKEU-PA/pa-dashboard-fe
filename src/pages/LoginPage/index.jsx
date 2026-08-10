// src/pages/LoginPage/index.jsx
import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useLogin } from "./hooks/useLogin";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { useFormValidation } from "./hooks/useFormValidation";
import { ASSETS, TEXT, FORM_FIELDS, BREAKPOINTS } from "./constants";
import { styles } from "./styles";
import "index.css";
import { validationSchema } from "@/services/GeneralHelper";
import ReCAPTCHA from "react-google-recaptcha";
import AnimationBackground from "./AnimatedBackground";
import { apiRequest } from "@/services/APIHelper";

const LoginPage = () => {
  // Custom hooks
  let SITE_KEY = process.env.REACT_APP_SITE_KEY;
  const { isLoading, errorMessage, handleLogin, clearError } = useLogin();
  const isDesktop = useMediaQuery(BREAKPOINTS.MOBILE);

  // State Form
  const { formData, handleChange } = useFormValidation({
    [FORM_FIELDS.SATKER]: "",
    [FORM_FIELDS.PASSWORD]: "",
  });

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaToken, setCaptchaToken] = useState("");
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [countSPP, setCountSPP] = useState({});
  const [percentageSPP, setPercentageSPP] = useState(0);

  const fetchCount = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_BASE_URL + "/external/stats?now=1",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (data && data.success) {
        setCountSPP(data.data);
        setPercentageSPP((data.data?.progress / data.data?.total) * 100);
      }
    } catch (error) {
      console.error("Gagal ambil stats:", error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const recaptchaRef = useRef(null);

  useEffect(() => {
    let timer;
    if (lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setFailedAttempts(0);
            setCaptchaToken("");
            if (recaptchaRef.current) {
              recaptchaRef.current.reset();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lockoutTimer]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (lockoutTimer > 0) return;

    if (failedAttempts >= 3 && !captchaToken) {
      alert("Silakan selesaikan CAPTCHA terlebih dahulu!");
      return;
    }

    const response = await handleLogin({ ...formData, captcha: captchaToken });

    if (!response?.success) {
      const newFails = failedAttempts + 1;
      setFailedAttempts(newFails);

      if (response?.status === 429) {
        setLockoutTimer(15 * 60);
      } else {
        setCaptchaToken("");
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      }
    } else {
      setFailedAttempts(0);
      setCaptchaToken("");
    }
  };

  const handleInputChange = (event) => {
    handleChange(event);
    if (errorMessage) clearError();
  };

  // Format detik ke MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-white bg-[#071d48]">
      <AnimationBackground bgImage={ASSETS.BUILDING_IMAGE_2} />

      {lockoutTimer > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Akses Diblokir Sementara
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Terlalu banyak percobaan login yang gagal. Demi keamanan, akun/IP
              Anda diblokir selama 15 menit.
            </p>
            <div className="text-3xl font-mono font-bold text-red-600 bg-red-50 py-3 rounded-lg">
              {formatTime(lockoutTimer)}
            </div>
          </div>
        </div>
      )}

      {/* =========================================
        4. MAIN LAYOUT GRID 
    ============================================= */}
      <div className="relative z-10 min-h-screen p-6 md:p-12 lg:p-16 grid lg:grid-cols-[minmax(430px,560px)_minmax(400px,1fr)] items-center gap-12 lg:gap-[140px] max-w-[1500px] mx-auto">
        {/* --- KOLOM KIRI (FORM LOGIN) --- */}
        <section
          className="w-full max-w-[610px] mx-auto lg:mx-0"
          aria-label="Form login E-SPP"
        >
          {/* Header Identitas */}
          <header className="flex items-center gap-[15px] md:gap-[28px] mb-[30px] ml-1 md:ml-1.5 opacity-0 translate-y-[-12px] animate-[fadeIn_0.95s_ease_0.15s_forwards]">
            <div className="w-[78px] h-[78px] md:w-[122px] md:h-[122px] flex items-center justify-center p-3 border border-white/30 rounded-[21px] md:rounded-[30px] bg-white/90 shadow-[0_13px_30px_rgba(0,8,35,0.22),inset_0_1px_rgba(255,255,255,0.9)]">
              <img
                src={ASSETS.LOGO_DARK}
                alt="Logo Kemnaker"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-[12px] md:text-[20px] tracking-[0.12em] uppercase text-[#c9e4ff] font-[850] leading-[1.2]">
                Kementerian Ketenagakerjaan RI
              </div>
              <div className="mt-[5px] md:mt-[10px] text-[18px] md:text-[29px] font-[850] text-white leading-[1.15]">
                Biro Keuangan dan BMN
              </div>
            </div>
          </header>

          {/* Login Card Glassmorphism */}
          <div className="relative p-[27px] md:p-[48px] border border-white/60 rounded-[25px] md:rounded-[32px] bg-gradient-to-br from-white/90 to-[#e1f0ff]/60 shadow-[0_30px_80px_rgba(0,12,45,0.35),inset_0_1px_rgba(255,255,255,0.95)] backdrop-blur-xl overflow-hidden opacity-0 translate-y-[20px] animate-[cardRise_1s_cubic-bezier(0.2,0.8,0.2,1)_0.25s_forwards]">
            {/* Card Blur Overlay */}
            <div className="absolute w-[330px] h-[230px] right-[-140px] top-[-120px] rounded-full bg-[radial-gradient(circle,rgba(66,165,245,0.30),transparent_66%)] pointer-events-none"></div>

            <p className="m-0 mb-2 text-[#1565C0] text-[12px] font-[850] tracking-[0.18em] uppercase">
              Digital Financial Management
            </p>
            <h1 className="m-0 text-[#0A2A66] text-[44px] md:text-[64px] leading-[0.95] tracking-tight font-bold">
              E-SPP
            </h1>
            <p className="mt-[12px] mb-[6px] text-[#37567d] text-[17px] font-[650] leading-[1.4]">
              Sistem Elektronik Surat Permintaan Pembayaran
            </p>
            <p className="m-0 mb-[27px] text-[#6680a2] text-[13px] italic tracking-wide">
              Cepat • Transparan • Akuntabel
            </p>

            {/* Alert Error (Struktur Lama Lu) */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-lg text-[13px] font-[650] text-[#9b2525] bg-[#ffe8e8e6] border border-[#f5c5c5]"
              >
                {errorMessage}
              </div>
            )}

            {/* Form Utama */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Input Username */}
              <div className="mb-[15px]">
                <label
                  className="block m-0 mb-[7px] ml-[4px] text-[#36577f] text-[12px] font-[800] tracking-wide"
                  htmlFor="username"
                >
                  Username
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-[17px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-[#6e86a8] pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
                  </svg>
                  <input
                    id="username"
                    name={FORM_FIELDS.SATKER}
                    type="text"
                    required
                    value={formData[FORM_FIELDS.SATKER]}
                    onChange={handleInputChange}
                    placeholder="Masukkan username"
                    autoComplete="username"
                    disabled={isLoading || lockoutTimer > 0}
                    className="w-full h-[57px] px-[52px] border border-[#648ec259] rounded-[14px] outline-none bg-white/70 text-[#173762] text-[16px] font-[650] shadow-[inset_0_1px_rgba(255,255,255,0.9)] transition-all duration-200 placeholder:text-[#8a9ab3] placeholder:font-medium focus:border-[#1565C0] focus:bg-white/95 focus:shadow-[0_0_0_4px_rgba(21,101,192,0.11),0_8px_18px_rgba(26,90,165,0.08)] disabled:opacity-70"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="mb-[15px]">
                <label
                  className="block m-0 mb-[7px] ml-[4px] text-[#36577f] text-[12px] font-[800] tracking-wide"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-[17px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-[#6e86a8] pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="5" y="10" width="14" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  <input
                    id="password"
                    name={FORM_FIELDS.PASSWORD}
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData[FORM_FIELDS.PASSWORD]}
                    onChange={handleInputChange}
                    placeholder="Masukkan password"
                    autoComplete="off"
                    disabled={isLoading || lockoutTimer > 0}
                    className="w-full h-[57px] px-[52px] border border-[#648ec259] rounded-[14px] outline-none bg-white/70 text-[#173762] text-[16px] font-[650] shadow-[inset_0_1px_rgba(255,255,255,0.9)] transition-all duration-200 placeholder:text-[#8a9ab3] placeholder:font-medium focus:border-[#1565C0] focus:bg-white/95 focus:shadow-[0_0_0_4px_rgba(21,101,192,0.11),0_8px_18px_rgba(26,90,165,0.08)] disabled:opacity-70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[42px] h-[42px] flex items-center justify-center border-0 rounded-full text-[#647c9e] bg-transparent cursor-pointer transition-colors hover:text-[#1565C0] hover:bg-[#1565c014]"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[23px] h-[23px]"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[23px] h-[23px]"
                      >
                        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                        <circle cx="12" cy="12" r="2.7" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* ReCAPTCHA (Struktur Lama Lu) */}
              {failedAttempts >= 3 && (
                <div className="mt-4 flex flex-col items-center justify-center w-full transition-all duration-500 ease-in-out animate-fadeIn">
                  <p className="text-xs text-red-500 mb-2 text-center font-medium">
                    Terdeteksi aktivitas mencurigakan. Selesaikan CAPTCHA di
                    bawah ini.
                  </p>
                  <div className="flex justify-center w-full min-h-[78px]">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={SITE_KEY}
                      onChange={(token) => setCaptchaToken(token)}
                      onExpired={() => setCaptchaToken("")}
                    />
                  </div>
                </div>
              )}

              {/* Tombol Login Beranimasi */}
              <button
                type="submit"
                disabled={isLoading || lockoutTimer > 0}
                className="relative w-full h-[60px] md:h-[70px] mt-[10px] border-0 rounded-[17px] md:rounded-[20px] overflow-hidden flex items-center justify-center gap-[18px] md:gap-[25px] text-white bg-gradient-to-r from-[#123fbd] via-[#086ce9] to-[#22c8e8] shadow-[0_15px_29px_rgba(21,101,192,0.31),inset_0_1px_0_rgba(255,255,255,0.24)] text-[22px] md:text-[26px] font-[850] cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_19px_33px_rgba(21,101,192,0.37)] hover:saturate-110 active:translate-y-0 disabled:opacity-72 disabled:cursor-wait group"
              >
                <svg
                  className="w-[29px] h-[29px] md:w-[34px] md:h-[34px] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 17l5-5-5-5"></path>
                  <path d="M15 12H3"></path>
                  <path d="M13 4h4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-4"></path>
                </svg>
                <span>{isLoading ? "Memproses..." : "Login"}</span>
                {/* Animasi Kilap di Tombol */}
                <div className="absolute top-0 -left-[110%] w-[60%] h-full -skew-x-[22deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 ease-in-out group-hover:left-[145%]"></div>
              </button>
            </form>

            {/* Trust Row / Footer Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-[23px] pt-[20px] border-t border-[#4b76a82e]">
              <div className="flex items-center justify-start md:justify-center gap-[7px] min-h-[39px] p-1.5 md:pl-[15px] rounded-[10px] text-[#24684d] bg-[#e6f9f0b8] text-[10.5px] font-[800] leading-[1.15] text-left md:text-center">
                <span className="shrink-0 w-[18px] h-[18px] flex items-center justify-center rounded-full text-white bg-[#35c98a] text-[11px] shadow-[0_4px_10px_rgba(53,201,138,0.25)]">
                  ✓
                </span>
                <span>Green Governance</span>
              </div>
              <div className="flex items-center justify-start md:justify-center gap-[7px] min-h-[39px] p-1.5 md:pl-[15px] rounded-[10px] text-[#24684d] bg-[#e6f9f0b8] text-[10.5px] font-[800] leading-[1.15] text-left md:text-center">
                <span className="shrink-0 w-[18px] h-[18px] flex items-center justify-center rounded-full text-white bg-[#35c98a] text-[11px] shadow-[0_4px_10px_rgba(53,201,138,0.25)]">
                  ✓
                </span>
                <span>Digital Transformation</span>
              </div>
              <div className="flex items-center justify-start md:justify-center gap-[7px] min-h-[39px] p-1.5 md:pl-[15px] rounded-[10px] text-[#24684d] bg-[#e6f9f0b8] text-[10.5px] font-[800] leading-[1.15] text-left md:text-center">
                <span className="shrink-0 w-[18px] h-[18px] flex items-center justify-center rounded-full text-white bg-[#35c98a] text-[11px] shadow-[0_4px_10px_rgba(53,201,138,0.25)]">
                  ✓
                </span>
                <span>Secure System</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- KOLOM KANAN (DASHBOARD STATS) --- */}
        {/* Sembunyikan di layar kecil jika tidak perlu, atau biarkan tetap ada sesuai responsive grid */}
        <aside
          className="w-full max-w-[650px] justify-self-center lg:justify-self-end pb-[25px] lg:pb-0 opacity-0 translate-x-[25px] animate-[sideReveal_1s_ease_0.5s_forwards]"
          aria-label="Statistik E-SPP"
        >
          {/* <div className="inline-flex items-center gap-[9px] mb-[14px] px-[12px] py-[7px] border border-white/10 rounded-full bg-[#041a4452] text-[#d5edff] text-[11px] font-[800] tracking-[0.13em] uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#57e7a7] animate-[pulse_2s_infinite]"></span>{" "}
            Sistem aktif
          </div> */}

          <h2 className="m-0 max-w-[600px] text-[39px] md:text-[clamp(36px,4.2vw,66px)] leading-[1.03] tracking-[-0.04em] shadow-black/30 drop-shadow-[0_8px_30px_rgba(0,12,45,0.30)]">
            Pengajuan dan Pengujian SPP dan Dokumen Pendukung dalam satu sistem
            terintegrasi.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mt-[24px]">
            {/* Card 1 */}
            <article className="min-h-[115px] md:min-h-[150px] p-[17px] md:p-[24px] border border-white/20 rounded-[21px] bg-gradient-to-br from-[#031b468c] to-[#1869be40] shadow-[0_17px_38px_rgba(0,13,43,0.22),inset_0_1px_rgba(255,255,255,0.14)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#70caff85] hover:from-[#06265bAD] hover:to-[#1879db4f]">
              <div className="flex items-center justify-between gap-[12px]">
                <span className="text-[#c9e3fa] text-[12px] font-[700]">
                  Total SPP Hari Ini
                </span>
                <span className="w-[40px] h-[40px] flex items-center justify-center rounded-[12px] text-[#ccecff] bg-[#42a5f530] border border-[#8ed3ff2e]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[22px] h-[22px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 3h10l3 3v15H4V3h3Z" />
                    <path d="M8 11h8M8 15h8M8 7h4" />
                  </svg>
                </span>
              </div>
              <strong className="block mt-[12px] text-[25px] md:text-[clamp(25px,2.2vw,36px)] font-[850] tracking-[-0.03em]">
                {countSPP?.total}
              </strong>
              <span className="block mt-1 text-[#9bcdf2] text-[11px]">
                Dokumen masuk hari ini
              </span>
            </article>

            {/* Card 2 */}
            <article className="min-h-[115px] md:min-h-[150px] p-[17px] md:p-[24px] border border-white/20 rounded-[21px] bg-gradient-to-br from-[#031b468c] to-[#1869be40] shadow-[0_17px_38px_rgba(0,13,43,0.22),inset_0_1px_rgba(255,255,255,0.14)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#70caff85] hover:from-[#06265bAD] hover:to-[#1879db4f]">
              <div className="flex items-center justify-between gap-[12px]">
                <span className="text-[#c9e3fa] text-[12px] font-[700]">
                  Total Nilai Transaksi
                </span>
                <span className="w-[40px] h-[40px] flex items-center justify-center rounded-[12px] text-[#ccecff] bg-[#42a5f530] border border-[#8ed3ff2e]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[22px] h-[22px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M7 15h4M16 9h.01" />
                  </svg>
                </span>
              </div>
              <strong className="block mt-[12px] text-[25px] md:text-[clamp(25px,2.2vw,36px)] font-[850] tracking-[-0.03em]">
                Rp5,48 M
              </strong>
              <span className="block mt-1 text-[#9bcdf2] text-[11px]">
                Akumulasi nilai hari berjalan
              </span>
            </article>

            {/* Card 3 */}
            <article className="min-h-[115px] md:min-h-[150px] p-[17px] md:p-[24px] border border-white/20 rounded-[21px] bg-gradient-to-br from-[#031b468c] to-[#1869be40] shadow-[0_17px_38px_rgba(0,13,43,0.22),inset_0_1px_rgba(255,255,255,0.14)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#70caff85] hover:from-[#06265bAD] hover:to-[#1879db4f]">
              <div className="flex items-center justify-between gap-[12px]">
                <span className="text-[#c9e3fa] text-[12px] font-[700]">
                  Progress Penyelesaian
                </span>
                <span className="w-[40px] h-[40px] flex items-center justify-center rounded-[12px] text-[#ccecff] bg-[#42a5f530] border border-[#8ed3ff2e]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[22px] h-[22px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8 12 2.5 2.5L16 9" />
                  </svg>
                </span>
              </div>
              <strong className="block mt-[12px] text-[25px] md:text-[clamp(25px,2.2vw,36px)] font-[850] tracking-[-0.03em]">
                {percentageSPP} %
              </strong>
              <div
                className="w-full h-[7px] mt-[13px] overflow-hidden rounded-full bg-white/15"
                aria-label="Progress"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#55e4be] to-[#42A5F5] shadow-[0_0_16px_rgba(66,165,245,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${percentageSPP}%` }}
                ></div>
              </div>
            </article>

            {/* Card 4 */}
            <article className="min-h-[115px] md:min-h-[150px] p-[17px] md:p-[24px] border border-white/20 rounded-[21px] bg-gradient-to-br from-[#031b468c] to-[#1869be40] shadow-[0_17px_38px_rgba(0,13,43,0.22),inset_0_1px_rgba(255,255,255,0.14)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#70caff85] hover:from-[#06265bAD] hover:to-[#1879db4f]">
              <div className="flex items-center justify-between gap-[12px]">
                <span className="text-[#c9e3fa] text-[12px] font-[700]">
                  Online User
                </span>
                <span className="w-[40px] h-[40px] flex items-center justify-center rounded-[12px] text-[#ccecff] bg-[#42a5f530] border border-[#8ed3ff2e]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[22px] h-[22px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 7h5M18.5 4.5v5" />
                  </svg>
                </span>
              </div>
              <strong className="block mt-[12px] text-[25px] md:text-[clamp(25px,2.2vw,36px)] font-[850] tracking-[-0.03em]">
                7
              </strong>
              <span className="block mt-1 text-[#9bcdf2] text-[11px]">
                Pengguna aktif saat ini
              </span>
            </article>
          </div>
        </aside>
      </div>
    </div>
  );
  // return (
  //   <div className={styles.container}>
  //     {/* POP-UP COUNTDOWN LOCKOUT (Menutupi Layar) */}
  //     {lockoutTimer > 0 && (
  //       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
  //         <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4">
  //           <div className="text-red-500 mb-4">
  //             <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  //             </svg>
  //           </div>
  //           <h2 className="text-xl font-bold text-gray-800 mb-2">Akses Diblokir Sementara</h2>
  //           <p className="text-sm text-gray-600 mb-4">
  //             Terlalu banyak percobaan login yang gagal. Demi keamanan, akun/IP Anda diblokir selama 15 menit.
  //           </p>
  //           <div className="text-3xl font-mono font-bold text-red-600 bg-red-50 py-3 rounded-lg">
  //             {formatTime(lockoutTimer)}
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     <header className={`${styles.header.base} ${styles.header.padding}`} role="banner">
  //       <img src={ASSETS.LOGO} alt={TEXT.LOGO_ALT} className={`${styles.logo.base} ${styles.logo.size}`} loading="eager" />
  //       <img src={"/logo-kemnaker-decoration.webp"} alt={TEXT.LOGO_ALT} className={`absolute right-[-1rem] rotate-[168.75deg]`} loading="eager" width={250} />
  //       <img src={"/logo-kemnaker-decoration.webp"} alt={TEXT.LOGO_ALT} className={`absolute right-[12.5rem] top-[-7rem] rotate-[168.75deg]`} loading="eager" width={250} />
  //       <img src={"/logo-kemnaker-decoration.webp"} alt={TEXT.LOGO_ALT} className={`absolute right-[21rem] top-[5.5rem] rotate-[168.75deg]`} loading="eager" width={250} />
  //     </header>

  //     <main className={`${styles.mainGrid.base} ${styles.mainGrid.columns}`}>
  //       <section className={`${styles.formSection.base} ${styles.formSection.padding}`} aria-label="Login form section">
  //         <div className={styles.formContainer}>
  //           <div className={styles.title.container}>
  //             <h1 className={styles.title.heading}>{TEXT.PAGE_TITLE}</h1>
  //             <p className={styles.title.subtitle}>{TEXT.PAGE_SUBTITLE}</p>
  //           </div>

  //           {errorMessage && (
  //             <div role="alert" aria-live="polite" className={`${styles.error.base} ${styles.error.color}`}>
  //               {errorMessage}
  //             </div>
  //           )}
  //           <form onSubmit={handleSubmit} className={styles.form.base} noValidate aria-label="Login form">
  //             <div className={styles.form.inputWrapper}>
  //               <Input
  //                 label={TEXT.SATKER_LABEL}
  //                 name={FORM_FIELDS.SATKER}
  //                 type="text"
  //                 required
  //                 value={formData[FORM_FIELDS.SATKER]}
  //                 validate={validationSchema.onlyNumber}
  //                 onChange={handleInputChange}
  //                 placeholder={TEXT.SATKER_PLACEHOLDER}
  //                 autoComplete="username"
  //                 disabled={isLoading || lockoutTimer > 0}
  //               />
  //             </div>

  //             <div className={styles.form.inputWrapper}>
  //               <Input
  //                 label={TEXT.PASSWORD_LABEL}
  //                 type="password"
  //                 name={FORM_FIELDS.PASSWORD}
  //                 required
  //                 value={formData[FORM_FIELDS.PASSWORD]}
  //                 onChange={handleInputChange}
  //                 placeholder={TEXT.PASSWORD_PLACEHOLDER}
  //                 // autoComplete="current-password"
  //                 disabled={isLoading || lockoutTimer > 0}
  //               />
  //             </div>

  //             {failedAttempts >= 3 && (
  //               <div className="mb-4 flex flex-col items-center justify-center w-full transition-all duration-500 ease-in-out animate-fadeIn">
  //                 <p className="text-xs text-red-500 mb-2 text-center font-medium">
  //                   Terdeteksi aktivitas mencurigakan. Selesaikan CAPTCHA di bawah ini.
  //                 </p>

  //                 <div className="flex justify-center w-full min-h-[78px]">
  //                   <ReCAPTCHA
  //                     ref={recaptchaRef}
  //                     sitekey={SITE_KEY}
  //                     onChange={(token) => setCaptchaToken(token)}
  //                     onExpired={() => setCaptchaToken("")}
  //                   />
  //                 </div>
  //               </div>
  //             )}
  //             <Button
  //               type="submit"
  //               className={`${styles.button.base} ${styles.button.colors} ${styles.button.focus} ${styles.button.disabled} !w-full`}
  //               disabled={isLoading || lockoutTimer > 0}
  //             >
  //               {isLoading ? "Memproses..." : TEXT.LOGIN_BUTTON}
  //             </Button>
  //           </form>
  //         </div>
  //       </section>

  //       {isDesktop && (
  //         <section className={`${styles.imageSection.base} ${styles.imageSection.padding} ${styles.imageSection.background}`} aria-hidden="true">
  //           <div className={styles.image.container}>
  //             <img src={ASSETS.BUILDING_IMAGE} alt="Modern office buildings" className={styles.image.img} loading="lazy" width="550" />
  //           </div>
  //         </section>
  //       )}
  //     </main>
  //   </div>
  // );
};

export default LoginPage;
