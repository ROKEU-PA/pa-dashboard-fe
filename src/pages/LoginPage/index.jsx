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
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={styles.container}>
      {/* POP-UP COUNTDOWN LOCKOUT (Menutupi Layar) */}
      {lockoutTimer > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Akses Diblokir Sementara</h2>
            <p className="text-sm text-gray-600 mb-4">
              Terlalu banyak percobaan login yang gagal. Demi keamanan, akun/IP Anda diblokir selama 15 menit.
            </p>
            <div className="text-3xl font-mono font-bold text-red-600 bg-red-50 py-3 rounded-lg">
              {formatTime(lockoutTimer)}
            </div>
          </div>
        </div>
      )}

      <header className={`${styles.header.base} ${styles.header.padding}`} role="banner">
        <img src={ASSETS.LOGO} alt={TEXT.LOGO_ALT} className={`${styles.logo.base} ${styles.logo.size}`} loading="eager" />
        <img src={"/logo-kemnaker-decoration.webp"} alt={TEXT.LOGO_ALT} className={`absolute right-[-1rem] rotate-[168.75deg]`} loading="eager" width={250} />
        <img src={"/logo-kemnaker-decoration.webp"} alt={TEXT.LOGO_ALT} className={`absolute right-[12.5rem] top-[-7rem] rotate-[168.75deg]`} loading="eager" width={250} />
        <img src={"/logo-kemnaker-decoration.webp"} alt={TEXT.LOGO_ALT} className={`absolute right-[21rem] top-[5.5rem] rotate-[168.75deg]`} loading="eager" width={250} />
      </header>

      <main className={`${styles.mainGrid.base} ${styles.mainGrid.columns}`}>
        <section className={`${styles.formSection.base} ${styles.formSection.padding}`} aria-label="Login form section">
          <div className={styles.formContainer}>
            <div className={styles.title.container}>
              <h1 className={styles.title.heading}>{TEXT.PAGE_TITLE}</h1>
              <p className={styles.title.subtitle}>{TEXT.PAGE_SUBTITLE}</p>
            </div>

            {errorMessage && (
              <div role="alert" aria-live="polite" className={`${styles.error.base} ${styles.error.color}`}>
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form.base} noValidate aria-label="Login form">
              <div className={styles.form.inputWrapper}>
                <Input
                  label={TEXT.SATKER_LABEL}
                  name={FORM_FIELDS.SATKER}
                  type="text"
                  required
                  value={formData[FORM_FIELDS.SATKER]}
                  validate={validationSchema.onlyNumber}
                  onChange={handleInputChange}
                  placeholder={TEXT.SATKER_PLACEHOLDER}
                  autoComplete="username"
                  disabled={isLoading || lockoutTimer > 0}
                />
              </div>

              <div className={styles.form.inputWrapper}>
                <Input
                  label={TEXT.PASSWORD_LABEL}
                  type="password"
                  name={FORM_FIELDS.PASSWORD}
                  required
                  value={formData[FORM_FIELDS.PASSWORD]}
                  onChange={handleInputChange}
                  placeholder={TEXT.PASSWORD_PLACEHOLDER}
                  // autoComplete="current-password"
                  disabled={isLoading || lockoutTimer > 0}
                />
              </div>

              {failedAttempts >= 3 && (
                <div className="mb-4 flex flex-col items-center justify-center w-full transition-all duration-500 ease-in-out animate-fadeIn">
                  <p className="text-xs text-red-500 mb-2 text-center font-medium">
                    Terdeteksi aktivitas mencurigakan. Selesaikan CAPTCHA di bawah ini.
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
              <Button
                type="submit"
                className={`${styles.button.base} ${styles.button.colors} ${styles.button.focus} ${styles.button.disabled} !w-full`}
                disabled={isLoading || lockoutTimer > 0}
              >
                {isLoading ? "Memproses..." : TEXT.LOGIN_BUTTON}
              </Button>
            </form>
          </div>
        </section>

        {isDesktop && (
          <section className={`${styles.imageSection.base} ${styles.imageSection.padding} ${styles.imageSection.background}`} aria-hidden="true">
            <div className={styles.image.container}>
              <img src={ASSETS.BUILDING_IMAGE} alt="Modern office buildings" className={styles.image.img} loading="lazy" width="550" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default LoginPage;