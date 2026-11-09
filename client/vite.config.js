import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// /api 요청은 Express 서버(3000)로 넘긴다
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:3000" } },
});
