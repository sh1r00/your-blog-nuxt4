export function formatEmail(text: string): string {
  return text.replace(/\[at\]/g, '@')
}
