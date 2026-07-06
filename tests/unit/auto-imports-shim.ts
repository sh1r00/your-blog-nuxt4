// Test shims for Nuxt auto-imports
import { ref, computed, watch, watchEffect } from 'vue'
import { vi } from 'vitest'

// Export Vue reactivity utilities
export { ref, computed, watch, watchEffect }

// ---- Composable shims ----

export const useHead = vi.fn()
export const useSeoMeta = vi.fn()
export const useRuntimeConfig = vi.fn(() => ({}))

export const navigateTo = vi.fn()
export const useRoute = vi.fn(() => ({ path: '/', params: {}, query: {}, fullPath: '/' }))
export const useRouter = vi.fn(() => ({ push: vi.fn(), replace: vi.fn() }))

export const useCookie = vi.fn((_key: string, _opts?: any) => ref(true))

export const useI18n = vi.fn(() => ({
  t: vi.fn((key: string) => key),
  locale: ref('en'),
  locales: ref([
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ]),
}))

export const useDarkMode = vi.fn(() => ({
  isDark: ref(true),
  toggle: vi.fn(),
}))

export const $fetch = vi.fn().mockResolvedValue({})
