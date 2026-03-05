import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@":      path.resolve(__dirname, "./src"),
      "@ui":    path.resolve(__dirname, "../../packages/ui/src"),
      "@utils": path.resolve(__dirname, "../../packages/utils/src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          trpc:   ["@trpc/client", "@trpc/react-query"],
          stripe: ["@stripe/stripe-js"],
          query:  ["@tanstack/react-query"],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target:       "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});