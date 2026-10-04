# Search and AI discoverability

This portfolio publishes the professional identity and product architecture as ordinary static HTML. Search engines and simple retrieval clients can read the main content without running JavaScript.

## Public surfaces

| Path | Purpose |
| --- | --- |
| `/` | Professional profile, product cards and the technology stack |
| `/products/<id>/` | Unique product overview, workflow, SVG architecture, component table and current scope |
| `/products/<id>/index.md` | Markdown representation of the same product |
| `/about.md` | Professional profile and product index in Markdown |
| `/profile.json` | ProfilePage with the canonical Person identity |
| `/products.json` | Public product descriptions, workflows and architecture responsibilities |
| `/llms.txt` | Concise discovery index for tools that support this convention |
| `/llms-full.txt` | Full profile and product summaries as text |
| `/sitemap.xml` and `/sitemap.txt` | All canonical HTML pages |
| `/robots.txt` | Public crawl permissions and sitemap locations |

`llms.txt` is an optional discovery convention. It does not guarantee ingestion, model training, citation, indexing or ranking. Ordinary searchable HTML, helpful product detail, real source links and consistent identity remain the foundation.

## Google Search Console

The existing `google062719a40465c49b.html` verification file is preserved.

1. Open the Search Console property for `https://savisaluwadana.github.io/`.
2. Submit `https://savisaluwadana.github.io/sitemap.xml` in Sitemaps.
3. Inspect the homepage URL and request indexing. Inspect important product pages as needed.
4. Review Page Indexing, Crawl Stats and search performance after Google has had time to recrawl.

Publishing files is not the same as submitting a sitemap or requesting indexing in an authenticated account. This change does not claim those account actions have been performed. Google decides whether and when to crawl, index and display a page. Deprecated sitemap-ping endpoints and Google's restricted job/broadcast Indexing API are not used.

## Keep the content consistent

The source data is `data/profile.json` and `data/products.json`. Update descriptions, scope notes and diagram nodes from the actual application before publishing. Link only public repositories. Private product summaries must not contain credentials, internal customer information or private repository links.

Run with Node.js 20 or later:

```bash
node scripts/build-discovery.mjs
node scripts/check-site.mjs
```

Generated files are committed because GitHub Pages serves them directly. The build preserves the surrounding homepage sections and existing visual classes. The runtime JavaScript handles navigation, motion, copy-email and email composition; it does not generate portfolio content.

When changing content, update the reviewed date on the affected product and the build's `updated` date. Avoid inventing future dates or changing `lastmod` when the content has not changed. If removing a product, remove its generated folder too.

Structured data describes Savi as a contributor to the products and does not fabricate ratings, revenue, users or deployment readiness. TimelyHelp explicitly describes product/frontend contribution; the accounting app is single-company; the ad analysis tool is a prototype with mocked account connectors.

## Sources

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google: Crawling and indexing FAQ](https://developers.google.com/search/help/crawling-index-faq)
- [Google: General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
