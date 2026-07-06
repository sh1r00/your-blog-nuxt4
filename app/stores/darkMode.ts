import { defineStore } from 'pinia'

const STORAGE_KEY = 'dark-mode'

export const useDarkModeStore = defineStore('darkMode', {
  state: () => ({
    isDark: false,
  }),

  actions: {
    initialize() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved !== null) {
          this.isDark = saved === 'true'
        } else if (window.matchMedia) {
          this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        this.applyClass()
      }
    },

    toggle() {
      this.isDark = !this.isDark
      this.applyClass()
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(this.isDark))
      }
    },

    applyClass() {
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', this.isDark)
      }
    },
  },
})
