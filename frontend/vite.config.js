import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
 /* server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Replace with your backend server URL
        changeOrigin: true, // Recommended to change the origin of the host header to the target URL
      },
      // You can add more proxy rules here for different paths
      // '/another-api': {
      //   target: 'https://external-api.com',
      //   changeOrigin: true,
      //   secure: false, // Set to false if targeting an insecure (HTTP) external API
      // },
    },
  },*/
})