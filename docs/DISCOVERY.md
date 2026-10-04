# Search and AI discoverability

This portfolio publishes the professional identity and product architecture as ordinary static HTML. Search engines and simple retrieval clients can read the main content without running JavaScript.

## Public surfaces

| Path | Purpose |
| --- | --- |
| `/` | Professional profile, product cards and the technology stack |
| `/about/` | Named professional profile, expertise examples, profile questions and source links |
| `/products/` | Complete product directory grouped by domain |
| `/engineering/` | Project-backed architecture reference: agents, local-first data, tenancy and transactions |
| `/engineering/agentic-systems/` | Detailed tool, API, state and review walkthroughs for three projects |
| `/open-source/` | Verified public repositories, license metadata and open-source collaboration interests |
| `/public-work.json` | Public repository references from the same verified source records |
| `/feed.xml` | Atom feed for reference and product documentation; advertised in every page’s HTML head |
| `/about/index.md`, `/products/index.md`, `/engineering/index.md` | Markdown equivalents of the three entry pages |
| `/products/<id>/` | Unique product overview, workflow, SVG architecture, component table and current scope |
| `/products/<id>/index.md` | Markdown representation of the same product |
| `/about.md` | Professional profile and product index in Markdown |
| `/profile.json` | ProfilePage with the canonical Person identity |
| `/products.json` | Public product descriptions, workflows and architecture responsibilities |
| `/llms.txt` | Concise discovery index for tools that support this convention |
| `/llms-full.txt` | Full profile and product summaries as text |
| `/sitemap.xml` and `/sitemap.txt` | All canonical HTML pages |
| `/robots.txt` | Public crawl permissions and sitemap locations |

`llms.txt` is an optional discovery convention for retrieval tools that support it. Google does not use it for Search. It does not guarantee ingestion, model training, citation, indexing or ranking. Ordinary searchable HTML, helpful product detail, real source links and consistent identity remain the foundation.

## Google Search Console

The existing `google062719a40465c49b.html` verification file is preserved.

1. Open the Search Console property for `https://savisaluwadana.github.io/`.
2. Submit `https://savisaluwadana.github.io/sitemap.xml` in Sitemaps.
3. Inspect the homepage URL and request indexing. Inspect important product pages as needed.
4. Review Page Indexing, Crawl Stats and search performance after Google has had time to recrawl.

Publishing files is not the same as submitting a sitemap or requesting indexing in an authenticated account. This change does not claim those account actions have been performed. Google decides whether and when to crawl, index and display a page. Deprecated sitemap-ping endpoints and Google's restricted job/broadcast Indexing API are not used.

## Keep the content consistent

The source data is `data/profile.json`, `data/products.json`, `data/discovery.json` and `data/public-work.json`. The discovery file contains directory groups and reference content; public-work records were checked against GitHub repository metadata. Update descriptions, scope notes and diagram nodes from the actual application before publishing. Link only public repositories. Private product summaries must not contain credentials, internal customer information or private repository links. Public visibility is not an open-source license grant: do not invent a license when GitHub metadata does not identify one.

Run with Node.js 20 or later:

```bash
node scripts/build-discovery.mjs
node scripts/check-site.mjs
```

Generated files are committed because GitHub Pages serves them directly. The build preserves the surrounding homepage sections and existing visual classes. The runtime JavaScript handles navigation, motion, copy-email and email composition; it does not generate portfolio content.

When changing content, update the reviewed date on the affected product and the build's `updated` date. Avoid inventing future dates or changing `lastmod` when the content has not changed. If removing a product, remove its generated folder too.

Structured data describes Savi as a contributor to the products and does not fabricate ratings, revenue, users or deployment readiness. TimelyHelp explicitly describes product/frontend contribution; the accounting app is single-company; the ad analysis tool is a prototype with mocked account connectors.

The discovery checker follows actual HTML links from the homepage and requires every canonical page to be reachable. It checks unique titles and descriptions, directory coverage, schema identity, Markdown references, public source coverage, feed entries and agent-index coverage. The entry pages answer different needs. Profile questions remain ordinary visible HTML and do not claim FAQ rich-result eligibility.

Feed entries use the stable canonical page URL as their identifier and inherit the named author. They contain documentation summaries and source review dates, not claims of new product launches. Date-granularity review dates are normalized to UTC midnight for Atom’s required timestamp format. New builds do not invent a new update time when content is unchanged.

## Sources

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google: Crawling and indexing FAQ](https://developers.google.com/search/help/crawling-index-faq)
- [Google: General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: Crawlable links and descriptive anchor text](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: Optimizing for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: Build and submit a sitemap, including RSS and Atom](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [RFC 4287: Atom syndication format](https://www.rfc-editor.org/rfc/rfc4287.html)
