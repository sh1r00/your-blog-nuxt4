// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityVersion: 4,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'nuxt-security',
  ],

  css: ['@/assets/css/main.css'],

  components: {
    dirs: [
      { path: '~/components/atoms', pathPrefix: false },
      { path: '~/components/organisms', pathPrefix: false },
    ],
  },

  i18n: {
    strategy: 'prefix',
    defaultLocale: 'en',
    lazy: true,
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    locales: [
      { code: 'en', language: 'en', iso: 'en-US', name: 'English' },
      { code: 'es', language: 'es', iso: 'es-ES', name: 'Español' },
      { code: 'am', language: 'am', iso: 'am-ET', name: 'አማርኛ' },
    ],
    compilation: { strictMessage: false },
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: false,
  },

  pwa: {
    registerType: 'autoUpdate',
    devOptions: { enabled: false },
    manifest: { name: 'DevBlog', short_name: 'DevBlog', theme_color: '#2563eb', background_color: '#ffffff', display: 'standalone' },
    workbox: { globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2,json}'], navigateFallback: '/', cleanupOutdatedCaches: true, skipWaiting: true, clientsClaim: true,
      runtimeCaching: [
        { urlPattern: /\\.json$/, handler: 'StaleWhileRevalidate', options: { cacheName: 'i18n' } },
        { urlPattern: /\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/, handler: 'CacheFirst', options: { cacheName: 'images' } },
        { urlPattern: /^https:\/\/fonts\\.googleapis\\.com/, handler: 'StaleWhileRevalidate', options: { cacheName: 'google-fonts' } },
        { urlPattern: /^https:\/\/fonts\\.gstatic\\.com/, handler: 'CacheFirst', options: { cacheName: 'google-webfonts' } },
      ],
    },
  },
  security: {
    headers: process.env.NODE_ENV === "development" ? false : {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'strict-dynamic'", "'nonce-{{nonce}}'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'https://fonts.googleapis.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'"],
        'frame-src': ["'self'"],
        'frame-ancestors': ["'self'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
      },
    },
    rateLimiter: { tokensPerInterval: 30, interval: 60000 },
    xssValidator: process.env.NODE_ENV !== "development",
  },

  app: {
    head: {
      titleTemplate: '%s | DevBlog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern software engineering blog' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap',
        },
      ],
    },
  },

  tailwindcss: {
    config: {
      darkMode: 'class',
      content: [],
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: '#2563eb',
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            },
            surface: {
              DEFAULT: '#f8fafc',
              dark: '#0f1729',
            },
            accent: {
              DEFAULT: '#06b6d4',
              50: '#ecfeff',
              400: '#22d3ee',
              500: '#06b6d4',
              600: '#0891b2',
            },
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
        },
      },
    },
  },
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', 'pinia'],
    },
  },
  nitro: { prerender: { failOnError: false } },
  routeRules: { '/': { redirect: '/en/' } },
})
