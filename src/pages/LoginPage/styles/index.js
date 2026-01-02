// src/pages/LoginPage/LoginPage.styles.js

export const styles = {
  container: "min-h-screen flex flex-col bg-white",

  header: {
    base: "w-full h-64 bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] flex items-center",
    padding: "px-8 lg:px-56",
  },

  logo: {
    base: "object-contain",
    size: "w-64 lg:w-80",
  },

  mainGrid: {
    base: "flex-1 grid min-h-[calc(100vh-16rem)]",
    columns: "grid-cols-1 lg:grid-cols-2",
  },

  formSection: {
    base: "flex items-center justify-center",
    padding: "px-8 lg:px-16 py-12 lg:py-0",
  },

  formContainer: "w-[50%] max-w-md space-y-8",

  title: {
    container: "space-y-2",
    heading: "text-3xl font-bold text-gray-900 leading-tight",
    subtitle: "text-xl font-semibold text-[#898A8D]",
  },

  form: {
    base: "space-y-5",
    inputWrapper: "w-full",
  },

  error: {
    base: "text-sm text-center py-2",
    color: "text-red-500",
  },

  button: {
    base: "w-full font-medium py-3 rounded-lg transition-colors duration-200 pointer",
    colors: "bg-[#2F8AFD] hover:bg-[#1E7EEF] text-white",
    focus: "focus:ring-2 focus:ring-[#2F8AFD] focus:ring-offset-2",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },

  imageSection: {
    base: "hidden lg:flex items-center justify-center",
    padding: "p-12",
  },

  image: {
    container: "w-full max-w-lg",
    img: "absolute top-[17%] right-[10%]",
  },
};
