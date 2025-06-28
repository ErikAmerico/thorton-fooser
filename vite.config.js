import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
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
        icons: [
          {
            src: "/assets/fooball-logo-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/assets/fooball-logo-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,svg}"],
        cleanupOutdatedCaches: true,
        globIgnores: ["sw.js", "workbox-*.js", "**/*?__WB_REVISION__=*"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin &&
              url.pathname.startsWith("/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ url, request }) =>
              request.destination === "image" &&
              !url.pathname.startsWith("/assets/"),
            handler: "CacheFirst",
            options: {
              cacheName: "user-uploads",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    open: true,
    host: "0.0.0.0",
    port: 5173,
  },
});
