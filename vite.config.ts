import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        action: resolve(__dirname, "action.html"),
      },
    },
  },
  server: {
    cors: {
      origin: "https://www.owlbear.rodeo",
    },
  },
});
