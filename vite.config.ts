import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import stdLibBrowser from "node-stdlib-browser";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({ protocolImports: true })],
  // 절대 경로 지정
  resolve: {
    alias: {
      ...stdLibBrowser,
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/store": path.resolve(__dirname, "./src/store"),
      "@/theme": path.resolve(__dirname, "./src/theme"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
  // 개발 서버 설정
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },

  // 미리보기 서버 설정
  preview: {
    port: 4173,
    open: true,
  },
  define: {
    "process.env": {},
  },
});
