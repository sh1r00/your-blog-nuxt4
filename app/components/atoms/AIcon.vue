<template>
  <span
    class="material-symbols-outlined select-none"
    :class="sizeClass"
    aria-hidden="true"
    v-bind="$attrs"
  >
    {{ name }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md',
})

const sizeClass = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'text-[16px]',
    md: 'text-[20px]',
    lg: 'text-[28px]',
    xl: 'text-[36px]',
  }
  return sizes[props.size]
})
</script>
