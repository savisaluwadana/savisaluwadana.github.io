# Savi Saluwadana — engineering portfolio

Static GitHub Pages portfolio: professional identity, product work, architecture, platform engineering, DevOps and AI systems.

The existing homepage visual design is preserved. Product cards link to permanent overview pages with workflows, source-grounded SVG diagrams, component responsibilities and current-scope notes. The site currently contains 16 product pages.

## Develop and verify

No package installation or frontend framework is required.

```bash
node scripts/build-discovery.mjs
node scripts/check-site.mjs
python -m http.server 8000
```

Open `http://localhost:8000/`. Edit product source data in `data/products.json`, canonical profile data in `data/profile.json`, and directory/reference content in `data/discovery.json`, then regenerate and check the static output before committing. GitHub Pages serves the committed files directly.

Existing colors, typography, hero layout, card treatment, contact forms, navigation and motion remain in the original CSS and JavaScript. `product-details.css` adds the requested larger wordmark, product links and matching detail-page styles. Product content and the technology stack are present in the initial HTML.

## Discovery

Each HTML page includes its own canonical URL and metadata, structured identity, and product/breadcrumb data where appropriate. The sitemap covers 21 canonical pages: the homepage, contact, About, product directory, architecture reference and 16 products. The checker verifies that HTML links connect every page to the homepage. Markdown, JSON, `llms.txt` and `llms-full.txt` offer additional retrieval formats.

Read [the discovery and maintenance guide](docs/DISCOVERY.md) for Search Console submission, verified scope notes and how to keep generated content consistent. Rankings, indexing speed and AI citations are controlled by the search/retrieval providers and cannot be guaranteed by site changes.
