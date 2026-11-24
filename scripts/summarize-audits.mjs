import { readFile, readdir, appendFile } from 'node:fs/promises';
const mode=process.argv[2];
const read=async f=>JSON.parse(await readFile(f,'utf8'));
const lines=['## '+mode+' audit',''];
const safe=s=>String(s??'Unavailable').replace(/[\r\n|]/g,' ');
try {
  if(mode==='seo'){
    const r=await read('seo-audit.json');
    lines.push('Pages: **'+r.pages.length+'** · Warnings: **'+r.warnings.length+'** · Errors: **'+r.errors.length+'**');
    for(const x of [...r.errors,...r.warnings].slice(0,30))lines.push('- '+safe(x));
  }else if(mode==='live'){
    const r=await read('live-seo-audit.json');
    lines.push('URLs: **'+r.results.length+'** · Failed: **'+r.results.filter(x=>!x.ok).length+'** · Crawler rules: **'+r.robotsOk+'**');
    for(const x of r.results.filter(x=>!x.ok))lines.push('- '+safe(x.url)+': '+safe(x.error||x.status));
  }else if(mode==='browser'){
    const r=await read('browser-audit.json');
    lines.push('Page/viewport checks: **'+r.length+'**','', '| Route | Width | HTTP | Overflow | Runtime errors | Axe violations |','|---|---:|---:|---|---:|---:|');
    for(const x of r)lines.push('| '+safe(x.route)+' | '+x.viewport.width+' | '+safe(x.status)+' | '+x.overflow+' | '+x.errors.length+' | '+x.violations.length+' |');
    const counts={};for(const x of r)for(const v of x.violations)counts[v.id]=(counts[v.id]||0)+1;
    lines.push('','Violation occurrences by rule:');
    for(const [id,n] of Object.entries(counts))lines.push('- '+safe(id)+': '+n);
  }else if(mode==='lighthouse'){
    const dir='.lighthouseci';
    const files=(await readdir(dir)).filter(f=>/^lhr-.*\.json$/.test(f));
    const rows=await Promise.all(files.map(f=>read(dir+'/'+f)));
    const score=(r,k)=>r.categories?.[k]?.score==null?'Unavailable':Math.round(r.categories[k].score*100);
    lines.push('Lab runs: **'+rows.length+'** (individual runs; not field Core Web Vitals).','','| Route | Performance | Accessibility | SEO | LCP (ms) | CLS |','|---|---:|---:|---:|---:|---:|');
    for(const r of rows)lines.push('| '+safe(new URL(r.finalDisplayedUrl||r.finalUrl||r.requestedUrl).pathname)+' | '+score(r,'performance')+' | '+score(r,'accessibility')+' | '+score(r,'seo')+' | '+Math.round(r.audits?.['largest-contentful-paint']?.numericValue??0)+' | '+(r.audits?.['cumulative-layout-shift']?.numericValue?.toFixed(3)??'Unavailable')+' |');
    if(!rows.length)lines.push('No Lighthouse measurements produced.');
  }else throw Error('Unknown audit type');
}catch(e){lines.push('Report unavailable: '+safe(e.message));}
const output=lines.join('\n')+'\n';
if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,output);
else console.log(output);
