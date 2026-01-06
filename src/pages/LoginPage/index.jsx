// src/pages/LoginPage/index.jsx
import React from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useLogin } from "./hooks/useLogin";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { useFormValidation } from "./hooks/useFormValidation";
import { ASSETS, TEXT, FORM_FIELDS, BREAKPOINTS } from "./constants";
import { styles } from "./styles";
import "index.css";
import { validationSchema } from "@/services/GeneralHelper";

const LoginPage = () => {
  // Custom hooks
  const { isLoading, errorMessage, handleLogin, clearError } = useLogin();
  const isDesktop = useMediaQuery(BREAKPOINTS.MOBILE);
  const { formData, handleChange } = useFormValidation({
    [FORM_FIELDS.SATKER]: "",
    [FORM_FIELDS.PASSWORD]: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleLogin(formData);
  };

  const handleInputChange = (event) => {
    handleChange(event);
    if (errorMessage) {
      clearError();
    }
  };

  return (
    <div className={styles.container}>
      <header
        className={`${styles.header.base} ${styles.header.padding}`}
        role="banner"
      >
        <img
          src={ASSETS.LOGO}
          alt={TEXT.LOGO_ALT}
          className={`${styles.logo.base} ${styles.logo.size}`}
          loading="eager"
        />
        <img
          src={"/logo-kemnaker-decoration.webp"}
          alt={TEXT.LOGO_ALT}
          className={`absolute right-[-1rem] rotate-[168.75deg]`}
          loading="eager"
          width={250}
        />
        <img
          src={"/logo-kemnaker-decoration.webp"}
          alt={TEXT.LOGO_ALT}
          className={`absolute right-[12.5rem] top-[-7rem] rotate-[168.75deg]`}
          loading="eager"
          width={250}
        />
        <img
          src={"/logo-kemnaker-decoration.webp"}
          alt={TEXT.LOGO_ALT}
          className={`absolute right-[21rem] top-[5.5rem] rotate-[168.75deg]`}
          loading="eager"
          width={250}
        />
      </header>

      <main className={`${styles.mainGrid.base} ${styles.mainGrid.columns}`}>
        <section
          className={`${styles.formSection.base} ${styles.formSection.padding}`}
          aria-label="Login form section"
        >
          <div className={styles.formContainer}>
            <div className={styles.title.container}>
              <h1 className={styles.title.heading}>{TEXT.PAGE_TITLE}</h1>
              <p className={styles.title.subtitle}>{TEXT.PAGE_SUBTITLE}</p>
            </div>
            <form
              onSubmit={handleSubmit}
              className={styles.form.base}
              noValidate
              aria-label="Login form"
            >
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
                  disabled={isLoading}
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
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>
              {errorMessage && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`${styles.error.base} ${styles.error.color}`}
                >
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                className={`${styles.button.base} ${styles.button.colors} ${styles.button.focus} ${styles.button.disabled} !w-full`}
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : TEXT.LOGIN_BUTTON}
              </Button>
            </form>
          </div>
        </section>

        {isDesktop && (
          <section
            className={`${styles.imageSection.base} ${styles.imageSection.padding} ${styles.imageSection.background}`}
            aria-hidden="true"
          >
            <div className={styles.image.container}>
              <img
                src={ASSETS.BUILDING_IMAGE}
                alt="Modern office buildings"
                className={styles.image.img}
                loading="lazy"
                width="550"
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default LoginPage;
