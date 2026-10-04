import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildEntryPages } from './build-entry-pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://savisaluwadana.github.io';
const updated = '2026-10-04';
const products = JSON.parse(await readFile(path.join(root, 'data/products.json'), 'utf8'));
const person = JSON.parse(await readFile(path.join(root, 'data/profile.json'), 'utf8'));
const discovery = JSON.parse(await readFile(path.join(root, 'data/discovery.json'), 'utf8'));
const publicWork = JSON.parse(await readFile(path.join(root, 'data/public-work.json'), 'utf8'));
const entryPaths = ['/products/', ...discovery.pages.map(p => p.path)];
const website = { '@type': 'WebSite', '@id': `${base}/#website`, url: `${base}/`, name: 'Savi Saluwadana', inLanguage: 'en', publisher: { '@id': person['@id'] }, hasPart: entryPaths.map(p => ({ '@id': `${base}${p}#page` })) };
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const url = p => `${base}/products/${p.id}/`;
const list = { '@type': 'ItemList', '@id': `${base}/#products`, name: 'Products and engineering work by Savi Saluwadana', itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: url(p) })) };
const schema = graph => `<script type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2).replaceAll('<', '\\u003c')}\n  </script>`;
const write = async (name, content) => { await mkdir(path.dirname(path.join(root, name)), { recursive: true }); await writeFile(path.join(root, name), content); };
const replaceRegion = (html, name, content) => html.replace(new RegExp(`<!-- ${name}:START -->[\\s\\S]*?<!-- ${name}:END -->`), `<!-- ${name}:START -->\n${content}\n          <!-- ${name}:END -->`);
const tags = p => p.tags.map(tag => `<span>${esc(tag)}</span>`).join('');
const actions = p => `<a href="/products/${esc(p.id)}/">Overview &amp; architecture</a>${p.href ? `<a href="${esc(p.href)}" target="_blank" rel="noreferrer">${esc(p.linkLabel)}</a>` : ''}`;
let home = await readFile(path.join(root, 'index.html'), 'utf8');
const cards = products.map((p, i) => `${i === 4 ? '<div class="project-group-label reveal"><span>Engineering systems &amp; developer tooling</span><strong>Backend architecture, operational SaaS, automation and developer-facing products.</strong></div>' : ''}
          <article class="${esc(p.classes)} reveal" id="${esc(p.id)}">
            <div class="project-topline"><span>${String(i + 1).padStart(2, '0')}</span><span>${esc(p.category)}</span></div>
            <div class="project-body">
              <p class="project-type">${esc(p.type)}</p>
              <h3><a class="project-title-link" href="/products/${esc(p.id)}/">${esc(p.name)}</a></h3>
              <p>${esc(p.description)}</p>
              <div class="architecture-line" aria-label="${esc(p.name)} architecture">${esc(p.architecture)}</div>
              <div class="project-tags">${tags(p)}</div>
            </div>
            <div class="project-footer"><p>${esc(p.footer)}</p><div class="project-links">${actions(p)}</div></div>
          </article>`).join('\n');
home = replaceRegion(home, 'PRODUCTS', cards);
home = replaceRegion(home, 'PROOF', products.map(p => `          <a href="#${esc(p.id)}">${esc(p.name)}</a>`).join('\n'));
home = replaceRegion(home, 'SCHEMA', schema([website, person, { '@type': 'ProfilePage', '@id': `${base}/#profile`, url: `${base}/`, name: 'Savi Saluwadana — Software and Product Engineer', mainEntity: { '@id': person['@id'] }, isPartOf: { '@id': website['@id'] }, hasPart: { '@id': list['@id'] }, dateModified: updated, inLanguage: 'en' }, list]));
if (!home.includes('rel="describedby"')) home = home.replace('<link rel="canonical"', '<link rel="describedby" type="text/plain" href="/llms.txt">\n  <link rel="alternate" type="application/json" href="/profile.json" title="Public profile data">\n  <link rel="alternate" type="text/markdown" href="/about.md" title="Profile in Markdown">\n  <link rel="canonical"');
home = home.replace(/<title>.*?<\/title>/, '<title>Savi Saluwadana | Software Engineer in Sri Lanka — Products &amp; Architecture</title>');
home = home.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Savi Saluwadana, software engineer in Sri Lanka. Explore product architecture, agentic systems, open-source development, Go and Kubernetes.">');
home = home.replace('          <p>I’m based in Sri Lanka and work across', '          <p>I’m Savi Saluwadana, a software and product engineer based in Sri Lanka. I work across');
if (!home.includes('type="application/atom+xml"')) home = home.replace('<link rel="canonical"', '<link rel="alternate" type="application/atom+xml" href="/feed.xml" title="Savi Saluwadana — Engineering &amp; products">\n  <link rel="canonical"');
await write('index.html', home);

