export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  date: string
  readTime: number
  featured: boolean
  author: string
  coverImage?: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-resilient-microservices',
    title: 'Building Resilient Microservices with Circuit Breakers',
    excerpt: 'Learn how to protect your distributed system from cascading failures using the circuit breaker pattern, with practical TypeScript examples.',
    content: `## Why Circuit Breakers Matter

In distributed systems, failures are inevitable. A slow or failing downstream service can quickly cascade through your system, consuming threads and connections until everything grinds to a halt. The circuit breaker pattern prevents this by automatically detecting failures and failing fast.

## How It Works

A circuit breaker has three states:

- **Closed**: All requests flow normally. Failures are counted.
- **Open**: Requests are rejected immediately. A timer starts.
- **Half-Open**: A limited number of test requests are allowed through.

## Implementation in TypeScript

Here is a minimal circuit breaker implementation:

\`\`\`typescript
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

interface CircuitBreakerConfig {
  failureThreshold: number
  resetTimeout: number
  halfOpenMaxRequests: number
}

class CircuitBreaker {
  private state: CircuitState = 'CLOSED'
  private failureCount = 0
  private lastFailureTime = 0
  private halfOpenRequests = 0

  constructor(
    private fn: (...args: any[]) => Promise<any>,
    private config: CircuitBreakerConfig = {
      failureThreshold: 5,
      resetTimeout: 30000,
      halfOpenMaxRequests: 3,
    }
  ) {}

  async call(...args: any[]): Promise<any> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeout) {
        this.state = 'HALF_OPEN'
        this.halfOpenRequests = 0
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await this.fn(...args)
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    this.failureCount = 0
    this.state = 'CLOSED'
  }

  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (
      this.state === 'CLOSED' &&
      this.failureCount >= this.config.failureThreshold
    ) {
      this.state = 'OPEN'
    }
  }
}
\`\`\`

## Monitoring and Observability

When deploying circuit breakers in production, instrument them with metrics:

\`\`\`typescript
import { metrics } from '@opentelemetry/api'

const meter = metrics.getMeter('circuit-breaker')
const stateGauge = meter.createUpDownCounter('circuit_breaker_state')
const failureCounter = meter.createCounter('circuit_breaker_failures')

// Update metrics on state changes
stateGauge.add(1, { state: 'OPEN', service: 'payment-api' })
\`\`\`

## When Not to Use

Circuit breakers add complexity. Skip them for:

- Non-critical, best-effort operations
- Operations where stale data is acceptable
- Very low latency internal calls

## Conclusion

A well-tuned circuit breaker is one of the most effective patterns for building resilient distributed systems. Start with conservative thresholds, monitor closely, and adjust based on real traffic patterns.`,
    category: 'Architecture',
    tags: ['microservices', 'resilience', 'typescript', 'patterns'],
    date: '2025-06-15',
    readTime: 8,
    featured: true,
    author: 'Alex Chen',
  },
  {
    slug: 'nuxt4-server-components-deep-dive',
    title: 'Nuxt 4 Server Components: A Deep Dive',
    excerpt: 'Explore how Nuxt 4 server components work under the hood and when to use them for optimal performance.',
    content: `## What Are Server Components?

Nuxt 4 introduces native server components, enabling you to render parts of your application entirely on the server. Unlike traditional SSR where JavaScript is still shipped to the client, server components send only HTML.

## Key Benefits

- **Zero client-side JavaScript** for server components
- **Reduced bundle size** — libraries stay on the server
- **Direct database access** without API endpoints
- **Automatic code splitting** at component boundaries

## A Practical Example

\`\`\`vue
<!-- components/MarkdownRenderer.server.vue -->
<template>
  <div class="prose" v-html="html" />
</template>

<script setup lang="ts">
import { marked } from 'marked'

const props = defineProps<{ content: string }>()

const html = await marked.parse(props.content)
</script>
\`\`\`

Notice the \`.server.vue\` suffix — Nuxt treats these as server-only components.

## Composing with Client Components

\`\`\`vue
<!-- pages/blog/[slug].vue -->
<template>
  <div>
    <MarkdownRenderer :content="post.content" />

    <!-- Interactive client component -->
    <ClientOnly>
      <CommentSection :post-slug="post.slug" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(
  'post-' + route.params.slug,
  () => $fetch('/api/posts/' + route.params.slug)
)
</script>
\`\`\`

## Performance Wins

In a recent project, migrating the blog rendering pipeline to server components reduced:

- Client bundle by **47 KB** (gzipped)
- Time to Interactive by **320 ms**
- Lighthouse score from 89 to 97

## Caveats

Server components cannot:
- Use reactivity or lifecycle hooks
- Attach event listeners
- Access browser APIs

When interactivity is needed, wrap in \`<ClientOnly>\` or use a regular component.`,
    category: 'Nuxt',
    tags: ['nuxt', 'vue', 'ssr', 'performance', 'javascript'],
    date: '2025-06-10',
    readTime: 6,
    featured: true,
    author: 'Alex Chen',
  },
  {
    slug: 'typescript-5-decorators-revisited',
    title: 'TypeScript 5 Decorators Revisited',
    excerpt: 'The new ECMAScript decorators proposal is here. See how TypeScript 5 implements them natively and what changes from the legacy experimental decorators.',
    content: `## The New Decorator Standard

TypeScript 5.0 ships with native support for the TC39 stage 3 decorators proposal. This replaces the older experimental decorators that required \`experimentalDecorators: true\`.

## Key Differences

| Feature | Legacy (experimental) | New (TC39) |
|---------|----------------------|------------|
| Class fields | Full field access | Getter/setter descriptor only |
| \`this\` binding | Bound at decoration time | Standard JS rules |
| Metadata | \`reflect-metadata\` | Built-in \`Symbol.metadata\` |

## Migration Example

Legacy decorator:

\`\`\`typescript
// OLD — experimental decorators
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log('Called:', key, args)
    return original.apply(this, args)
  }
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b
  }
}
\`\`\`

New ECMAScript decorator:

\`\`\`typescript
// NEW — TC39 decorators
function log<T extends (...args: any[]) => any>(
  target: T,
  context: ClassMethodDecoratorContext
): T {
  return function (this: any, ...args: any[]) {
    console.log('Called:', String(context.name), args)
    return target.apply(this, args)
  } as T
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b
  }
}
\`\`\`

## Accessor Decorators

One of the cleanest additions is accessor decorators:

\`\`\`typescript
function uppercase<T extends string>(
  target: ClassAccessorDecoratorTarget<unknown, T>,
  context: ClassAccessorDecoratorContext
): ClassAccessorDecoratorResult<unknown, T> {
  return {
    get() { return target.get.call(this) },
    set(value: T) {
      target.set.call(this, value.toUpperCase() as T)
    }
  }
}

class User {
  @uppercase
  accessor name: string = 'alex'
}
\`\`\`

## Should You Migrate?

Yes — the TC39 decorators are the future. The experimental decorators will eventually be deprecated. Migrate incrementally: start with new code, then tackle existing decorators one class at a time.`,
    category: 'TypeScript',
    tags: ['typescript', 'decorators', 'javascript', 'ecmascript'],
    date: '2025-06-05',
    readTime: 7,
    featured: false,
    author: 'Alex Chen',
  },
  {
    slug: 'css-container-queries-in-practice',
    title: 'CSS Container Queries in Practice',
    excerpt: 'Container queries are revolutionizing responsive design. Learn how to use them effectively with real-world component patterns.',
    content: `## Beyond Media Queries

For years, responsive design meant \`@media\` queries tied to the viewport. Container queries let components respond to their parent container's size — a game changer for reusable component libraries.

## Basic Syntax

\`\`\`css
/* Define a containment context */
.card-grid {
  container-type: inline-size;
  container-name: card-grid;
}

/* Style based on container width */
@container card-grid (min-width: 600px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@container card-grid (min-width: 900px) {
  .card {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
\`\`\`

## Real-World Component Architecture

Here is a component that adapts to its container:

\`\`\`vue
<template>
  <div class="stats-container">
    <div class="stat">
      <span class="stat-value">{{ value }}</span>
      <span class="stat-label">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .stat-value { font-size: 2rem; }
}
@container (min-width: 500px) {
  .stat { flex-direction: row; align-items: baseline; }
}
</style>
\`\`\`

## Combining with Style Queries

Style queries (experimental) let you check CSS custom property values:

\`\`\`css
@container style(--theme: dark) {
  .card {
    background: #1a1a2e;
    color: #e0e0e0;
  }
}
\`\`\`

## Browser Support

Container queries (size) are supported in all modern browsers as of 2024. Style queries are behind flags in Firefox but available in Chrome/Edge/Safari.`,
    category: 'CSS',
    tags: ['css', 'responsive-design', 'frontend', 'container-queries'],
    date: '2025-05-28',
    readTime: 5,
    featured: false,
    author: 'Alex Chen',
  },
  {
    slug: 'secure-authentication-nuxt',
    title: 'Secure Authentication Patterns in Nuxt 4',
    excerpt: 'Implementing authentication securely is harder than it looks. Explore server-side session management, CSRF protection, and OAuth2 flows.',
    content: `## The Authentication Landscape

Authentication touches every part of your application. A mistake can expose user data or allow account takeover. Let's explore patterns that keep your Nuxt 4 app secure.

## Server-Side Sessions

Never store JWTs in localStorage. Use httpOnly cookies managed by the server:

\`\`\`typescript
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = await verifyCredentials(body.email, body.password)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const session = await createSession(user.id)

  setCookie(event, 'session_id', session.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return { user: sanitizeUser(user) }
})
\`\`\`

## CSRF Protection

Even with httpOnly cookies, you need CSRF protection:

\`\`\`typescript
// server/middleware/csrf.ts
export default defineEventHandler(async (event) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.method)) {
    const origin = getHeader(event, 'origin')
    const allowedOrigins = [useRuntimeConfig().public.appUrl]

    if (!origin || !allowedOrigins.includes(origin)) {
      throw createError({ statusCode: 403, message: 'CSRF check failed' })
    }

    // Double-submit cookie pattern
    const headerToken = getHeader(event, 'x-csrf-token')
    const cookieToken = getCookie(event, 'csrf_token')

    if (!headerToken || headerToken !== cookieToken) {
      throw createError({ statusCode: 403, message: 'Invalid CSRF token' })
    }
  }
})
\`\`\`

## Rate Limiting

Protect login endpoints from brute force:

\`\`\`typescript
// server/utils/rateLimit.ts
const attempts = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, maxAttempts = 5, windowMs = 900000) {
  const now = Date.now()
  const record = attempts.get(key)

  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxAttempts - 1 }
  }

  record.count++
  return {
    allowed: record.count <= maxAttempts,
    remaining: Math.max(0, maxAttempts - record.count),
  }
}
\`\`\`

## OAuth2 Without Leaking Secrets

Use the server-side OAuth flow:

1. Redirect to provider with state parameter
2. Provider redirects back with auth code
3. **Server** exchanges code for tokens (never expose client secret)
4. Create session, set httpOnly cookie
5. Redirect to app

This ensures access tokens never touch the browser.`,
    category: 'Security',
    tags: ['security', 'authentication', 'nuxt', 'oauth', 'typescript'],
    date: '2025-05-20',
    readTime: 9,
    featured: true,
    author: 'Alex Chen',
  },
  {
    slug: 'building-cli-tools-node',
    title: 'Building CLI Tools People Actually Want to Use',
    excerpt: 'From argument parsing to beautiful output, learn how to build command-line tools in Node.js that developers will love.',
    content: `## The Art of CLI Design

A great CLI feels like an extension of the developer's thoughts. Here is how to build one.

## Argument Parsing Done Right

Use a dedicated parser instead of raw \`process.argv\`:

\`\`\`typescript
import { Command } from 'commander'
import { input, select, confirm } from '@inquirer/prompts'

const program = new Command()

program
  .name('shipit')
  .description('Deploy your application with confidence')
  .version('1.0.0')
  .argument('<environment>', 'Target environment (staging|production)')
  .option('-t, --tag <tag>', 'Git tag to deploy')
  .option('--dry-run', 'Simulate without deploying')
  .action(async (environment, options) => {
    if (!['staging', 'production'].includes(environment)) {
      console.error('Invalid environment. Use staging or production.')
      process.exit(1)
    }

    const confirmed = await confirm({
      message: 'Deploy to ' + environment + '?',
    })

    if (!confirmed) {
      console.log('Deployment cancelled.')
      return
    }

    console.log('Deploying...')
    // Deployment logic here
  })

program.parse()
\`\`\`

## Beautiful Output

Plain \`console.log\` is boring. Use colors and spinners:

\`\`\`typescript
import chalk from 'chalk'
import ora from 'ora'

const spinner = ora('Building project...').start()

try {
  await build()
  spinner.succeed(chalk.green('Build completed'))
} catch (error) {
  spinner.fail(chalk.red('Build failed'))
  console.error(chalk.red(error.message))
  process.exit(1)
}
\`\`\`

## Progress Indicators

For long-running operations:

\`\`\`typescript
import { SingleBar } from 'cli-progress'

const bar = new SingleBar({
  format: 'Uploading |' + chalk.cyan('{bar}') + '| {percentage}% || {value}/{total} files',
})

bar.start(totalFiles, 0)

for await (const file of files) {
  await uploadFile(file)
  bar.increment()
}

bar.stop()
\`\`\`

## Error Messages That Help

Don't just report errors — guide users to solutions:

\`\`\`typescript
function handleError(error: Error): never {
  if (error.message.includes('ENOENT')) {
    console.error(chalk.red('Configuration file not found.'))
    console.error(chalk.dim('Run "shipit init" to create one.'))
  } else {
    console.error(chalk.red('Unexpected error:'), error.message)
    console.error(chalk.dim('Run with --debug for more details.'))
  }
  process.exit(1)
}
\`\`\`

## Testing CLIs

\`\`\`typescript
import { execa } from 'execa'
import { describe, it, expect } from 'vitest'

describe('shipit', () => {
  it('fails without environment argument', async () => {
    const { exitCode, stderr } = await execa('./bin/shipit', [], {
      reject: false,
    })
    expect(exitCode).toBe(1)
    expect(stderr).toContain('environment')
  })
})
\`\`\`

The best CLIs are the ones developers forget they are using — they just work.`,
    category: 'Node.js',
    tags: ['nodejs', 'cli', 'typescript', 'developer-tools'],
    date: '2025-05-12',
    readTime: 7,
    featured: false,
    author: 'Alex Chen',
  },
  {
    slug: 'web-vitals-optimization-guide',
    title: 'A Practical Guide to Core Web Vitals Optimization',
    excerpt: 'Real strategies that moved our Core Web Vitals from "needs improvement" to "good" across all three metrics. No fluff, just code.',
    content: `## The Starting Point

Our SaaS dashboard scored:
- **LCP**: 3.8s (poor)
- **INP**: 280ms (needs improvement)
- **CLS**: 0.18 (poor)

## Largest Contentful Paint (LCP)

The hero image was the bottleneck. Here is what we changed:

\`\`\`html
<!-- BEFORE: Slow LCP -->
<img src="/hero-full.jpg" alt="Dashboard hero" />

<!-- AFTER: Optimized LCP -->
<img
  src="/hero-full.jpg"
  alt="Dashboard hero"
  srcset="/hero-640.avif 640w, /hero-1280.avif 1280w"
  sizes="(max-width: 768px) 100vw, 1200px"
  loading="eager"
  fetchpriority="high"
  width="1200"
  height="600"
/>
\`\`\`

Preload the LCP image:

\`\`\`html
<link rel="preload" as="image" href="/hero-1280.avif" fetchpriority="high" />
\`\`\`

**Result**: LCP dropped from 3.8s to 1.9s.

## Interaction to Next Paint (INP)

Heavy JavaScript was blocking the main thread:

\`\`\`typescript
// BEFORE: Blocking the main thread
function processData(items: Item[]) {
  return items
    .filter(heavyFilter)
    .map(heavyTransform)
    .reduce(heavyReduce)
}

// AFTER: Yield to the browser
async function processData(items: Item[]): Promise<Result> {
  let result: Item[] = items

  for (const step of [heavyFilter, heavyTransform, heavyReduce]) {
    result = step(result)
    // Yield every 50ms
    if (performance.now() % 50 < 1) {
      await new Promise(r => setTimeout(r, 0))
    }
  }

  return result
}
\`\`\`

**Result**: INP dropped from 280ms to 85ms.

## Cumulative Layout Shift (CLS)

Reserve space for dynamic content:

\`\`\`css
/* Reserve space for ad slot before it loads */
.ad-slot {
  min-height: 250px;
  contain: layout paint;
}

/* Prevent layout shift from web fonts */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  size-adjust: 105%;
}
\`\`\`

**Result**: CLS dropped from 0.18 to 0.02.

## The Monitoring Stack

\`\`\`typescript
import { onCLS, onINP, onLCP } from 'web-vitals'

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    page: location.pathname,
  })

  navigator.sendBeacon('/api/vitals', body)
}

onCLS(sendToAnalytics)
onINP(sendToAnalytics)
onLCP(sendToAnalytics)
\`\`\`

The key insight: optimization is a continuous process, not a one-time project.`,
    category: 'Performance',
    tags: ['performance', 'web-vitals', 'lighthouse', 'frontend'],
    date: '2025-05-01',
    readTime: 6,
    featured: false,
    author: 'Alex Chen',
  },
  {
    slug: 'rust-for-javascript-developers',
    title: 'Rust for JavaScript Developers: A Gentle Introduction',
    excerpt: 'Approaching Rust from a JavaScript background can be intimidating. This guide bridges the gap with familiar concepts and practical examples.',
    content: `## Why Rust?

If you write performance-critical JavaScript (bundlers, linters, CLIs), Rust is worth learning. Tools like SWC, Turbopack, and Rolldown are written in it.

## Variables and Mutability

The biggest mindset shift: immutability by default.

\`\`\`rust
// JavaScript
let x = 5;
x = 10;    // Works fine
const y = [1, 2, 3];
y.push(4); // Works — const only prevents reassignment

// Rust
let x = 5;
x = 10;       // Error! Variables are immutable by default
let mut y = 5;
y = 10;       // OK — mut makes it mutable

let arr = vec![1, 2, 3];
arr.push(4);  // Error! Vec is immutable
let mut arr = vec![1, 2, 3];
arr.push(4);  // OK
\`\`\`

## Ownership — Rust's Superpower

JavaScript uses garbage collection. Rust uses ownership:

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1 is MOVED — it no longer exists

    // println!("{}", s1); // COMPILE ERROR: s1 was moved

    // Use clone() for deep copies
    let s3 = s2.clone();
    println!("{} {}", s2, s3); // Both work
}
\`\`\`

## Pattern Matching

Rust's \`match\` is like a supercharged \`switch\`:

\`\`\`rust
enum Status {
    Active,
    Inactive,
    Banned { reason: String },
}

fn get_message(status: &Status) -> &str {
    match status {
        Status::Active => "Account is active",
        Status::Inactive => "Account is inactive",
        Status::Banned { reason } => {
            println!("Banned for: {}", reason);
            "Account is banned"
        }
    }
}
\`\`\`

## Error Handling

No try-catch. Use \`Result\`:

\`\`\`rust
use std::fs;

fn read_config() -> Result<String, std::io::Error> {
    let content = fs::read_to_string("config.toml")?;
    Ok(content)
}

// The ? operator propagates errors up.
// Equivalent to:
// let content = match fs::read_to_string("config.toml") {
//     Ok(c) => c,
//     Err(e) => return Err(e),
// };
\`\`\`

## Practical First Project

Build a simple CLI that counts words:

\`\`\`rust
use std::collections::HashMap;
use std::env;
use std::fs;

fn main() {
    let args: Vec<String> = env::args().collect();
    let path = &args[1];

    let content = fs::read_to_string(path)
        .expect("Could not read file");

    let mut counts = HashMap::new();
    for word in content.split_whitespace() {
        *counts.entry(word.to_lowercase()).or_insert(0) += 1;
    }

    let mut entries: Vec<_> = counts.iter().collect();
    entries.sort_by(|a, b| b.1.cmp(a.1));

    for (word, count) in entries.iter().take(10) {
        println!("{}: {}", word, count);
    }
}
\`\`\`

Rust's learning curve is real, but the compiler is incredibly helpful — it is more like a mentor than an adversary.`,
    category: 'Rust',
    tags: ['rust', 'javascript', 'systems-programming', 'beginners'],
    date: '2025-04-25',
    readTime: 10,
    featured: false,
    author: 'Alex Chen',
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  )
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(p =>
    p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getAllCategories(): string[] {
  return [...new Set(blogPosts.map(p => p.category))]
}

export function getAllTags(): string[] {
  return [...new Set(blogPosts.flatMap(p => p.tags))]
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(p => p.featured)
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug)
  if (!post) return []
  return blogPosts
    .filter(p => p.slug !== slug)
    .sort((a, b) => {
      const aCommon = a.tags.filter(t => post.tags.includes(t)).length
      const bCommon = b.tags.filter(t => post.tags.includes(t)).length
      return bCommon - aCommon
    })
    .slice(0, limit)
}
