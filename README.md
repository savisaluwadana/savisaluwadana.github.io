# Savi Saluwadana — engineering portfolio

Static GitHub Pages portfolio: public source, project architecture, design decisions and platform engineering interests.

Visit [Savi Saluwadana’s portfolio](https://savisaluwadana.github.io/), [engineering profile](https://savisaluwadana.github.io/about/), [agentic systems architecture](https://savisaluwadana.github.io/engineering/agentic-systems/) and [public source index](https://savisaluwadana.github.io/open-source/).

The homepage uses a neutral editorial design, real project highlights, and a separate, clearly labelled research lab. Proposed projects are not featured in the selected work grid. Existing source-backed case studies and permanent product pages are preserved. Product cards link to permanent overview pages with workflows, source-grounded SVG diagrams, component responsibilities and current-scope notes. The site currently contains 15 product pages across ten industry categories.

## Develop and verify

No package installation or frontend framework is required.

```bash
node scripts/build-discovery.mjs
node scripts/check-site.mjs
node scripts/check-seo.mjs
python -m http.server 8000
```

Open `http://localhost:8000/`. Edit product source data in `data/products.json`, canonical profile data in `data/profile.json`, directory/reference content in `data/discovery.json` and verified repository records in `data/public-work.json`, then regenerate and check the static output before committing. GitHub Pages serves the committed files directly.

Shared neutral theme tokens are in `base-styles.css`; the editorial homepage additions are in `engineering-portfolio.css`. Existing contact forms, architecture tabs and responsive navigation remain, with a native quick-navigation dialog added. `product-details.css` adds the requested larger wordmark, product links and matching detail-page styles. Product content and the technology stack are present in the initial HTML.

## Discovery

Each HTML page includes its own canonical URL and metadata, structured identity, and product/breadcrumb data where appropriate. The sitemap covers 30 canonical pages: the homepage, contact, seven directory/profile/reference pages and 15 products. The checker verifies that HTML links connect every page to the homepage. The [Atom feed](https://savisaluwadana.github.io/feed.xml) publishes 28 reference, article and project summaries. Markdown, JSON, `llms.txt` and `llms-full.txt` offer additional retrieval formats.

Read [the discovery and maintenance guide](docs/DISCOVERY.md) for Search Console submission, verified scope notes and how to keep generated content consistent. Rankings, indexing speed and AI citations are controlled by the search/retrieval providers and cannot be guaranteed by site changes.

## Source-first positioning (November 2026)

The directory groups 15 projects by industry. Seven have verified accessible repository references. Public visibility is not an open-source licence: Avara's README says proprietary, Pain-Point-Analyzer is MIT, and other linked repositories have no identified licence. The platform section describes Docker, CI and deployment evidence only; it does not claim production platform experience. The insights page separates five proposed article topics from existing published notes.

## Writing workflow

Keep writing public and authentication-free. GitHub repository permissions protect publishing: use a branch and pull request, or GitHub's web editor. The writing hub is `insights/index.html` with a matching Markdown index at `insights/index.md`. Existing articles are paired static HTML and Markdown files under `insights/<slug>/`.

For a new article: create the HTML/Markdown pair using an existing note as a template; register its metadata in `insightPages` in `scripts/build-discovery.mjs`, add the path to `insightPaths` in `scripts/check-site.mjs`, update the hub's links, then run the build and site checker before publishing. Drafts can stay in a local checkout or private repository; public branches are not private. Link to externally published articles rather than copying them automatically. Use canonical attribution when syndicating an original article to Medium or DEV; daily.dev is a community/activity profile.

External writing links are in the homepage writing section, the insights HTML/Markdown index and the discovery generator. Update those together if profile URLs change.

## Free SEO operations

See [the SEO operating guide](docs/SEO.md). The SEO GitHub Actions workflow checks committed and regenerated discovery files and creates a metadata audit report. Search Console, Bing and optional analytics require separate account setup.

The [SEO Intelligence Engine guide](docs/SEO.md#seo-intelligence-engine) describes Lighthouse, browser accessibility, live URL validation, local private Search Console/Bing reports, and manual AI visibility benchmarking. No private search data is uploaded to GitHub.

Featured development projects [Saelior](https://savisaluwadana.github.io/projects/saelior/) and [EventMesh](https://savisaluwadana.github.io/projects/eventmesh/) have separate public architecture and scope summaries. Their private source repositories are not listed as public.
