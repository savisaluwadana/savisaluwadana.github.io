import { writeFile } from 'node:fs/promises';
const base = 'https://savisaluwadana.github.io';
const request = url => fetch(url, {redirect:'follow',signal:AbortSignal.timeout(15000),headers:{'User-Agent':'PortfolioSEOAudit/1.0'}});
const sitemap = await request(base + '/sitemap.xml');
if (!sitemap.ok) throw new Error('Sitemap HTTP ' + sitemap.status);
const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
if (!urls.length || urls.length > 500) throw new Error('Unexpected sitemap size');
const robots = await request(base + '/robots.txt');
const rules = await robots.text();
const results = [];
for (const url of urls) {
  try {
    if (new URL(url).origin !== base) throw new Error('Non-site URL in sitemap');
    const r = await request(url);
    const html = await r.text();
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    const noindex = /<meta[^>]+name="(?:robots|googlebot)"[^>]+content="[^"]*noindex/i.test(html) || /noindex/i.test(r.headers.get('x-robots-tag')||'');
    results.push({url,status:r.status,finalUrl:r.url,canonical,noindex,ok:r.ok&&r.url===url&&canonical===url&&!noindex});
  } catch(e) {results.push({url,ok:false,error:e.message});}
}
const robotsOk = robots.ok && rules.includes(base+'/sitemap.xml') && /User-agent: OAI-SearchBot\s+Allow: \//i.test(rules);
await writeFile('live-seo-audit.json',JSON.stringify({checkedAt:new Date().toISOString(),robotsOk,results},null,2)+'\n');
const failed=results.filter(r=>!r.ok);
console.log('Live canonical checks: '+results.length+'; failed: '+failed.length+'; crawler configuration: '+robotsOk);
for (const r of failed) console.error(r.url+' failed');
if(!robotsOk||failed.length)process.exitCode=1;
