# Fitflex Site Health Map

SEO, AI discovery, performance, security, accessibility, and scalability checklist for
the Fitflex storefront. Use this document as a release gate: every **Must** item should
be verified before production launch, and every recurring check should have an owner and
an evidence link.

## How to use this checklist

- [ ] Record the date, environment, URL, tester, and tool output for every audit.
- [ ] Mark an item complete only when it has been tested on a production-like build.
- [ ] Re-test after content, routing, deployment, dependency, or infrastructure changes.
- [ ] Keep staging out of search with authentication or `noindex`; never rely on an
      unlinked staging URL for security.

## Priority and evidence

- **Must**: launch-blocking or high-risk item.
- **Should**: important quality, discoverability, or operational improvement.
- **Could**: useful optimization after the fundamentals are stable.
- Evidence can be a Search Console screenshot, Lighthouse report, automated test,
  security scan, HTTP response, or an incident/runbook link.

## 1. Crawlability and Google discovery

### Must

- [ ] Set one canonical HTTPS origin and redirect HTTP, alternate hostnames, and
      duplicate trailing-slash variants to it with a single permanent redirect.
- [ ] Add a valid `/robots.txt` that allows public storefront content, disallows
      private checkout/cart or utility URLs, and references the XML sitemap.
- [ ] Generate `/sitemap.xml` from the real public URL inventory; include only canonical,
      indexable, 200-status URLs with useful content and accurate `lastmod` values.
- [ ] Verify that `robots.txt`, the sitemap, canonical URLs, and internal links use the
      same HTTPS hostname.
- [ ] Ensure the Vercel rewrite does not make missing URLs return a soft-404 `index.html`.
      Unknown paths should return a real 404 or a deliberate redirect.
- [ ] Make important product and article pages discoverable through crawlable `<a href>`
      links, not only JavaScript click handlers or URL fragments.
- [ ] Replace hash-only routes such as `#product/1` with stable, descriptive paths such
      as `/products/product-name` and `/journal/article-name`, or provide equivalent
      server-rendered/prerendered URLs.
- [ ] Submit the sitemap in Google Search Console and inspect representative home,
      collection, product, article, and error URLs.
- [ ] Confirm there are no accidental `noindex`, blocked resources, redirect chains, or
      canonical conflicts in production.

### Should

- [ ] Add breadcrumb navigation and `BreadcrumbList` structured data on nested pages.
- [ ] Keep faceted/filter URLs from creating crawlable duplicate combinations; use
      canonical URLs and an intentional indexation policy for filters.
- [ ] Add an HTML sitemap or well-linked category hub if the catalog grows substantially.
- [ ] Monitor indexed pages, crawl stats, discovered-but-not-indexed pages, and soft 404s
      weekly in Search Console.

## 2. On-page SEO and content quality

### Must

- [ ] Give every indexable route a unique, intent-matched `<title>` and meta description.
- [ ] Use one meaningful `<h1>` per page and a logical `h2`/`h3` hierarchy; do not use
      heading text only as visual styling.
- [ ] Add descriptive, unique image `alt` text for informative product imagery; keep
      decorative animation imagery empty-alt or hidden from assistive technology.
- [ ] Add canonical tags, language metadata, and Open Graph/Twitter metadata per route.
- [ ] Ensure product names, descriptions, prices, availability, sizing, shipping, and
      returns are visible in HTML and not dependent on an interaction to be indexed.
- [ ] Publish genuinely useful, original buying guides and training content; avoid
      thin, duplicated, AI-spun, or keyword-stuffed pages.
- [ ] Link related products, categories, and journal articles with descriptive anchor text.
- [ ] Add visible author/editor, publish date, update date, and contact/about information
      to editorial content.

### Should

- [ ] Add `Product`, `Offer`, `Brand`, `Organization`, and `Article` JSON-LD only when
      the visible page content supports the fields.
- [ ] Validate structured data with Rich Results Test and Schema Markup Validator.
- [ ] Localize title, description, currency, language, and `hreflang` only for real,
      maintained regional versions.
- [ ] Track branded and non-branded query coverage, click-through rate, and conversions;
      do not optimize for rankings alone.

## 3. AI agent and AI chatbot discoverability