// Contact shares the same canonical identity as the generated portfolio pages.
let contact = await readFile(path.join(root, 'contact.html'), 'utf8');
contact = contact.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, json) => {
  const graph = JSON.parse(json)['@graph'];
  return schema(graph.map(node => node['@type'] === 'Person' ? person : node));
});
await write('contact.html', contact);
if (!contact.includes('type="application/atom+xml"')) {
  contact = contact.replace('<link rel="canonical"', '<link rel="alternate" type="application/atom+xml" href="/feed.xml" title="Savi Saluwadana — Engineering &amp; products">\n  <link rel="canonical"');
  await write('contact.html', contact);
}

// Render source-grounded diagrams as SVG at build time: no runtime diagram CDN.
function diagram(p) {
  const width = 760, nodeWidth = 210, nodeHeight = 88, rowGap = 154;
  const positions = new Map();
  p.rows.forEach((row, r) => row.forEach((node, c) => positions.set(node[0], { x: (width / row.length) * (c + .5) - nodeWidth / 2, y: 34 + r * rowGap, node })));
  const height = 100 + (p.rows.length - 1) * rowGap + nodeHeight;
  const lines = p.edges.map(([from, to]) => {
    const a = positions.get(from), b = positions.get(to);
    if (!a || !b) throw new Error(`Unknown component in ${p.id}: ${from} -> ${to}`);
    const x1 = a.x + nodeWidth / 2, x2 = b.x + nodeWidth / 2;
    const down = b.y > a.y;
    // Draw a callback on its own route instead of merging with a request bus.
    if (!down && b.y < a.y && p.edges.some(([start, end]) => start === to && end === from)) {
      const side = width - 12;
      return `<path d="M ${a.x + nodeWidth} ${a.y + nodeHeight / 2} H ${side} V ${b.y + nodeHeight / 2} H ${b.x + nodeWidth}"/>`;
    }
    if (a.y === b.y) {
      const below = a.y + nodeHeight + 24;
      return `<path d="M ${x1} ${a.y + nodeHeight} V ${below} H ${x2} V ${b.y + nodeHeight}"/>`;
    }
    // Skip-row connections go around the perimeter, rather than through nodes.
    if (Math.abs(b.y - a.y) > rowGap) {
      const side = x1 <= width / 2 ? 12 : width - 12;
      const startX = side === 12 ? a.x : a.x + nodeWidth;
      const endX = side === 12 ? b.x : b.x + nodeWidth;
      return `<path d="M ${startX} ${a.y + nodeHeight / 2} H ${side} V ${b.y + nodeHeight / 2} H ${endX}"/>`;
    }
    const y1 = a.y + (down ? nodeHeight : 0), y2 = b.y + (down ? 0 : nodeHeight), middle = (y1 + y2) / 2;
    return `<path d="M ${x1} ${y1} V ${middle} H ${x2} V ${y2}"/>`;
  }).join('');
  const nodes = [...positions.values()].map(({ x, y, node }) => `<g><rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="4" fill="#f4f1ea" stroke="#77746d"/><text x="${x + nodeWidth / 2}" y="${y + 34}" text-anchor="middle" fill="#111111" font-size="17" font-weight="650">${esc(node[1])}</text><text x="${x + nodeWidth / 2}" y="${y + 60}" text-anchor="middle" fill="#5b5852" font-size="12.5">${esc(node[2])}</text></g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="diagram-title diagram-description" font-family="Inter, ui-sans-serif, system-ui, sans-serif"><title id="diagram-title">${esc(p.name)} architecture</title><desc id="diagram-description">${esc(p.edges.map(([a, b]) => `${positions.get(a).node[1]} connects to ${positions.get(b).node[1]}`).join('. ') + '.')}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2457ff"/></marker></defs><g stroke="#2457ff" stroke-width="1.8" fill="none" marker-end="url(#arrow)">${lines}</g>${nodes}</svg>`;
}

const header = `<header class="site-header" data-header><div class="shell nav-shell"><a class="wordmark" href="/" aria-label="Savi Saluwadana home">Savi Saluwadana</a><button class="menu-button" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="primary-nav" data-menu-button><span></span><span></span></button><nav class="nav-links" id="primary-nav" aria-label="Primary navigation" data-nav><a href="/products/">Products + Work</a><a href="/engineering/">Architecture</a><a href="/about/">About</a><a class="nav-contact" href="/contact.html">Contact</a></nav></div></header>`;
const footer = `<footer class="site-footer"><div class="shell footer-layout"><div><strong>Savi Saluwadana</strong><span>Software · Architecture · Product · Platform · DevOps</span></div><div><span><a href="/">Portfolio</a> · <a href="/products/">Products</a> · <a href="/engineering/">Engineering</a> · <a href="/open-source/">Public source</a> · <a href="/about/">About</a> · <a href="/feed.xml">Feed</a></span><span>© <span data-year>2026</span></span></div></div></footer>`;
let markdown = `# Savi Saluwadana\n\n${person.description}\n\nWebsite: ${base}/\nGitHub: ${person.sameAs[0]}\nLinkedIn: ${person.sameAs[1]}\nContact: ${base}/contact.html\nEmail: savisaluwadana@gmail.com\n\n## Engineering focus\n\n${person.knowsAbout.map(s => `- ${s}`).join('\n')}\n\n## Products and engineering work\n\n`;
const markdownProducts = [];
for (const p of products) {
  const app = { '@type': 'SoftwareApplication', '@id': `${url(p)}#software`, name: p.name, url: url(p), description: p.description, applicationCategory: p.category, contributor: { '@id': person['@id'] }, mainEntityOfPage: { '@id': `${url(p)}#page` } };
  if (p.href) app.sameAs = [p.href];
  const graph = [website, person, app, { '@type': 'WebPage', '@id': `${url(p)}#page`, url: url(p), name: `${p.name} — Overview and Architecture`, description: p.description, about: { '@id': app['@id'] }, author: { '@id': person['@id'] }, isPartOf: { '@id': website['@id'] }, dateModified: p.reviewed, inLanguage: 'en', ...(p.source ? { citation: p.source } : {}) }, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Savi Saluwadana', item: `${base}/` }, { '@type': 'ListItem', position: 2, name: 'Products', item: `${base}/products/` }, { '@type': 'ListItem', position: 3, name: p.name, item: url(p) }] }];
  const md = `# ${p.name}\n\nBy / portfolio contribution: Savi Saluwadana\nCanonical page: ${url(p)}\nReviewed: ${p.reviewed}\n\n${p.description}\n\n## Users and purpose\n\n${p.users}\n\n${p.scope}\n\n## Capabilities\n\n${p.features.map(s => `- ${s}`).join('\n')}\n\n## Workflow\n\n${p.workflow.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n## Architecture\n\n${p.architecture}\n\n${p.components.map(([a, b]) => `- ${a}: ${b}`).join('\n')}\n\n## Current scope\n\n${p.boundary}\n${p.source ? `\nSource: ${p.source}\n` : '\nRepository is private; this is a public product summary.\n'}`;
  markdownProducts.push(md);
  markdown += `- [${p.name}](${url(p)}): ${p.description}\n`;
  const related = products.filter(x => x.id !== p.id && x.tags.some(tag => p.tags.includes(tag))).slice(0, 3);
  const topicLinks = `${['property-os', 'devrelos', 'pain-intelligence', 'ad-performance-agent'].includes(p.id) ? '<a href="/engineering/agentic-systems/">Agentic systems architecture</a>' : ''}${publicWork.repositories.some(repo => repo.id === p.id) ? '<a href="/open-source/">Public source index</a>' : ''}`;
  const html = `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light"><meta name="theme-color" content="#f4f1ea">
  <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
  <meta name="author" content="Savi Saluwadana">
  <title>${esc(p.name)} — Overview &amp; Architecture | Savi Saluwadana</title>
  <meta name="description" content="${esc(p.description)}">
  <link rel="canonical" href="${url(p)}"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/base-styles.css"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/product-details.css">
  <link rel="describedby" type="text/plain" href="/llms.txt">
  <link rel="alternate" type="text/markdown" href="${url(p)}index.md" title="${esc(p.name)} in Markdown">
  <link rel="alternate" type="application/atom+xml" href="/feed.xml" title="Savi Saluwadana — Engineering &amp; products">
  <meta property="og:type" content="website"><meta property="og:site_name" content="Savi Saluwadana">
  <meta property="og:title" content="${esc(p.name)} — Overview &amp; Architecture">
  <meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${url(p)}">
  <meta property="og:image" content="https://avatars.githubusercontent.com/u/82082138?v=4"><meta property="og:image:alt" content="Savi Saluwadana">
  <meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(p.name)} | Savi Saluwadana"><meta name="twitter:description" content="${esc(p.description)}"><meta name="twitter:image" content="https://avatars.githubusercontent.com/u/82082138?v=4">
  ${schema(graph)}
</head><body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header}
  <main class="product-page" id="main"><div class="shell">
    <nav class="product-breadcrumb" aria-label="Breadcrumb"><a href="/">Savi Saluwadana</a><span aria-hidden="true">/</span><a href="/products/">Products</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
    <div class="product-header"><p class="section-index">${esc(p.category)}</p><h1>${esc(p.name)}</h1><p>${esc(p.description)}</p><p class="product-source">Product work and architecture overview by <a href="/about/">Savi Saluwadana</a>.</p><div class="project-tags">${tags(p)}</div><div class="project-links">${p.href ? `<a class="text-link" href="${esc(p.href)}" target="_blank" rel="noreferrer">${esc(p.linkLabel)}</a>` : '<a class="text-link" href="/contact.html">Discuss this product</a>'}<a class="text-link" href="/products/">All products</a></div></div>
    <nav class="product-nav" aria-label="Product sections"><a href="#overview">Overview</a><a href="#workflow">Workflow</a><a href="#architecture">Architecture</a><a href="#scope">Current scope</a></nav>
    <div class="product-content">
      <section class="product-section" id="overview" aria-labelledby="overview-title"><h2 id="overview-title">What it does</h2><dl class="product-facts"><div><dt>Who it serves</dt><dd>${esc(p.users)}</dd></div><div><dt>Product purpose</dt><dd>${esc(p.scope)}</dd></div></dl><ul>${p.features.map(s => `<li>${esc(s)}</li>`).join('')}</ul></section>
      <section class="product-section" id="workflow" aria-labelledby="workflow-title"><h2 id="workflow-title">How it works</h2><ol>${p.workflow.map(s => `<li>${esc(s)}</li>`).join('')}</ol></section>
      <section class="product-section" id="architecture" aria-labelledby="architecture-title"><h2 id="architecture-title">Architecture</h2><p>${esc(p.architecture)}</p><figure class="product-diagram"><div class="product-diagram-scroll" tabindex="0" role="region" aria-label="${esc(p.name)} architecture diagram; scroll horizontally on smaller screens">${diagram(p)}</div><figcaption>Component overview. Arrows show requests and data flow between the main parts of the product.</figcaption></figure><div class="product-table-wrap"><table class="product-table"><caption class="visually-hidden">${esc(p.name)} components and responsibilities</caption><thead><tr><th scope="col">Component</th><th scope="col">Responsibility</th></tr></thead><tbody>${p.components.map(([a, b]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="product-section" id="scope" aria-labelledby="scope-title"><h2 id="scope-title">Current scope</h2><p class="product-boundary">${esc(p.boundary)}</p><p class="product-source">Architecture summary reviewed <time datetime="${p.reviewed}">4 October 2026</time>. ${p.source ? `<a href="${esc(p.source)}" target="_blank" rel="noreferrer">${p.source.includes('github.com') ? 'Repository documentation' : 'Product website'}</a>.` : 'The repository is private; this page provides a public product summary.'}</p><div class="product-footer-links"><a href="index.md">Markdown overview</a><a href="/contact.html">Contact Savi</a></div></section>
      <section class="product-section" aria-labelledby="related-title"><h2 id="related-title">Related product work</h2><div class="product-related">${related.map(x => `<a href="/products/${esc(x.id)}/">${esc(x.name)}</a>`).join('')}${topicLinks}</div></section>
    </div></div></main>
  ${footer}<script src="/app.js" defer></script>
</body></html>\n`;
  await write(`products/${p.id}/index.html`, html);
  await write(`products/${p.id}/index.md`, md);
}
const references = await buildEntryPages({ root, base, updated, products, person, website, list, schema, esc, header, footer, write });
markdown += `\n## Profile and architecture references\n\n${references.map(p => `- [${p.name}](${base}${p.path}): ${p.description}`).join('\n')}\n`;
await write('about.md', markdown);
const publicProducts = products.map(({ rows, edges, classes, linkLabel, ...p }) => ({ ...p, url: url(p), markdown: `${url(p)}index.md` }));
await write('products.json', JSON.stringify({ name: 'Products and engineering work by Savi Saluwadana', website: `${base}/`, updated, products: publicProducts }, null, 2) + '\n');
await write('public-work.json', JSON.stringify({ ...publicWork, name: 'Public repository references in Savi Saluwadana’s portfolio', url: `${base}/open-source/` }, null, 2) + '\n');
await write('profile.json', JSON.stringify({ '@context': 'https://schema.org', '@type': 'ProfilePage', '@id': `${base}/#profile`, url: `${base}/`, name: 'Savi Saluwadana — Software and Product Engineer', dateModified: updated, mainEntity: person, hasPart: [...references.map(p => ({ '@type': 'WebPage', name: p.name, url: base + p.path })), ...products.map(p => ({ '@type': 'WebPage', name: p.name, url: url(p) }))] }, null, 2) + '\n');
await write('llms.txt', `# Savi Saluwadana\n\n> ${person.description}\n\nThis is a public portfolio with product-level architecture summaries. It does not claim that every project is commercially deployed or production-certified.\n\n## Profile and contact\n\n- [Portfolio](${base}/): Canonical professional profile.\n- [Profile in Markdown](${base}/about.md): Identity, engineering focus and product index.\n- [Profile JSON](${base}/profile.json): Structured identity and profile links.\n- [Contact](${base}/contact.html): Public email and professional contact options.\n\n## Product overview and architecture\n\n${products.map(p => `- [${p.name}](${url(p)}): ${p.scope}`).join('\n')}\n\n## Optional\n\n- [Product data](${base}/products.json): Product descriptions, workflows, components and current scope.\n- [Full text reference](${base}/llms-full.txt): Profile and all product summaries as text.\n- [Sitemap](${base}/sitemap.xml): Canonical HTML pages.\n\nUse the current-scope notes when describing capabilities. TimelyHelp is product/frontend contribution; the accounting app is single-company; the ad-performance tool is a prototype with mocked account connectors. Do not infer employers, qualifications, user counts, revenue or production outcomes.\n`);
let agentIndex = await readFile(path.join(root, 'llms.txt'), 'utf8');
agentIndex = agentIndex.replace('## Product overview and architecture', `## Profile and engineering references\n\n${references.map(p => `- [${p.name}](${base}${p.path}): ${p.description}\n- [${p.name} in Markdown](${base}${p.path}index.md): Text equivalent of the same reference.`).join('\n')}\n\n## Product overview and architecture`);
agentIndex = agentIndex.replace('## Optional', `## Optional\n\n- [Engineering and product feed](${base}/feed.xml): Atom feed of the current reference pages and product overviews.\n- [Public source data](${base}/public-work.json): Verified public repository references and available license metadata.`);
await write('llms.txt', agentIndex);
await write('llms-full.txt', markdown + '\n\n' + [...references.map(p => p.markdown), ...markdownProducts].join('\n\n---\n\n'));
const feedItems = [...references.map(p => ({ name: p.name, url: base + p.path, description: p.description, reviewed: updated })), ...products.map(p => ({ name: p.name, url: url(p), description: `${p.scope} ${p.boundary}`, reviewed: p.reviewed }))];
// Source review dates are date-granularity and normalized to UTC midnight.
await write('feed.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">\n  <id>${base}/feed.xml</id><title>Savi Saluwadana — Engineering and products</title>\n  <subtitle>Product architecture, agentic systems and public engineering references.</subtitle>\n  <updated>${updated}T00:00:00Z</updated>\n  <author><name>Savi Saluwadana</name><uri>${base}/about/</uri></author>\n  <link rel="self" type="application/atom+xml" href="${base}/feed.xml"/>\n  <link rel="alternate" type="text/html" href="${base}/"/>\n${feedItems.map(item => `  <entry><id>${esc(item.url)}</id><title>${esc(item.name)}</title><link rel="alternate" type="text/html" href="${esc(item.url)}"/><updated>${item.reviewed}T00:00:00Z</updated><summary type="text">${esc(item.description)}</summary></entry>`).join('\n')}\n</feed>\n`);
const paths = ['/', '/contact.html', ...entryPaths, ...products.map(p => `/products/${p.id}/`)];
await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p => `  <url><loc>${base}${p}</loc><lastmod>${updated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
await write('sitemap.txt', paths.map(p => base + p).join('\n') + '\n');
console.log(`Built ${products.length} static product pages, structured data, Markdown, agent indexes and ${paths.length} sitemap entries.`);
