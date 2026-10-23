import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  envPrefix: ["VITE_", "REACT_APP_"],

  server: {
    host: "127.0.0.1",
    port: 3000,
    strictPort: true,
  },

  build: {
    outDir: "build",
    emptyOutDir: true,
  },
});