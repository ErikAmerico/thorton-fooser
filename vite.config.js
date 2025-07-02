import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      injectManifest: {
        swDest: "dist/sw.js",
      },
      injectRegister: "auto",
      includeAssets: [
        "assets/fooball-logo-192.png",
        "assets/fooball-logo-512.png",
      ],
      manifest: {
        name: "Fooser",
        short_name: "Fooser",
        description: "Your foosball rankings and brackets.",
        theme_color: "black",
        background_color: "black",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "/animate-trophy192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/animate-trophy512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/animate-trophy1024.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    open: true,
    host: "0.0.0.0",
    port: 5173,
  },
});