### Must

- [ ] Make the canonical product, policy, shipping, returns, sizing, contact, and about
      information available as clean, stable, human-readable HTML pages.
- [ ] Use clear page titles, headings, definitions, tables, lists, and short factual
      paragraphs so retrieval systems can quote the correct answer and context.
- [ ] Ensure important facts are not available only inside canvas, images, hover states,
      animations, or client-side state after a hash navigation.
- [ ] Keep product facts consistent across visible copy, JSON-LD, feeds, and external
      catalog systems: name, SKU, price, currency, stock, sizes, image, and URL.
- [ ] Publish an accurate `llms.txt` only as a helpful navigation aid; do not treat it as
      an access-control mechanism or a replacement for `robots.txt` and normal HTML.
- [ ] Define an explicit, reviewed crawler policy for AI services and document any
      allowed or disallowed bots; review provider terms before allowing automated access.
- [ ] Protect customer, order, analytics, and internal operational data from indexing and
      from any retrieval or chatbot integration.

### Should

- [ ] Add an official product feed/API for approved integrations instead of scraping
      interactive UI state.
- [ ] Provide stable citation-friendly URLs and meaningful section headings for every
      answer a support chatbot should give.
- [ ] Test common prompts (“What is this product?”, “Which size?”, “What is the return
      policy?”) against the live site and check factual answers, citations, and freshness.
- [ ] Monitor referral traffic and assisted conversions from AI platforms without
      exposing personal data in analytics.

## 4. Speed and Core Web Vitals across screens

### Targets

- [ ] Mobile and desktop: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 at the 75th percentile.
- [ ] Keep initial HTML and critical CSS small; defer non-critical JavaScript and effects.
- [ ] Serve responsive, properly sized images in modern formats (AVIF/WebP), with width,
      height, `srcset`, `sizes`, lazy loading below the fold, and eager loading only for
      the main hero image.
- [ ] Self-host or subset fonts where practical, use `font-display: swap`, and avoid
      blocking third-party font requests when they delay first paint.
- [ ] Reduce particle, cursor, parallax, and animation work on low-power/mobile devices;
      honor `prefers-reduced-motion` and avoid long main-thread tasks.
- [ ] Cache immutable versioned assets for a long duration while keeping HTML revalidated.
      Verify the cache policy matches actual asset fingerprinting before enabling it.
- [ ] Enable Brotli/gzip compression, HTTP/2 or HTTP/3, and CDN delivery for static assets.
- [ ] Prevent layout shifts from images, fonts, banners, cart counts, and dynamically
      rendered product grids by reserving their dimensions.

### Screen matrix

- [ ] Test 320 px, 375 px, 390 px, 768 px, 1024 px, 1280 px, and 1440 px viewports.
- [ ] Test portrait and landscape orientations, touch input, keyboard-only navigation,
      zoom to 200%, and high-contrast/forced-colors modes.
- [ ] Verify navigation, filters, product gallery, cart, checkout, newsletter, theme
      toggle, dialogs, focus order, and error messages on each supported breakpoint.
- [ ] Test slow 3G, offline/failed image requests, reduced CPU, and a cold browser cache.
- [ ] Confirm tap targets are at least 44 x 44 CSS px and no horizontal scrolling occurs.

## 5. Accessibility and resilient behavior

- [ ] Use semantic landmarks (`header`, `nav`, `main`, `footer`) and provide a skip link.
- [ ] Give every control an accessible name, visible focus style, correct button/link
      semantics, and an accurate expanded/selected state.
- [ ] Make the mobile menu, filters, gallery, cart, checkout, and confirmation states
      operable without a mouse and announce important updates to screen readers.
- [ ] Associate every form input with a label; validate email, payment, and address
      fields with specific, non-destructive error messages.
- [ ] Meet WCAG 2.2 AA contrast, reflow, focus, motion, and target-size requirements.
- [ ] Test with axe/Lighthouse plus at least one real keyboard and screen-reader pass.
- [ ] Handle missing images, malformed hash/path IDs, empty carts, unavailable products,
      expired sessions, and storage failures without blank screens or uncaught errors.

## 6. Security and privacy

### Must

