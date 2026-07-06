import en from './locales/en.json'
import es from './locales/es.json'
import am from './locales/am.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es,
    am,
  },
}))
