import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';
const base = 'http://127.0.0.1:8765';
const sample = ['/', '/about/', '/products/', '/engineering/', '/insights/', '/products/property-os/', '/insights/mcp-permission-boundaries/', '/contact.html', '/lab/'];
const sitemap = await readFile(new URL('../../sitemap.xml',import.meta.url),'utf8');
const all = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const routes = process.env.GITHUB_EVENT_NAME==='schedule' || process.env.GITHUB_EVENT_NAME==='workflow_dispatch' || process.argv.includes('--all') ? all : sample;
const browser = await chromium.launch({headless: true});
const results = [];
try {
  for (const viewport of [{width:390,height:844},{width:1440,height:900}]) {
    const context = await browser.newContext({viewport});
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const response = await page.goto(base + route, {waitUntil:'domcontentloaded'});
      await page.locator('h1').first().waitFor();
      if(route==='/'){
        const stack=page.locator('svg.hero-topology');
        if(await stack.count()!==1||!await stack.isVisible())throw new Error('Expected a single visible SVG architecture');
        const geometry=await stack.evaluate(svg=>{
          const bounds=svg.getBoundingClientRect(), layers=[...svg.querySelectorAll('[data-stack-layer]')];
          return {bounds:{left:bounds.left,right:bounds.right}, rows:layers.map(g=>{const r=g.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}}), labels:[...svg.querySelectorAll('.hero-layer-title,.hero-layer-sub')].map(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}})};
        });
        const {bounds,rows,labels}=geometry;
        if(rows.length!==3||labels.length!==6||rows.some((r,i)=>i>0&&r.top<rows[i-1].bottom-1)||labels.some(r=>r.left<bounds.left||r.right>bounds.right)||bounds.left<0||bounds.right>viewport.width+1)throw new Error('SVG architecture layers overlap or labels are clipped');
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
      const scan = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
      results.push({route, viewport, status:response?.status(), overflow, errors, violations:scan.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.length,targets:v.nodes.slice(0,5).map(n=>n.target)}))});
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile('browser-audit.json', JSON.stringify(results,null,2)+'\n');
}
console.log('Browser audit: ' + results.length + ' page/viewport checks');
const failures = results.filter(r=>r.status!==200||r.errors.length);
const warnings = results.filter(r=>r.overflow||r.violations.length);
console.log('Navigation/runtime failures: '+failures.length+'; accessibility/layout warnings: '+warnings.length);
if(failures.length) process.exitCode=1;
