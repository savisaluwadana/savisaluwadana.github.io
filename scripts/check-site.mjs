import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://savisaluwadana.github.io';
const products = JSON.parse(await readFile(path.join(root, 'data/products.json'), 'utf8'));
const person = JSON.parse(await readFile(path.join(root, 'data/profile.json'), 'utf8'));
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Duplicate sitemap URLs');
assert.equal(sitemapUrls.length, products.length + 2, 'All product pages must appear in sitemap');
const pages = ['index.html', 'contact.html', ...products.map(p => `products/${p.id}/index.html`)];
const cache = new Map(await Promise.all(pages.map(async f => [f, await readFile(path.join(root, f), 'utf8')])));
const titles = new Set();
let links = 0;
for (const [file, html] of cache) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate element IDs`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${file}: one primary heading required`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${file}: missing/duplicate title`);
  titles.add(title);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(sitemapUrls.includes(canonical), `${file}: canonical missing from sitemap`);
  assert.ok(!/<meta[^>]+content="[^"]*noindex/.test(html), `${file}: page blocks indexing`);
  assert.ok(/<meta name="description" content="[^"]+"/.test(html), `${file}: missing description`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(schemas.length, `${file}: missing structured data`);
  for (const m of schemas) {
    const graph = JSON.parse(m[1])['@graph'];
    assert.ok(Array.isArray(graph), `${file}: invalid schema graph`);
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
    if (target.hash && local.endsWith('.html')) {
      const destination = cache.get(local) || await readFile(absolute, 'utf8');
      assert.ok(destination.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${file}: broken fragment ${href}`);
    }
    links++;
  }
}
const home = cache.get('index.html');
for (const p of products) {
  assert.ok(home.includes(`id="${p.id}"`), `Product ${p.id} is not in static HTML`);
  assert.ok(home.includes(`href="/products/${p.id}/"`), `Missing product detail link: ${p.id}`);
  const html = cache.get(`products/${p.id}/index.html`);
  assert.ok(html.includes('<svg ') && html.includes('<table '), `${p.id}: missing accessible architecture`);
  assert.ok(html.includes(p.boundary.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')), `${p.id}: missing current-scope note`);
  assert.ok(sitemapUrls.includes(`${origin}/products/${p.id}/`), `${p.id}: not in sitemap`);
  for (const url of [p.href, p.source].filter(Boolean)) assert.ok(url.startsWith('https://'), `${p.id}: non-HTTPS public link`);
}
assert.ok(home.includes('id="tech-stack"'), 'Technology stack must be crawlable without JavaScript');
assert.ok(!(await readFile(path.join(root, 'app.js'), 'utf8')).includes('insertAdjacentHTML'), 'Product content should not be injected at runtime');
assert.equal(await readFile(path.join(root, 'google062719a40465c49b.html'), 'utf8'), 'google-site-verification: google062719a40465c49b.html\n', 'Search Console verification changed');
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
assert.ok(/User-agent: \*\s+Allow: \//.test(robots), 'Crawlers should have access to public content');
assert.ok(robots.includes(`${origin}/sitemap.xml`), 'robots.txt must advertise XML sitemap');
for (const filename of ['profile.json', 'products.json', 'site.webmanifest']) JSON.parse(await readFile(path.join(root, filename), 'utf8'));
const profile = JSON.parse(await readFile(path.join(root, 'profile.json'), 'utf8'));
assert.deepEqual(profile.mainEntity, person, 'Agent profile must match HTML identity');
const data = JSON.parse(await readFile(path.join(root, 'products.json'), 'utf8'));
assert.equal(data.products.length, products.length, 'Agent product data must match homepage');
assert.deepEqual((await readFile(path.join(root, 'sitemap.txt'), 'utf8')).trim().split('\n'), sitemapUrls, 'XML and text sitemap disagree');
console.log(`Passed: ${pages.length} pages, ${products.length} static product cards, ${links} internal references, JSON-LD, accessible diagrams, agent data and sitemap consistency.`);
