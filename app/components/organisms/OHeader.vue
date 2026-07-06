<template>
  <header
    class="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md"
    role="banner"
  >
    <div class="container-page">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-bold text-lg text-[var(--color-text)] hover:text-primary transition-colors"
          aria-label="DevBlog Home"
        >
          <span class="material-symbols-outlined text-primary" aria-hidden="true">code</span>
          <span class="font-mono">DevBlog</span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav
          class="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
          role="navigation"
        >
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors
                   text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)]
                   router-link-exact-active:text-primary router-link-exact-active:bg-primary/5"
            :exact="item.exact"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Right Controls -->
        <div class="flex items-center gap-2">
          <!-- Language Switcher -->
          <div class="relative" @mouseenter="showLangMenu = true" @mouseleave="showLangMenu = false">
            <button
              type="button"
              class="p-2 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)] flex items-center gap-1 text-sm"
              :aria-label="'Language: ' + currentLocaleName"
              @click="showLangMenu = !showLangMenu"
              @keydown.escape="showLangMenu = false"
            >
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">language</span>
              <span class="hidden sm:inline">{{ currentLocaleCode.toUpperCase() }}</span>
            </button>

            <div
              v-if="showLangMenu"
              class="absolute right-0 mt-1 py-2 w-40 card shadow-lg z-50"
              role="menu"
            >
              <button
                v-for="loc in locales"
                :key="loc.code"
                class="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[var(--color-surface-elevated)] flex items-center justify-between"
                :class="{ 'text-primary font-medium': loc.code === locale }"
                role="menuitem"
                @click="switchLocale(loc.code)"
              >
                {{ loc.name }}
                <span v-if="loc.code === locale" class="material-symbols-outlined text-[16px] text-primary">check</span>
              </button>
            </div>
          </div>

          <!-- Dark Mode Toggle -->
          <ADarkModeToggle />

          <!-- Mobile menu button -->
          <button
            type="button"
            class="md:hidden p-2 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span class="material-symbols-outlined" aria-hidden="true">
              {{ mobileMenuOpen ? 'close' : 'menu' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <nav
          v-if="mobileMenuOpen"
          id="mobile-menu"
          class="md:hidden border-t border-[var(--color-border)] py-3"
          aria-label="Mobile navigation"
          role="navigation"
        >
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                   text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)]
                   router-link-exact-active:text-primary"
            :exact="item.exact"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t, locale, locales } = useI18n()

const mobileMenuOpen = ref(false)
const showLangMenu = ref(false)

const currentLocaleCode = computed(() => locale.value)
const currentLocaleName = computed(() => {
  const loc = locales.value.find(l => l.code === locale.value)
  return loc?.name ?? locale.value
})

const navItems = computed(() => [
  { to: '/', label: t('nav.home'), exact: true },
  { to: '/about', label: t('nav.about'), exact: false },
  { to: '/contact', label: t('nav.contact'), exact: false },
  { to: '/search', label: t('nav.search'), exact: false },
])

function switchLocale(code: string) {
  locale.value = code
  showLangMenu.value = false
}

const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
  showLangMenu.value = false
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
