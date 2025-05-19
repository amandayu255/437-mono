import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
        login: path.resolve(__dirname, "login.html"),
        register: path.resolve(__dirname, "register.html"),
      },
    },
  },
  server: {
    proxy: {
      "/auth": "http://localhost:3000",
      "/api": "http://localhost:3000"
    }
  }
});