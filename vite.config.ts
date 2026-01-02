import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Configure MIME types for XML files
    middlewareMode: false,
  },
  // Ensure XML files are served with correct MIME type
  assetsInclude: ['**/*.xml'],
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      selfDestroying: false,
      includeAssets: [
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png'
      ],
      manifest: {
        name: '3rdeyeadvisors - DeFi Education',
        short_name: '3EA',
        description: 'DeFi Education & Digital Ownership Tools',
        theme_color: '#00D4FF',
        background_color: '#0A1628',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Skip waiting and claim clients immediately for seamless updates
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB limit
        // Only cache essential static assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Minimal runtime caching - prioritize network for live data
        runtimeCaching: [
          // Fonts - cache forever
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          // Images - cache with revalidation
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          }
        ],
        // No navigation fallback - always fetch fresh
        navigateFallback: null
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
