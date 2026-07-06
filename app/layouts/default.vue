<template>
  <div :class="{ dark: darkMode.isDark }">
    <a href="#main-content" class="skip-link">
      {{ t('site.skipToContent') }}
    </a>

    <OHeader />

    <main id="main-content" class="min-h-screen">
      <slot />
    </main>

    <OFooter />
  </div>
</template>

<script setup lang="ts">
import { useDarkModeStore } from '~/stores/darkMode'
const { t } = useI18n()
const darkMode = useDarkModeStore()

onMounted(() => {
  if (darkMode.isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>