- [ ] Enforce HTTPS and add HSTS only after every subdomain and asset dependency is HTTPS.
- [ ] Send a restrictive Content Security Policy; avoid unsafe inline scripts/styles and
      keep third-party origins allowlisted and reviewed.
- [ ] Add `X-Content-Type-Options: nosniff`, `Referrer-Policy`, clickjacking protection
      (`frame-ancestors`/`X-Frame-Options`), and an appropriate `Permissions-Policy`.
- [ ] Do not store payment card data, secrets, access tokens, or sensitive customer data
      in `localStorage`; use a PCI-compliant payment provider and secure server sessions.
- [ ] Validate and encode all user-controlled values before rendering; avoid inserting
      untrusted product, review, or query content with unsafe `innerHTML`.
- [ ] Add server-side authorization, input validation, rate limiting, CSRF protection,
      webhook signature verification, and idempotency for any future API or checkout.
- [ ] Minimize analytics and newsletter data, obtain consent where required, publish
      privacy/terms/cookie policies, and define retention/deletion procedures.
- [ ] Keep dependencies patched, lock versions, scan them in CI, and never commit
      `.env` files, API keys, or deployment credentials.

### Should

- [ ] Add dependency and secret scanning, SAST, DAST, and security headers checks to CI.
- [ ] Configure error reporting with scrubbing for email, address, token, and payment data.
- [ ] Maintain a vulnerability disclosure contact, incident response runbook, backups,
      restore drills, and an audit trail for administrative actions.

## 7. Scalability, reliability, and operations

- [ ] Keep catalog/content data separate from presentation code so products can grow
      without a single oversized JavaScript bundle.
- [ ] Paginate or incrementally load large product and journal collections; do not render
      the entire catalog on every route.
- [ ] Use CDN caching for public content and a managed database/API with indexes,
      connection pooling, timeouts, retries with backoff, and bounded payloads when
      dynamic services are introduced.
- [ ] Add uptime, latency, error-rate, Web Vitals, conversion, and checkout monitoring
      with alerts tied to actionable runbooks.
- [ ] Define SLOs and budgets for availability, API latency, JavaScript errors, LCP/INP/CLS,
      and failed checkout/newsletter submissions.
- [ ] Run load tests for expected launch traffic and at least 5x peak growth traffic;
      include cold cache, image delivery, search/filtering, and checkout dependencies.
- [ ] Verify deploy previews, atomic releases, rollback procedure, environment separation,
      backups, restore testing, and cache invalidation.

## 8. Release and recurring audit gates

### Before every production release

- [ ] Run unit/integration checks and a production build with no console errors.
- [ ] Run Lighthouse mobile and desktop; check Core Web Vitals and accessibility.
- [ ] Crawl representative routes and validate status codes, canonicals, robots, sitemap,
      structured data, metadata, internal links, and 404 behavior.
- [ ] Run dependency/security/header checks and inspect the final deployment diff.
- [ ] Test checkout, cart persistence, forms, analytics consent, and critical error paths.

### Monthly

- [ ] Review Search Console coverage, performance, manual actions, enhancements, and
      crawl anomalies.
- [ ] Review real-user Web Vitals by device, browser, geography, and route.
- [ ] Review dependency vulnerabilities, third-party scripts, access permissions, logs,
      backups, and privacy requests.
- [ ] Sample AI-agent answers and product/policy facts for accuracy and stale content.

### Quarterly or after major growth

- [ ] Repeat a full accessibility audit and manual assistive-technology test.
- [ ] Re-run load and capacity tests, update SLOs, and verify rollback/restore drills.
- [ ] Review information architecture, indexation strategy, content quality, and URL
      migrations before adding new categories, locales, or integrations.

## Owner and evidence log

| Area | Owner | Last checked | Status | Evidence |
| --- | --- | --- | --- | --- |
| Crawlability and indexation |  |  | Not started |  |
| On-page SEO and structured data |  |  | Not started |  |
| AI agent discoverability |  |  | Not started |  |
| Performance and responsive screens |  |  | Not started |  |
| Accessibility |  |  | Not started |  |
| Security and privacy |  |  | Not started |  |
| Reliability and scalability |  |  | Not started |  |
