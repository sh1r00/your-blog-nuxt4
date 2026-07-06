import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDarkMode } from '~/stores/darkMode'

describe('darkMode store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default dark mode (true)', () => {
    const store = useDarkMode()
    expect(store.isDark).toBeTruthy()
  })

  it('toggle switches from dark to light', () => {
    const store = useDarkMode()
    expect(store.isDark).toBeTruthy()
    store.toggle()
    expect(store.isDark).toBeFalsy()
  })

  it('toggle switches from light to dark', () => {
    const store = useDarkMode()
    store.toggle()
    expect(store.isDark).toBeFalsy()
    store.toggle()
    expect(store.isDark).toBeTruthy()
  })

  it('multiple toggles cycle correctly', () => {
    const store = useDarkMode()
    store.toggle()
    expect(store.isDark).toBeFalsy()
    store.toggle()
    expect(store.isDark).toBeTruthy()
    store.toggle()
    expect(store.isDark).toBeFalsy()
  })

  it('returns isDark and toggle in the store', () => {
    const store = useDarkMode()
    expect(store).toHaveProperty('isDark')
    expect(store).toHaveProperty('toggle')
    expect(typeof store.toggle).toBe('function')
  })

  it('toggle function modifies the cookie ref value', () => {
    const store = useDarkMode()
    const initialValue = store.isDark
    store.toggle()
    expect(store.isDark).toBe(!initialValue)
  })
})
