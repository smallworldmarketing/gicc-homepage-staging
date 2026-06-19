import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  base: "./",
  plugins: [react(), imagetools()],
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
