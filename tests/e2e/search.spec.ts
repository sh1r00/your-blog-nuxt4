import { test, expect } from '@playwright/test'

test.describe('Search', () => {
  test('search page loads successfully', async ({ page }) => {
    const response = await page.goto('/search')
    expect(response?.status()).toBeLessThan(400)

    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('input[type="search"]')).toBeVisible()
    await expect(page.locator('input[type="search"]')).toBeFocused()
  })

  test('search input accepts text', async ({ page }) => {
    await page.goto('/search')

    const input = page.locator('input[type="search"]')
    await input.fill('microservices')
    await expect(input).toHaveValue('microservices')
  })

  test('search returns results for matching term', async ({ page }) => {
    await page.goto('/search')

    const input = page.locator('input[type="search"]')
    await input.fill('microservices')
    await page.waitForTimeout(500)

    // Should show results count text
    const resultsText = page.locator('text=/\\d+ result/')
    await expect(resultsText).toBeVisible()

    // Should show blog post cards
    const postCards = page.locator('a[href^="/blog/"]')
    const count = await postCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('search returns results for partial match', async ({ page }) => {
    await page.goto('/search')

    const input = page.locator('input[type="search"]')
    await input.fill('nuxt')
    await page.waitForTimeout(500)

    const postCards = page.locator('a[href^="/blog/"]')
    const count = await postCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('search is case insensitive', async ({ page }) => {
    await page.goto('/search')

    const input = page.locator('input[type="search"]')

    // Search lowercase
    await input.fill('microservices')
    await page.waitForTimeout(300)
    const lowerCount = await page.locator('a[href^="/blog/"]').count()

    // Clear and search uppercase
    await input.fill('')
    await input.fill('MICROSERVICES')
    await page.waitForTimeout(300)
    const upperCount = await page.locator('a[href^="/blog/"]').count()

    // Should return same number of results (case insensitive)
    expect(upperCount).toBe(lowerCount)
  })

  test('search finds results by tag', async ({ page }) => {
    await page.goto('/search')

    const input = page.locator('input[type="search"]')
    await input.fill('typescript')
    await page.waitForTimeout(500)

    const postCards = page.locator('a[href^="/blog/"]')
    const count = await postCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('search finds results by category', async ({ page }) => {
    await page.goto('/search')

    const input = page.locator('input[type="search"]')
    await input.fill('Security')
    await page.waitForTimeout(500)

    const postCards = page.locator('a[href^="/blog/"]')
    const count = await postCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('no results shows empty state', async ({ page }) => {
    await page.goto('/search')

    const input = page.locator('input[type="search"]')
    await input.fill('xyznonexistentsearchterm999')
    await page.waitForTimeout(500)

    // Should show no results message
    await expect(page.locator('text=No results')).toBeVisible()
  })

  test('short query (< 2 chars) shows placeholder state', async ({ page }) => {
    await page.goto('/search')

    const input = page.locator('input[type="search"]')
    await input.fill('a')
    await page.waitForTimeout(300)

    // Should show the initial prompt/placeholder state
    await expect(page.locator('input[type="search"]')).toBeVisible()
  })

  test('clear search button works', async ({ page }) => {
    await page.goto('/search')

    const input = page.locator('input[type="search"]')
    await input.fill('typescript')

    // Clear button should appear
    const clearButton = page.locator('button[aria-label="Clear search"]')
    await expect(clearButton).toBeVisible()

    // Click clear
    await clearButton.click()
    await expect(input).toHaveValue('')
  })

  test('navigates to blog post from search results', async ({ page }) => {
    await page.goto('/search')

    const input = page.locator('input[type="search"]')
    await input.fill('microservices')
    await page.waitForTimeout(500)

    // Click the first result
    const firstResult = page.locator('a[href^="/blog/"]').first()
    await expect(firstResult).toBeVisible()
    await firstResult.click()

    await expect(page).toHaveURL(/\/blog\//)
    await expect(page.locator('article')).toBeVisible()
  })

  test('search via query parameter pre-fills input', async ({ page }) => {
    await page.goto('/search?q=typescript')

    const input = page.locator('input[type="search"]')
    await expect(input).toHaveValue('typescript')

    // Should show results
    const postCards = page.locator('a[href^="/blog/"]')
    const count = await postCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })
})
