import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const escape = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export async function applySeoMetadata(root, routes) {
  const metadata = JSON.parse(await readFile(path.join(root, 'data/seo-metadata.json'), 'utf8'));
  for (const [route, [title, description]] of Object.entries(metadata)) {
    if (!routes.includes(route)) throw new Error('Unknown SEO route: ' + route);
    if (!title || title.length > 60 || !description || description.length > 155) throw new Error('Invalid SEO metadata: ' + route);
    const file = path.join(root, route.slice(1) + (route.endsWith('/') ? 'index.html' : ''));
    const html = await readFile(file, 'utf8');
    const end = html.indexOf('</head>');
    if (end < 0) throw new Error('No head: ' + route);
    const head = html.slice(0, end)
      .replace(/<title>[\s\S]*?<\/title>/, '<title>' + escape(title) + '</title>')
      .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*/g, (_, p) => p + escape(description))
      .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*/g, (_, p) => p + escape(title));
    await writeFile(file, head + html.slice(end));
  }
}
