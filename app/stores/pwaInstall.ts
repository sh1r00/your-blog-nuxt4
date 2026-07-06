import { defineStore } from 'pinia'

const STORAGE_KEY = 'pwa-prompt-dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type PromptState = 'hidden' | 'visible' | 'installing' | 'dismissed'

export const usePwaInstallStore = defineStore('pwaInstall', {
  state: () => ({
    promptState: 'hidden' as PromptState,
    deferredPrompt: null as BeforeInstallPromptEvent | null,
    canInstall: false,
  }),

  getters: {
    isPromptVisible: (state) => state.promptState === 'visible',
  },

  actions: {
    initialize() {
      if (typeof window === 'undefined') return

      const isDismissed = this._checkDismissed()

      if (!isDismissed) {
        this.promptState = 'visible'
      }

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        this.deferredPrompt = e as BeforeInstallPromptEvent
        this.canInstall = true

        if (!isDismissed && this.promptState === 'hidden') {
          this.promptState = 'visible'
        }
      })

      window.addEventListener('appinstalled', () => {
        this.promptState = 'hidden'
        this.deferredPrompt = null
        this.canInstall = false
        this._setDismissed()
      })

      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.promptState = 'hidden'
        this._setDismissed()
      }
    },

    async install() {
      if (typeof window === 'undefined') return

      if (!this.deferredPrompt) {
        this.dismiss()
        return
      }

      this.promptState = 'installing'

      try {
        await this.deferredPrompt.prompt()
        await this.deferredPrompt.userChoice
      } catch {
        // User dismissed or error
      } finally {
        this.promptState = 'hidden'
        this.deferredPrompt = null
      }
    },

    dismiss() {
      this.promptState = 'hidden'
      this._setDismissed()
    },

    _checkDismissed(): boolean {
      try { return localStorage.getItem(STORAGE_KEY) === 'true' } catch { return false }
    },

    _setDismissed() {
      try { localStorage.setItem(STORAGE_KEY, 'true') } catch { /* unavailable */ }
    },
  },
})
