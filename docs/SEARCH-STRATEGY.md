# Search visibility and citation strategy

This is a free, owner-operated process for savisaluwadana.github.io. Technical readiness, discovery, indexation, ranking and AI citations are different outcomes.

## Search intent and canonical destination

These are hypotheses, not measured keyword volume or live positions. Do not create near-duplicate pages to target minor wording variants.

| Search intent | Canonical destination | What the reader can verify |
| --- | --- | --- |
| Savi Saluwadana / software engineer Sri Lanka | / | Professional identity, selected work, navigation |
| Savi Saluwadana biography, education and interests | /about/ | Owner-authored biography, past internship, education status and official profiles |
| Savi Saluwadana projects | /products/ | Project scope and industry links |
| Software architecture portfolio | /engineering/ | Application and data boundaries |
| Agentic AI architecture examples | /engineering/agentic-systems/ | Tool and workflow authority |
| MCP permission boundaries | /insights/mcp-permission-boundaries/ | Policy principles and verification example |
| Durable agentic workflows | /insights/durable-agentic-workflows/ | State, retries and approval |
| Go modular monolith SaaS | /insights/go-modular-monolith-saas/ | Domain and transaction boundaries |
| Platform engineering paved road | /insights/platform-engineering-paved-road/ | Delivery contracts and evaluation criteria |
| PostgreSQL multi-tenancy | /insights/postgres-multitenancy-boundaries/ | Tenant isolation and validation |
| Interactive software engineering demonstrations | /lab/ | Executable teaching models and tests |
| Saelior / EventMesh architecture | /projects/saelior/ and /projects/eventmesh/ | Development scope and project details |

## Free indexing workflow

1. Confirm the URL-prefix property in Google Search Console and Bing Webmaster Tools. Submit sitemap.xml through each service.
2. After a substantive change, inspect the homepage or changed pages in Search Console. Request indexing when appropriate; do not use Google's Indexing API for ordinary portfolio pages.
3. After GitHub Pages deployment, run the manual GitHub Actions workflow **Notify IndexNow of changed pages** with only changed canonical paths. The public key file is ownership proof, not a private API credential. The script validates live status, canonical and indexability before posting to IndexNow.
4. HTTP 200 means notification accepted; HTTP 202 means accepted for key validation. Neither means indexed. IndexNow applies to participating engines including Bing, not Google Search.
5. Never submit unchanged pages repeatedly or bypass rate limits.

## Answer engine and generative search measurement

Use the fixed prompts in data/ai-visibility-prompts.json. Run in fresh, search-enabled sessions twice per month and record date, provider, mention, cited URL and fact accuracy. A citation to another domain is not a citation to the portfolio. Keep private logs outside the repository. Separate branded and unbranded queries; don't infer overall visibility from a small prompt sample.

Check identity answers against the public biography: former employment is not current employment, degree award is not claimed, projects have distinct development status, and the interactive lab provides models rather than real service benchmarks. Use sources to support claims; never invent traffic, citations or independent endorsements.

## Authority and distribution

- Link to the original article when sharing relevant research on LinkedIn, DEV, Medium or daily.dev. Set canonical attribution on syndication when supported.
- Share only genuinely useful examples in relevant engineering communities, disclosing your relationship to the portfolio.
- Publish measured experiments with method, environment, code, reproducibility instructions, limitations and date. Avoid mass-produced question pages or self-created fake endorsements.
- Track Search Console queries, pages, clicks, impressions and CTR over equal time windows. Review index coverage and Bing URL inspection. Actual search metrics require verified account access.

## Official reference material

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.openai.com/api/docs/bots
- https://www.indexnow.org/documentation

Google's AI features use normal search eligibility and useful content; no special GEO schema is required. Search systems decide what to index, rank or cite.

## Automatic discovery after deployment
A push that changes canonical HTML on main now triggers an automatic IndexNow notification. It selects only added or modified sitemap HTML files by Git diff, waits until the deployed responses match the committed HTML, then calls the existing verified submission script. Non-HTML edits alone do not submit URLs. Deleted URLs are outside this automatic path; use the manual process for supported changed URLs. If deployment cannot be verified within the bounded wait, the job fails without submitting stale content. Use manual notification after a successful deployment if needed. Cancellation of superseded pushes prevents redundant work; manually submit any important changed URLs skipped by cancelled runs. No Google indexing request is sent by IndexNow.

Ten product profiles now include contextual links to relevant articles and teaching models. The build reproduces these links from data/topic-links.json. They are educational references, not proof that every referenced design is deployed in the product.
