import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
const base = 'http://127.0.0.1:8765';
const routes = ['/', '/about/', '/products/', '/engineering/', '/insights/', '/products/property-os/', '/insights/mcp-permission-boundaries/', '/contact.html'];
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
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
      const scan = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
      results.push({route, viewport, status:response?.status(), overflow, errors, violations:scan.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.length}))});
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
