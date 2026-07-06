<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()

useHead({
  htmlAttrs: {
    lang: () => locale.value,
  },
  link: [
    {
      rel: 'alternate',
      hreflang: 'en',
      href: () => `https://devblog.example.com${route.path.replace(/^\/(es|am)/, '') || '/'}`,
    },
    {
      rel: 'alternate',
      hreflang: 'es',
      href: () => `https://devblog.example.com/es${route.path.replace(/^\/(es|am)/, '') || '/'}`,
    },
    {
      rel: 'alternate',
      hreflang: 'am',
      href: () => `https://devblog.example.com/am${route.path.replace(/^\/(es|am)/, '') || '/'}`,
    },
  ],
})
</script>
