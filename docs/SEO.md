# Free SEO operating guide
Site: https://savisaluwadana.github.io/

No paid SEO subscription, API key, or CMS is required.

## One-time account setup
1. Open [Google Search Console](https://search.google.com/search-console/) and add the URL-prefix property `https://savisaluwadana.github.io/`. Verify with the existing HTML file if it matches your account; otherwise download the verification file from your property.
2. Submit `sitemap.xml` in Sitemaps. Inspect the homepage, about, architecture, writing, and product URLs. Request indexing when appropriate.
3. Open [Bing Webmaster Tools](https://www.bing.com/webmasters/) and import the verified Google property or verify independently. Submit the same sitemap.
4. Optionally create a GA4 web stream at [Google Analytics](https://analytics.google.com/). Add the actual measurement ID only after reviewing privacy and consent requirements. Never commit credentials or fabricate an ID.

## Keyword map (hypotheses, not volume estimates)
| Canonical page | Primary search intent | Related topics |
| --- | --- | --- |
| / | Savi Saluwadana | software engineer Sri Lanka, software engineering portfolio |
| /about/ | software engineering profile | professional background, technical interests |
| /engineering/ | software architecture portfolio | distributed systems, Go, system design |
| /engineering/agentic-systems/ | agentic systems architecture | MCP tools, permission boundaries |
| /products/ | software engineering projects | product architecture and case studies |
| /insights/ | engineering articles | platform engineering, applied AI, databases |

Write for readers, not keyword density. Publish source-backed case studies with real constraints, measured results when available, architecture diagrams, trade-offs and limitations. Do not manufacture professional claims, testimonials or benchmarks. Syndicate excerpts with canonical attribution where supported.

## Recurring free checks
- GitHub Actions runs static validation and generates a downloadable SEO audit on pushes, pull requests and Mondays (03:30 UTC / 09:00 Sri Lanka).
- Review [PageSpeed Insights](https://pagespeed.web.dev/) on mobile and desktop for the homepage, one project and one article. Record lab metrics separately from real-user Core Web Vitals, which may be unavailable for low-traffic sites.
- Use [Schema Markup Validator](https://validator.schema.org/) for Person/ProfilePage/Article and [Rich Results Test](https://search.google.com/test/rich-results) for supported Google features.
- Review Search Console and Bing clicks, impressions, queries, indexed pages, and excluded-page reasons monthly; compare equal periods. Track recruiter inquiries separately if analytics is enabled.
- Test a fixed set of AI search prompts in fresh sessions and log whether the site is cited, whether facts are accurate and the cited URL. Results vary, and inclusion cannot be guaranteed.

## Local audit
```sh
node scripts/build-discovery.mjs
node scripts/check-site.mjs
node scripts/check-seo.mjs --json
```
The JSON audit contains page metadata, lengths, warnings and errors. It is a local/CI report, not real search traffic or a ranking score. Do not commit the generated report to the public site. Do not pay for backlinks or use automated index submission APIs outside their supported scope.

## Content queue
- Agent gateways vs API gateways: compare trust boundaries, authorization and observability.
- Durable workflows in Go: add a reproducible retry/idempotency experiment to the existing note.
- PostgreSQL tenancy: demonstrate a tenant isolation test and document its limitations.

Google/Bing account verification, analytics activation, actual indexing, Core Web Vitals and rankings require separate checks; repository changes do not establish them.

## SEO Intelligence Engine
- Metadata overrides are maintained in `data/seo-metadata.json` and reapplied during the discovery build. Full descriptions and architecture evidence remain in visible content and JSON-LD.
- The performance workflow collects Lighthouse CI lab results across four representative routes (two runs each), plus Playwright/axe checks at mobile and desktop sizes. Initial thresholds are advisory; runtime/navigation failures are blocking. Public technical reports are retained for 30 days. Review baselines before making performance budgets blocking.
- The scheduled live check requests the deployed sitemap, robots.txt and canonical pages. It verifies status, final URL, canonical and noindex; it does not measure whether Google has indexed pages.
- Technical CI artifacts are public. **Never attach Google/Bing search analytics, credentials or private reports to this public repository.** GitHub users with read access may download workflow artifacts.
- No paid services or API subscriptions are required. Search API quota and standard free public-repository runner limits apply.

### Private search analytics on your Mac
1. Verify Google Search Console and Bing properties for the URL-prefix site.
2. Enable the [Search Console API](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing) in a Google Cloud project; obtain an OAuth access token with the `https://www.googleapis.com/auth/webmasters.readonly` scope from an authorized account (for example via Google's OAuth 2.0 Playground with your own OAuth client). A plain API key is not sufficient. Tokens expire.
3. Generate a Bing API key in Webmaster Tools Settings > API access. This key can cover all verified sites; keep it confidential.
4. From your local clone, set `GSC_ACCESS_TOKEN` and/or `BING_WEBMASTER_API_KEY` in your shell via a secure password-manager or interactive secret input. Do not put secrets in shell history, the repo or ChatGPT.
5. Run `node scripts/search-intelligence.mjs`. It writes dated JSON and Markdown reports to `~/.portfolio-seo/` outside the repository. Google reports compare two finalized 28-day periods and list top queries and pages; Bing uses its own provider reporting range. Re-run weekly with a valid token. Keep the directory private; never sync it to the public site.
6. Run `node scripts/init-visibility-log.mjs` for a local dated CSV with ten fixed prompts across four AI search services. Run prompts manually in fresh search-enabled sessions, fill the fields honestly, and compare snapshots. No automated scraping or paid model APIs are used.

### Backlinks and competitors
Export Links from Search Console and backlink data from Bing's free UI when available. Keep exports in the private reporting directory. Check the top results for the keyword map manually once a month, record URLs and content gaps, and prioritize original projects and reproducible benchmarks over keyword stuffing. Automated competitor ranking and backlink crawling are not included.

### Reporting and identity consistency
- Technical audit results appear in GitHub Actions job summaries as well as JSON artifacts. Scheduled/manual browser audits check every sitemap URL at two viewports; normal pushes/PRs check eight representative routes. Performance tests use a pinned Ubuntu 24.04 runner for browser compatibility.
- The canonical Person record includes the existing GitHub, LinkedIn, DEV, Medium and daily.dev profiles. The build synchronizes that identity across all HTML routes, including independently maintained articles.
- A successful technical test is not a search ranking, live indexing or accessibility certification. Review actual metrics and individual violation targets before changing thresholds.

### Private offline dashboard
Run `node scripts/render-private-dashboard.mjs` and then `open ~/.portfolio-seo/dashboard.html` on macOS. The dashboard displays actual local Google snapshots, keyword opportunities, top pages and completed AI visibility tests. It works offline, uses no external JS libraries, and never uploads reports. Blank or untested results are not counted as zero. Bing raw rows remain in local JSON because its reporting period differs. Run the script again after collecting new snapshots. The self-test can run with `node scripts/render-private-dashboard.mjs --self-test` without credentials.

### Personal entity accuracy
The About page is the canonical owner-authored professional biography. Keep employment dates, degree completion and credential status accurate; distinguish projects, contributions and research interests from verified outcomes. Update `data/discovery.json` and `data/profile.json`, regenerate the site, and check branded AI answers for stale employer claims or invented details. Avoid duplicate biography pages, keyword stuffing and unsupported credential schema.

### Featured project discovery
Saelior and EventMesh have distinct canonical portfolio URLs with owner-authored scope and architecture summaries. Both are in development; keep the public description accurate and do not publish private source references, deployment claims or unsupported traction. Links from the homepage, biography and directory, plus sitemap, feed and AI-readable copies, are regenerated and tested together.
