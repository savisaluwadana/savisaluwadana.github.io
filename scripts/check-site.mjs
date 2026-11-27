import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://savisaluwadana.github.io';
const products = JSON.parse(await readFile(path.join(root, 'data/products.json'), 'utf8'));
const person = JSON.parse(await readFile(path.join(root, 'data/profile.json'), 'utf8'));
for (const url of ['https://dev.to/savi_saluwadana','https://medium.com/@savisaluwadana','https://daily.dev/savisaluwadana']) assert.ok(person.sameAs.includes(url), 'Missing canonical writing profile: '+url);
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Duplicate sitemap URLs');
const discovery = JSON.parse(await readFile(path.join(root, 'data/discovery.json'), 'utf8'));
const coreEntryPaths = ['/products/', ...discovery.pages.map(p => p.path)];
const insightPaths = ["/insights/","/insights/mcp-permission-boundaries/","/insights/durable-agentic-workflows/","/insights/go-modular-monolith-saas/","/insights/platform-engineering-paved-road/","/insights/postgres-multitenancy-boundaries/","/insights/offline-first-sync/","/insights/concurrent-booking/","/insights/ai-agent-harness-architecture/","/insights/bounded-agent-loop/","/insights/agent-evaluation-observability/"];
const entryPaths = [...coreEntryPaths, ...insightPaths];
const industryIds = discovery.groups.flatMap(group => group.products);
assert.equal(industryIds.length, products.length, 'Every product must be classified by industry');
assert.equal(new Set(industryIds).size, products.length, 'Industry categories must not duplicate projects');
assert.ok(industryIds.every(id => products.some(p => p.id === id)), 'Industry categories contain an unknown product');
assert.equal(sitemapUrls.length, products.length + 2 + entryPaths.length, 'All canonical pages must appear in sitemap');
const pages = ['index.html', 'contact.html', ...entryPaths.map(p => p.slice(1) + 'index.html'), ...products.map(p => `products/${p.id}/index.html`)];
const cache = new Map(await Promise.all(pages.map(async f => [f, await readFile(path.join(root, f), 'utf8')])));
const titles = new Set();
const descriptions = new Set();
const inbound = new Set();
const adjacency = new Map();
let links = 0;
for (const [file, html] of cache) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate element IDs`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${file}: one primary heading required`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${file}: missing/duplicate title`);
  titles.add(title);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const expectedCanonical = `${origin}/${file.replace(/index\.html$/, '')}`;
  assert.equal(canonical, expectedCanonical, `${file}: canonical does not match page URL`);
  assert.ok(sitemapUrls.includes(canonical), `${file}: canonical missing from sitemap`);
  assert.ok(!/<meta[^>]+content="[^"]*noindex/.test(html), `${file}: page blocks indexing`);
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(description && !descriptions.has(description), `${file}: missing/duplicate description`);
  descriptions.add(description);
  assert.ok(html.includes('rel="alternate" type="application/atom+xml" href="/feed.xml"'), `${file}: missing feed discovery link`);
  const outgoing = new Set();
  adjacency.set(file, outgoing);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(schemas.length, `${file}: missing structured data`);
  for (const m of schemas) {
    const graph = JSON.parse(m[1])['@graph'];
    assert.ok(Array.isArray(graph), `${file}: invalid schema graph`);
    for (const node of graph.filter(node => node.dateModified !== undefined)) {
      assert.equal(typeof node.dateModified, 'string', `${file}: dateModified must be a string`);
      assert.match(node.dateModified, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/, `${file}: dateModified must be an ISO-8601 DateTime with timezone`);
    }
    const identity = graph.find(node => node['@type'] === 'Person');
    assert.deepEqual(identity, person, `${file}: inconsistent professional identity`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    const target = new URL(href, canonical);
    if (target.origin !== origin) continue;
    const pathname = decodeURIComponent(target.pathname);
    const local = pathname.endsWith('/') ? pathname.slice(1) + 'index.html' : pathname.slice(1);
    const absolute = path.resolve(root, local);
    assert.ok(absolute.startsWith(root + path.sep), `${file}: path escapes site root`);
    assert.ok((await stat(absolute)).isFile(), `${file}: broken link ${href}`);
    if (local !== file && local.endsWith('.html')) { inbound.add(local); outgoing.add(local); }
    if (target.hash && local.endsWith('.html')) {
      const destination = cache.get(local) || await readFile(absolute, 'utf8');
      assert.ok(destination.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${file}: broken fragment ${href}`);
    }
    links++;
  }
}
const reachable = new Set(['index.html']);
const queue = ['index.html'];
for (let i = 0; i < queue.length; i++) {
  for (const next of adjacency.get(queue[i]) || []) {
    if (!reachable.has(next)) { reachable.add(next); queue.push(next); }
  }
}
for (const file of pages.filter(p => p !== 'index.html')) {
  assert.ok(inbound.has(file), `${file}: no crawlable incoming HTML link`);
  assert.ok(reachable.has(file), `${file}: not reachable from homepage links`);
}
const home = cache.get('index.html');
const stack = home.match(/<div class="stack-explorer"[\s\S]*?<p class="stack-scope">[^<]*<\/p><\/div>/)?.[0];
assert.ok(stack, 'Homepage requires a static interactive stack');
assert.deepEqual([...stack.matchAll(/data-stack-layer="([^"]+)"/g)].map(m=>m[1]), ['experience','application','infrastructure'], 'All three layers must remain in the initial HTML');
assert.equal([...stack.matchAll(/<summary>/g)].length,3,'Each layer needs a native disclosure');
assert.ok(home.includes('id="portfolio-overview"'), 'Missing answer-oriented portfolio summary');
const featuredGrid = home.match(/<section class="section editorial-selected"[\s\S]*?<\/section>/)?.[0];
assert.ok(featuredGrid, 'Missing selected project grid');
assert.ok(!/Design concept|Research direction|<h3>Relay<\/h3>|<h3>Systems Lab<\/h3>/.test(featuredGrid), 'Unbuilt concepts must not be presented as selected projects');
for (const id of ['avara', 'pain-intelligence']) assert.ok(featuredGrid.includes(`href="/products/${id}/"`), `Missing selected project: ${id}`);
for (const p of products) {
  const html = cache.get(`products/${p.id}/index.html`);
  assert.ok(html.includes('<svg ') && html.includes('<table '), `${p.id}: missing accessible architecture`);
  assert.ok(html.includes(p.boundary.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')), `${p.id}: missing current-scope note`);
  assert.ok(sitemapUrls.includes(`${origin}/products/${p.id}/`), `${p.id}: not in sitemap`);
  for (const url of [p.href, p.source].filter(Boolean)) assert.ok(url.startsWith('https://'), `${p.id}: non-HTTPS public link`);
}
const directory = cache.get('products/index.html');
for (const p of products) assert.ok(directory.includes(`href="/products/${p.id}/"`), `${p.id}: missing directory link`);
for (const route of entryPaths) {
  if (coreEntryPaths.includes(route)) assert.ok(home.includes(`href="${route}"`), `${route}: missing homepage entry point`);
  const md = await readFile(path.join(root, route.slice(1), 'index.md'), 'utf8');
  assert.ok(md.includes(`${origin}${route}`), `${route}: Markdown canonical missing`);
  assert.ok((await readFile(path.join(root, 'llms.txt'), 'utf8')).includes(`${origin}${route}`), `${route}: missing from agent discovery index`);
}
for (const route of ['/projects/saelior/', '/projects/eventmesh/']) {
  assert.ok(featuredGrid.includes('href="' + route + '"'), 'Missing featured project profile: ' + route);
  assert.ok(directory.includes('href="' + route + '"'), 'Missing project directory link: ' + route);
  assert.ok(cache.get('about/index.html').includes('href="' + route + '"'), 'Missing biography project link: ' + route);
  const project = cache.get(route.slice(1) + 'index.html');
  assert.ok(project.includes('id="status"') && project.includes('id="architecture"'), 'Project profile requires scope and architecture: ' + route);
}
assert.ok(cache.get('about/index.html').includes('profile-card-grid'), 'Biography requires responsive interest cards');
const lab = cache.get('lab/index.html');
assert.ok(lab.includes('data-lab-model="retry"') && lab.includes('data-lab-model="booking"') && lab.includes('data-lab-model="agent"'), 'Missing interactive engineering models');
assert.ok(lab.includes('not production benchmarks'), 'Teaching model scope must remain explicit');
const articleReferences = JSON.parse(await readFile(path.join(root,'data/article-references.json'),'utf8'));
const fullReference = await readFile(path.join(root, 'llms-full.txt'), 'utf8');
for (const route of insightPaths.filter(p => p !== '/insights/')) {
  const articleHtml = cache.get(route.slice(1) + 'index.html');
  const articleMd = await readFile(path.join(root, route.slice(1), 'index.md'), 'utf8');
  assert.ok(fullReference.includes(articleMd), route + ': full reference must contain the complete article');
  assert.ok(articleHtml.includes('id="practical-verification"') && articleHtml.includes('aria-label="Article contents"'), route + ': practical answer and article contents required');
  assert.ok(articleHtml.includes('By <a href="/about/">Savi Saluwadana</a>'), route + ': author profile link missing');
  const article = JSON.parse(articleHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'].find(n=>n['@type']==='Article');
  const refs = articleReferences[route.split('/').filter(Boolean).at(-1)];
  assert.ok(refs?.length, route + ': primary technical references required');
  for (const [, url] of refs) {
    assert.ok(articleHtml.includes('href="'+url+'"') && articleMd.includes(url), route + ': missing visible technical reference');
    assert.ok(article.citation.includes(url), route + ': technical citation missing from article schema');
  }
  assert.equal(article.author['@id'],person['@id'],route + ': article author identity mismatch');
  assert.equal(article.author.url,origin+'/about/',route + ': article author URL missing');
  assert.ok(articleHtml.includes('property="article:modified_time" content="'+article.dateModified+'"'),route + ': social and structured modification dates differ');
  assert.ok(articleHtml.includes('datetime="'+article.dateModified.slice(0,10)+'"'),route + ': visible update date missing');
}
const topicClusters = JSON.parse(await readFile(path.join(root,'data/topic-links.json'),'utf8'));
for (const [id, links] of Object.entries(topicClusters)) {
  const page = cache.get('products/' + id + '/index.html');
  assert.ok(page?.includes('id="technical-reading"'), id + ': contextual engineering links missing');
  for (const [target] of links) assert.ok(page.includes('href="' + target + '"'), id + ': missing topic link ' + target);
}
const aboutGraph = JSON.parse(cache.get('about/index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
assert.equal(aboutGraph.find(n => n['@type'] === 'ProfilePage').mainEntity['@id'], person['@id'], 'About page must identify the canonical Person');
const engineeringGraph = JSON.parse(cache.get('engineering/index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
assert.equal(engineeringGraph.find(n => ['CreativeWork', 'Article'].includes(n['@type'])).author['@id'], person['@id'], 'Architecture reference must identify its author');
const publicWork = JSON.parse(await readFile(path.join(root, 'data/public-work.json'), 'utf8'));
const publicData = JSON.parse(await readFile(path.join(root, 'public-work.json'), 'utf8'));
assert.deepEqual(publicData.repositories, publicWork.repositories, 'Public source data must match verified records');
const sourceGraph = JSON.parse(cache.get('open-source/index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
assert.equal(sourceGraph.filter(n => n['@type'] === 'SoftwareSourceCode').length, publicWork.repositories.length, 'Source schema must cover every public repository');
for (const repo of publicWork.repositories) {
  assert.equal(repo.visibility, 'public', `${repo.id}: private repository in public source index`);
  assert.ok(repo.url.startsWith('https://github.com/'), `${repo.id}: invalid repository URL`);
  assert.ok(cache.get('open-source/index.html').includes(`href="${repo.url}"`), `${repo.id}: missing visible repository reference`);
  assert.ok(sourceGraph.some(n => n['@type'] === 'SoftwareSourceCode' && n.codeRepository === repo.url), `${repo.id}: missing source schema`);
}
const feed = await readFile(path.join(root, 'feed.xml'), 'utf8');
assert.ok(feed.includes('xmlns="http://www.w3.org/2005/Atom"'), 'Feed must use the Atom namespace');
assert.ok(feed.includes('<author><name>Savi Saluwadana</name>'), 'Feed must name its author');
const entries = [...feed.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m => m[1]);
const feedUrls = entries.map(entry => entry.match(/<id>(.*?)<\/id>/)?.[1]);
assert.equal(new Set(feedUrls).size, feedUrls.length, 'Duplicate feed entries');
assert.deepEqual([...feedUrls].sort(), sitemapUrls.filter(url => ![`${origin}/`, `${origin}/contact.html`].includes(url)).sort(), 'Feed must cover the reference and product pages');
for (const entry of entries) {
  assert.ok(/<title>[^<]+<\/title>/.test(entry), 'Feed entry requires a title');
  assert.ok(/<updated>\d{4}-\d{2}-\d{2}T00:00:00Z<\/updated>/.test(entry), 'Feed entry requires a source review date');
  assert.ok(/<summary type="text">[\s\S]+?<\/summary>/.test(entry), 'Feed entry requires a summary');
}
const selected = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'].find(node => node['@type'] === 'ItemList');
assert.deepEqual(selected.itemListElement.map(item => new URL(item.url).pathname), ['/products/advance-hris/', '/products/freshpick/', '/products/property-os/']);
for (const item of selected.itemListElement) assert.ok(home.includes(`href="${new URL(item.url).pathname}"`) && home.includes(item.description), 'Featured work must match the static HTML');
assert.ok(!(await readFile(path.join(root, 'app.js'), 'utf8')).includes('insertAdjacentHTML'), 'Product content should not be injected at runtime');
assert.equal(await readFile(path.join(root, 'google062719a40465c49b.html'), 'utf8'), 'google-site-verification: google062719a40465c49b.html\n', 'Search Console verification changed');
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
assert.ok(/User-agent: \*\s+Allow: \//.test(robots), 'Crawlers should have access to public content');
assert.ok(robots.includes(`${origin}/sitemap.xml`), 'robots.txt must advertise XML sitemap');
assert.match(robots, /User-agent: OAI-SearchBot\s+Allow: \//i, 'Search crawler access must remain available');
for (const filename of ['profile.json', 'products.json', 'site.webmanifest']) JSON.parse(await readFile(path.join(root, filename), 'utf8'));
const profile = JSON.parse(await readFile(path.join(root, 'profile.json'), 'utf8'));
assert.deepEqual(profile.mainEntity, person, 'Agent profile must match HTML identity');
assert.deepEqual(profile.hasPart.map(p=>p.url).sort(), sitemapUrls.filter(u=>u!==origin+'/'&&u!==origin+'/contact.html').sort(), 'Machine-readable profile must enumerate every public content page');
const data = JSON.parse(await readFile(path.join(root, 'products.json'), 'utf8'));
assert.equal(data.products.length, products.length, 'Agent product data must match homepage');
assert.deepEqual((await readFile(path.join(root, 'sitemap.txt'), 'utf8')).trim().split('\n'), sitemapUrls, 'XML and text sitemap disagree');
console.log(`Passed: ${pages.length} crawl-reachable pages, ${products.length} product detail pages, ${links} internal references, ${publicWork.repositories.length} public sources, ${entries.length} feed entries, unique metadata, JSON-LD, accessible diagrams, agent data and sitemap consistency.`);
