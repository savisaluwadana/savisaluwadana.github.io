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
