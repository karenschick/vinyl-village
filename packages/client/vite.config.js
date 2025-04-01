import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   open: true,
  //   proxy: {
  //     "/images": {
  //       target: "http://localhost:3001/",
  //     },
  //   },
  // },
  base: '/vinyl-village/',
});
