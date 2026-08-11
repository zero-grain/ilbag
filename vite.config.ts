import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative assets work both at a custom domain and /repository/ on GitHub Pages.
  base: "./",
  plugins: [react()],
});
