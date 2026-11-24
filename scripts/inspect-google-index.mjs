// Private Search Console index coverage report; read-only, never requests indexing.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {homedir} from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
const site='https://savisaluwadana.github.io/';
function classify(r,url){
  if(!r||!r.verdict)return 'unknown';
  if(r.googleCanonical&&r.googleCanonical!==url)return 'canonical-mismatch';
  if(r.robotsTxtState==='DISALLOWED'||r.indexingState==='BLOCKED_BY_META_TAG'||r.indexingState==='BLOCKED_BY_HTTP_HEADER'||r.indexingState==='BLOCKED_BY_ROBOTS_TXT')return 'blocked';
  return r.verdict==='PASS'?'indexed-pass':r.verdict==='FAIL'||r.verdict==='NEUTRAL'?'review-coverage':'unknown';
}
if(process.argv.includes('--self-test')){
  assert.equal(classify({verdict:'PASS',googleCanonical:site},site),'indexed-pass');
  assert.equal(classify({verdict:'PASS',googleCanonical:site+'about/'},site),'canonical-mismatch');
  assert.equal(classify({verdict:'FAIL',robotsTxtState:'DISALLOWED'},site),'blocked');
  assert.equal(classify({verdict:'NEUTRAL'},site),'review-coverage');
  assert.equal(classify({},site),'unknown');
  console.log('Index classification tests passed');process.exit(0);
}
const xml=await readFile(new URL('../sitemap.xml',import.meta.url),'utf8');
const all=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const priority=['','about/','products/','engineering/','engineering/agentic-systems/','insights/','lab/','projects/saelior/','projects/eventmesh/'].map(p=>site+p);
const urls=[...new Set([...priority.filter(u=>all.includes(u)),...all])];
if(urls.length>100||urls.some(u=>new URL(u).origin!==new URL(site).origin))throw Error('Invalid sitemap');
if(process.argv.includes('--dry-run')){console.log('Inspection targets (no API calls): '+urls.length+'\n'+urls.join('\n'));process.exit(0);}
const token=process.env.GSC_ACCESS_TOKEN;
if(!token)throw Error('Set GSC_ACCESS_TOKEN locally using your verified Search Console account.');
const records=[];
for(const url of urls){
 try{
  const res=await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({inspectionUrl:url,siteUrl:site,languageCode:'en-US'}),redirect:'error',signal:AbortSignal.timeout(20000)});
  if(!res.ok){records.push({url,status:'api-error',http:res.status});if([401,403,429].includes(res.status))break;continue;}
  const data=(await res.json()).inspectionResult;
  const r=data?.indexStatusResult;
  records.push({url,status:classify(r,url),verdict:r?.verdict,coverageState:r?.coverageState,robotsTxtState:r?.robotsTxtState,indexingState:r?.indexingState,pageFetchState:r?.pageFetchState,lastCrawlTime:r?.lastCrawlTime,googleCanonical:r?.googleCanonical,userCanonical:r?.userCanonical,inspectionResultLink:data?.inspectionResultLink});
 }catch{records.push({url,status:'api-error',error:'Inspection request failed'});}
}
const counts={};for(const r of records)counts[r.status]=(counts[r.status]||0)+1;
const report={site,checkedAt:new Date().toISOString(),targetCount:urls.length,inspected:records.length,notAttempted:urls.length-records.length,counts,records,limitation:'Google indexed version only; not a live URL test, ranking measurement or indexing request.'};
const dir=path.join(homedir(),'.portfolio-seo');await mkdir(dir,{recursive:true,mode:0o700});
const date=new Date().toISOString().slice(0,10);
await writeFile(path.join(dir,'index-'+date+'.json'),JSON.stringify(report,null,2)+'\n',{mode:0o600});
const safe=s=>String(s??'Unavailable').replace(/[\r\n|]/g,' ');
const lines=['# Private Google index coverage','Checked '+report.checkedAt,'','Targets: '+urls.length+'; attempted: '+records.length+'; not attempted: '+report.notAttempted,'','| URL | Status | Google coverage | Last crawl | Google canonical |','|---|---|---|---|---|',...records.map(r=>'| '+[r.url,r.status,r.coverageState,r.lastCrawlTime,r.googleCanonical].map(safe).join(' | ')+' |'),'','Review canonical mismatches and blocked or unknown coverage in Search Console. API errors and unattempted pages are not evidence of non-indexation.'];
await writeFile(path.join(dir,'index-'+date+'.md'),lines.join('\n')+'\n',{mode:0o600});
console.log('Private index report saved: '+records.length+'/'+urls.length+' attempted; '+JSON.stringify(counts));
if(records.some(r=>r.status==='api-error')||report.notAttempted)process.exitCode=1;
