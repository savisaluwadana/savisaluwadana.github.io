// Local analysis of actual GSC snapshots; no network, no fabricated traffic.
import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {homedir} from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
const base='https://savisaluwadana.github.io/';
const numeric=v=>typeof v==='number'&&Number.isFinite(v);
export function analyze(rows,coverage,canonical){
  const permitted=new Set(canonical),index=new Map((coverage?.records||[]).map(r=>[r.url,r]));
  const actions=[];
  for(const url of canonical){
    const r=index.get(url);
    if(r&&['blocked','canonical-mismatch','review-coverage'].includes(r.status))
      actions.push({priority:0,type:'Index coverage review',page:url,query:null,reason:r.status+': '+(r.coverageState||'Review Google inspection'),impressions:null,position:null,ctr:null});
  }
  const pairs=Array.isArray(rows)?rows:[];
  const valid=pairs.filter(r=>Array.isArray(r.keys)&&r.keys.length===2&&permitted.has(r.keys[1])&&numeric(r.impressions)&&numeric(r.position)&&numeric(r.ctr)&&r.impressions>=20&&r.position>=1);
  for(const r of valid){
    const [query,page]=r.keys;
    if(index.has(page)&&['blocked','canonical-mismatch','review-coverage'].includes(index.get(page).status))continue;
    if(r.position>=4&&r.position<=20)actions.push({priority:1,type:'Content relevance review',page,query,reason:'Review query intent, missing explanation and internal links; average position 4–20.',impressions:r.impressions,position:r.position,ctr:r.ctr});
    else if(r.position<4&&r.ctr<0.02)actions.push({priority:2,type:'Snippet review',page,query,reason:'Average position below 4 and CTR below 2%; inspect real SERP and title. Threshold is a heuristic, not a ranking rule.',impressions:r.impressions,position:r.position,ctr:r.ctr});
  }
  return actions.sort((a,b)=>a.priority-b.priority||(b.impressions??0)-(a.impressions??0)).slice(0,100);
}
if(process.argv.includes('--self-test')){
 const a=base+'about/',b=base+'lab/';
 const test=analyze([{keys:['sample',a],impressions:100,position:8,ctr:.01},{keys:['sample two',b],impressions:200,position:8,ctr:.01},{keys:['tiny',a],impressions:2,position:8,ctr:0}],{records:[{url:b,status:'blocked'}]},[a,b]);
 assert.equal(test.length,2);assert.equal(test[0].type,'Index coverage review');assert.equal(test[1].query,'sample');
 assert.equal(analyze(undefined,undefined,[a]).length,0);
 console.log('Visibility opportunity tests passed');process.exit(0);
}
const dir=path.join(homedir(),'.portfolio-seo');await mkdir(dir,{recursive:true,mode:0o700});
const names=(await readdir(dir)).sort();
const latest=async re=>{const name=names.filter(n=>re.test(n)).at(-1);return name?JSON.parse(await readFile(path.join(dir,name),'utf8')):null;};
const search=await latest(/^search-\d{4}-\d{2}-\d{2}\.json$/),coverage=await latest(/^index-\d{4}-\d{2}-\d{2}\.json$/);
const xml=await readFile(new URL('../sitemap.xml',import.meta.url),'utf8'),canonical=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const rows=search?.google?.status==='ok'?search.google.current?.queryPages:null;
const actions=analyze(rows,coverage,canonical);
const safe=v=>String(v??'Unavailable').replace(/[\r\n|]/g,' ');
const report={generatedAt:new Date().toISOString(),searchSnapshot:search?.createdAt??null,indexSnapshot:coverage?.checkedAt??null,queryPageDataAvailable:Array.isArray(rows),actions};
await writeFile(path.join(dir,'opportunities.json'),JSON.stringify(report,null,2)+'\n',{mode:0o600});
const lines=['# Private SEO action queue','','Google search snapshot: '+safe(report.searchSnapshot),'Index inspection snapshot: '+safe(report.indexSnapshot),'Query-page data: '+(report.queryPageDataAvailable?'Available (may be incomplete)':'Unavailable; collect a new search snapshot.'),'','| Priority | Action | Page | Query | Impressions | Avg position | Reason |','|---|---|---|---|---:|---:|---|',...actions.map(a=>'| '+[a.priority,a.type,a.page,a.query,a.impressions,a.position,a.reason].map(safe).join(' | ')+' |'),'','No actions is not proof of optimal visibility. Review data freshness, omitted query rows and actual search intent. No predicted traffic or ranking uplift is implied.'];
await writeFile(path.join(dir,'opportunities.md'),lines.join('\n')+'\n',{mode:0o600});console.log('Private action queue: '+actions.length+' items. See ~/.portfolio-seo/opportunities.md');
