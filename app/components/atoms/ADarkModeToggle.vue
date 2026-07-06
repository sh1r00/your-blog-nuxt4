<template>
  <button
    type="button"
    :aria-label="t('darkMode.toggle')"
    :title="darkMode.isDark ? t('darkMode.light') : t('darkMode.dark')"
    class="p-2 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)] focus-visible:ring-2 focus-visible:ring-primary/50"
    @click="darkMode.toggle"
  >
    <span class="material-symbols-outlined text-[20px]" aria-hidden="true">
      {{ darkMode.isDark ? 'light_mode' : 'dark_mode' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useDarkModeStore } from '~/stores/darkMode'
const { t } = useI18n()
const darkMode = useDarkModeStore()
</script>
