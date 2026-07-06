<script setup lang="ts">
const pwaStore = usePwaInstallStore()
</script>

<template>
  <Transition name="pwa-banner">
    <div
      v-if="pwaStore.isPromptVisible"
      role="dialog"
      aria-labelledby="pwa-heading"
      aria-describedby="pwa-desc"
      aria-live="assertive"
      class="fixed bottom-0 inset-x-0 z-50 bg-surface-container border-t-2 border-primary px-4 py-3 sm:px-6 sm:py-4 shadow-lg"
    >
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
        <div class="flex-1 min-w-0">
          <h2 id="pwa-heading" class="font-semibold text-lg text-on-surface">{{ $t('pwa.heading') }}</h2>
          <p id="pwa-desc" class="text-sm text-on-surface-variant mt-0.5">{{ $t('pwa.description') }}</p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <button
            type="button"
            class="px-5 py-2 rounded-lg bg-primary text-on-primary font-medium hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="pwaStore.install()"
          >
            {{ $t('pwa.install') }}
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="pwaStore.dismiss()"
          >
            {{ $t('pwa.dismiss') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.pwa-banner-enter-active,
.pwa-banner-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.pwa-banner-enter-from,
.pwa-banner-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .pwa-banner-enter-active,
  .pwa-banner-leave-active { transition: none; }
}
</style>
