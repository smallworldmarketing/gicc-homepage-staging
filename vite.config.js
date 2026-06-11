import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^react-native$/,
        replacement: "react-native-web",
      },
    ],
  },
  build: {
    outDir: "dist",
  },
});
