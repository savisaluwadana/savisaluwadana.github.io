import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Keep reference content separate from templates and derive the directory from
// the same product records used by the homepage and individual product pages.
export async function buildEntryPages({ root, base, updated, schemaModified, products, person, website, list, schema, esc, header, footer, write }) {
  const content = JSON.parse(await readFile(path.join(root, 'data/discovery.json'), 'utf8'));
  const publicWork = JSON.parse(await readFile(path.join(root, 'data/public-work.json'), 'utf8'));
  const productById = new Map(products.map(p => [p.id, p]));
  const groupedIds = content.groups.flatMap(g => g.products);
  if (new Set(groupedIds).size !== products.length || groupedIds.length !== products.length || groupedIds.some(id => !productById.has(id))) {
    throw new Error('The product directory must classify every product exactly once.');
  }
  for (const repo of publicWork.repositories) {
    const product = productById.get(repo.id);
    if (repo.visibility !== 'public' || !product || !product.source?.startsWith(repo.url + '/blob/')) {
      throw new Error(`Unverified public source: ${repo.id}`);
    }
  }
  const repositoryTable = { type: 'table', headers: ['Project and source', 'What to inspect', 'License metadata'], rows: publicWork.repositories.map(repo => {
    const product = productById.get(repo.id);
    const license = repo.license && repo.license.spdxId !== 'NOASSERTION' ? `${repo.license.name} (${repo.license.spdxId})` : 'License not identified by GitHub metadata. Review repository terms before reuse.';
    return [`[${product.name}](${repo.url}) · [Architecture overview](/products/${product.id}/)`, `${product.scope} ${product.architecture}`, license];
  }) };
  const inline = text => {
    const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let html = '', cursor = 0;
    for (const match of text.matchAll(pattern)) {
      const target = new URL(match[2], base);
      if (target.protocol !== 'https:') throw new Error(`Invalid reference URL: ${match[2]}`);
      html += esc(text.slice(cursor, match.index));
      html += `<a href="${esc(match[2])}">${esc(match[1])}</a>`;
      cursor = match.index + match[0].length;
    }
    return html + esc(text.slice(cursor));
  };
  const markdown = text => text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `[${label}](${new URL(href, base).href})`);
  const blockHtml = block => {
    if (block.type === 'public-repositories') return blockHtml(repositoryTable);
    if (block.type === 'product-workflow') {
      const product = productById.get(block.product);
      if (!product) throw new Error(`Unknown workflow product: ${block.product}`);
      return `<ol>${product.workflow.map(step => `<li>${esc(step)}</li>`).join('')}</ol>`;
    }
    if (block.type === 'p') return `<p>${inline(block.text)}</p>`;
    if (block.type === 'qa') return `<h3>${esc(block.question)}</h3><p>${inline(block.answer)}</p>`;
    if (block.type === 'list') return `<ul>${block.items.map(item => `<li>${inline(item)}</li>`).join('')}</ul>`;
    if (block.type === 'table') return `<div class="product-table-wrap"><table class="product-table"><thead><tr>${block.headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${inline(cell)}</th>` : `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    throw new Error(`Unknown reference block: ${block.type}`);
  };
  const blockMarkdown = block => {
    if (block.type === 'public-repositories') return blockMarkdown(repositoryTable);
    if (block.type === 'product-workflow') {
      const product = productById.get(block.product);
      if (!product) throw new Error(`Unknown workflow product: ${block.product}`);
      return product.workflow.map((step, i) => `${i + 1}. ${step}`).join('\n');
    }
    if (block.type === 'p') return markdown(block.text);
    if (block.type === 'qa') return `### ${block.question}\n\n${markdown(block.answer)}`;
    if (block.type === 'list') return block.items.map(item => `- ${markdown(item)}`).join('\n');
    if (block.type === 'table') return `| ${block.headers.join(' | ')} |\n| ${block.headers.map(() => '---').join(' | ')} |\n${block.rows.map(row => `| ${row.map(markdown).join(' | ')} |`).join('\n')}`;
    throw new Error(`Unknown reference block: ${block.type}`);
  };
  const directory = {
    path: '/products/', title: 'Product Directory & Architecture | Savi Saluwadana',
    heading: 'Products & engineering work.', label: 'Directory / Products & architecture',
    description: 'Explore 16 products built or contributed to by Savi Saluwadana: marketplaces, business systems, healthcare, AI agents and developer tools, with architecture diagrams.',
    intro: 'Browse the product work by domain. Every product has a permanent overview with its users, workflow, component architecture, source references and current scope.',
    sections: content.groups.map(group => ({
      id: group.id, title: group.title,
      blocks: [{ type: 'p', text: group.description }, { type: 'table', headers: ['Product', 'Purpose and architecture'], rows: group.products.map(id => {
        const p = productById.get(id);
        return [`[${p.name}](/products/${p.id}/)`, `${p.scope} ${p.architecture}`];
      }) }]
    })).concat({ id: 'scope', title: 'Read each product in context', blocks: [
      { type: 'p', text: 'This directory covers products I’ve built and worked on, including development projects, a self-hosted beta, prototypes and frontend contributions. A listed product is not a claim that every capability is commercially deployed. Each product page states the documented boundary.' },
      { type: 'p', text: 'Read the [architecture reference](/engineering/) to compare agent permissions, desktop data, tenant isolation and transaction workflows. Visit [About Savi](/about/) for engineering focus and public profile links.' }
    ] })
  };
  const pages = [directory, ...content.pages];
  const references = [];
  for (const page of pages) {
    const canonical = base + page.path;
    const isProfile = page.path === '/about/';
    const isDirectory = page.path === '/products/';
    const isSource = page.path === '/open-source/';
    const pageName = page.name || (isProfile ? 'About Savi Saluwadana' : isDirectory ? 'Product directory' : 'Architecture reference');
    const breadcrumbName = page.breadcrumb || (isProfile ? 'About' : isDirectory ? 'Products' : 'Engineering');
    const crumbs = [{ name: 'Savi Saluwadana', item: `${base}/` }];
    if (page.path.startsWith('/engineering/') && page.path !== '/engineering/') crumbs.push({ name: 'Engineering', item: `${base}/engineering/` });
    crumbs.push({ name: breadcrumbName, item: canonical });
    const pageNode = { '@type': isProfile ? 'ProfilePage' : isDirectory || isSource ? 'CollectionPage' : 'WebPage', '@id': `${canonical}#page`, url: canonical, name: page.title, description: page.description, isPartOf: { '@id': website['@id'] }, dateModified: schemaModified, inLanguage: 'en' };
    const graph = [website, person, pageNode, { '@type': 'BreadcrumbList', itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })) }];
    if (isProfile) pageNode.mainEntity = { '@id': person['@id'] };
    else if (isDirectory) { pageNode.mainEntity = { '@id': list['@id'] }; graph.push(list); }
    else if (isSource) {
      const sources = publicWork.repositories.map(repo => ({ '@type': 'SoftwareSourceCode', '@id': `${repo.url}#source-code`, name: productById.get(repo.id).name, url: repo.url, codeRepository: repo.url, description: productById.get(repo.id).scope, contributor: { '@id': person['@id'] } }));
      const sourceList = { '@type': 'ItemList', '@id': `${canonical}#repositories`, name: 'Public engineering repositories in Savi Saluwadana’s portfolio', itemListElement: sources.map((source, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@id': source['@id'] } })) };
      pageNode.mainEntity = { '@id': sourceList['@id'] };
      graph.push(sourceList, ...sources);
    }
    else {
      const citations = page.sections.flatMap(s => s.blocks.filter(b => b.type === 'list').flatMap(b => b.items)).map(s => s.match(/\]\((https:[^)]+)\)/)?.[1]).filter(Boolean);
      pageNode.mainEntity = { '@id': `${canonical}#reference` };
      graph.push({ '@type': 'CreativeWork', '@id': `${canonical}#reference`, name: page.heading, url: canonical, description: page.description, author: { '@id': person['@id'] }, inLanguage: 'en', dateModified: schemaModified, citation: citations });
    }
    const md = `# ${page.heading}\n\n${page.intro}\n\nBy: Savi Saluwadana\nCanonical page: ${canonical}\nReviewed: ${updated}\n\n${page.sections.map(section => `## ${section.title}\n\n${section.blocks.map(blockMarkdown).join('\n\n')}`).join('\n\n')}\n`;
    references.push({ path: page.path, name: pageName, description: page.description, markdown: md });
    await write(page.path.slice(1) + 'index.md', md);
    await write(page.path.slice(1) + 'index.html', `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light"><meta name="theme-color" content="#f4f1ea">
  <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
  <meta name="author" content="Savi Saluwadana">
  <title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}">
  <link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/base-styles.css"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/product-details.css">
  <link rel="describedby" type="text/plain" href="/llms.txt"><link rel="alternate" type="text/markdown" href="${canonical}index.md" title="${esc(page.heading)} in Markdown">
  <link rel="alternate" type="application/atom+xml" href="/feed.xml" title="Savi Saluwadana — Engineering &amp; products">
${isSource ? '  <link rel="alternate" type="application/json" href="/public-work.json" title="Public repository references">' : ''}
  <meta property="og:type" content="website"><meta property="og:site_name" content="Savi Saluwadana">
  <meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://avatars.githubusercontent.com/u/82082138?v=4"><meta property="og:image:alt" content="Savi Saluwadana">
  <meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(page.title)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="https://avatars.githubusercontent.com/u/82082138?v=4">
  ${schema(graph)}
</head><body>
  <a class="skip-link" href="#main">Skip to content</a>${header}
  <main class="product-page" id="main"><div class="shell">
    <nav class="product-breadcrumb" aria-label="Breadcrumb">${crumbs.map((crumb, i) => `${i ? '<span aria-hidden="true">/</span>' : ''}${i === crumbs.length - 1 ? `<span aria-current="page">${esc(crumb.name)}</span>` : `<a href="${esc(new URL(crumb.item).pathname)}">${esc(crumb.name)}</a>`}`).join('')}</nav>
    <div class="product-header"><p class="section-index">${esc(page.label)}</p><h1>${esc(page.heading)}</h1><p>${esc(page.intro)}</p><p class="product-source">${isProfile ? 'Software &amp; product engineer · Sri Lanka' : 'By Savi Saluwadana'} · Reviewed <time datetime="${updated}">4 October 2026</time></p><div class="project-links"><a class="text-link" href="/contact.html">Contact Savi</a><a class="text-link" href="${page.path}index.md">Markdown reference</a></div></div>
    <nav class="product-nav" aria-label="Page sections">${page.sections.map(section => `<a href="#${esc(section.id)}">${esc(section.title)}</a>`).join('')}</nav>
    <div class="product-content">${page.sections.map(section => `<section class="product-section" id="${esc(section.id)}" aria-labelledby="${esc(section.id)}-title"><h2 id="${esc(section.id)}-title">${esc(section.title)}</h2>${section.blocks.map(blockHtml).join('')}</section>`).join('\n')}</div>
  </div></main>${footer}<script src="/app.js" defer></script>
</body></html>\n`);
  }
  return references;
}
