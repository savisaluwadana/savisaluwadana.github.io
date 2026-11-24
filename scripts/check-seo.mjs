// Dependency-free metadata audit; length recommendations are not ranking rules.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://savisaluwadana.github.io';
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const decode = s => s.replace(/&(?:amp|quot|apos|lt|gt|#39);/g, m => ({'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&#39;':"'"})[m]);
const warnings = [], errors = [], pages = [];
for (const url of urls) {
  const u = new URL(url);
  if (u.origin !== origin) { errors.push('External sitemap URL: ' + url); continue; }
  const route = u.pathname;
  const file = route.slice(1) + (route.endsWith('/') ? 'index.html' : '');
  const html = await readFile(path.join(root, file), 'utf8');
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] || '');
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '');
  const warn = msg => warnings.push(route + ': ' + msg);
  if (!title || !description) errors.push(route + ': missing title or description');
  if (title.length > 60) warn('title exceeds 60 characters (' + title.length + ')');
  if (description.length > 155) warn('description exceeds 155 characters (' + description.length + ')');
  if (!/<meta name="viewport"/i.test(html)) errors.push(route + ': missing mobile viewport');
  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt\s*=/i.test(image[0])) warn('image missing alt attribute');
  }
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) {
    if (!html.includes('property="' + property + '"')) warn('missing ' + property);
  }
  const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1];
  if (ogUrl && ogUrl !== url) errors.push(route + ': Open Graph URL differs from canonical');
  pages.push({ url, title, titleLength: title.length, description, descriptionLength: description.length });
}
for (const warning of warnings) console.warn('WARN ' + warning);
for (const error of errors) console.error('ERROR ' + error);
console.log('SEO audit: ' + pages.length + ' pages, ' + warnings.length + ' warnings, ' + errors.length + ' errors');
if (process.argv.includes('--json')) await writeFile(path.join(root, 'seo-audit.json'), JSON.stringify({ pages, warnings, errors }, null, 2) + '\n');
if (errors.length) process.exitCode = 1;
