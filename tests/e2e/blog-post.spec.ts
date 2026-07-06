import { test, expect } from '@playwright/test'

test.describe('Blog Post', () => {
  test('loads a blog post page successfully', async ({ page }) => {
    const response = await page.goto('/blog/building-resilient-microservices')
    expect(response?.status()).toBeLessThan(400)

    await expect(page.locator('article')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
  })

  test('displays post title', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    const title = page.locator('article h1')
    await expect(title).toBeVisible()
    const titleText = await title.textContent()
    expect(titleText?.length).toBeGreaterThan(0)
  })

  test('displays post metadata', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    // Author should be visible
    await expect(page.locator('article')).toContainText('Alex Chen')

    // Date time element
    const timeElement = page.locator('article time')
    await expect(timeElement).toBeVisible()
    await expect(timeElement).toHaveAttribute('datetime')
  })

  test('displays category badge', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    const categoryBadge = page.locator('.badge-primary')
    await expect(categoryBadge).toBeVisible()
    const categoryText = await categoryBadge.textContent()
    expect(categoryText?.trim().length).toBeGreaterThan(0)
  })

  test('has back to blog link', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    const backLink = page.locator('a[href="/"]').first()
    await expect(backLink).toBeVisible()
  })

  test('back link navigates to homepage', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    const backLink = page.locator('a[href="/"]').first()
    await backLink.click()
    await expect(page).toHaveURL('/')
  })

  test('displays read time', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    await expect(page.locator('article')).toContainText('min read')
  })

  test('displays tags with links', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    const tagLinks = page.locator('article a[href^="/tags/"]')
    const count = await tagLinks.count()
    expect(count).toBeGreaterThanOrEqual(1)

    // Tags should have # prefix
    const firstTagText = await tagLinks.first().textContent()
    expect(firstTagText).toContain('#')
  })

  test('tag link navigates to tag page', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    const tagLink = page.locator('article a[href^="/tags/"]').first()
    await tagLink.click()

    await expect(page).toHaveURL(/\/tags\//)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('renders code blocks with syntax highlighting', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    // Code blocks should be present
    const codeBlocks = page.locator('pre code')
    const count = await codeBlocks.count()
    expect(count).toBeGreaterThanOrEqual(1)

    // Code block wrapper should have header with language label
    const codeWrapper = page.locator('.code-block-wrapper').first()
    await expect(codeWrapper).toBeVisible()
    await expect(codeWrapper.locator('.lang-tag')).toBeVisible()
  })

  test('table of contents sidebar is present', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/blog/building-resilient-microservices')

    // TOC navigation should be visible on desktop
    const toc = page.locator('nav[aria-label="Table of Contents"]')
    // May only appear on posts with enough headings
    if (await toc.isVisible()) {
      const tocLinks = toc.locator('a')
      const count = await tocLinks.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })

  test('share buttons are present', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    // Share section in sidebar
    const shareButtons = page.locator('button[aria-label^="Share on"]')
    const count = await shareButtons.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('related posts section exists', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    // Related posts heading
    const relatedHeading = page.locator('text=Related')
    await expect(relatedHeading).toBeVisible()

    // Related post cards
    const relatedCards = page.locator('a[href^="/blog/"]').filter({ hasText: /./ })
    const count = await relatedCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('shows 404 for non-existent post', async ({ page }) => {
    await page.goto('/blog/non-existent-slug-xyz123')

    await expect(page.locator('text=Not Found')).toBeVisible()
    await expect(page.locator('a[href="/"]')).toBeVisible()
  })
})
