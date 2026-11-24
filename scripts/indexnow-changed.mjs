// Only submit canonical HTML files changed by the current push, after deployment.
import {readFile} from 'node:fs/promises';
import {execFileSync,spawnSync} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
const origin='https://savisaluwadana.github.io';
const sitemap=await readFile(new URL('../sitemap.xml',import.meta.url),'utf8');
const canonical=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const routeFile=u=>{const p=new URL(u).pathname;return p.slice(1)+(p.endsWith('/')?'index.html':'');};
const byFile=new Map(canonical.map(u=>[routeFile(u),u]));
const before=process.env.PUSH_BEFORE,after=process.env.PUSH_AFTER;
if(!/^[a-f0-9]{40}$/.test(before||'')||! /[a-f0-9]{40}/.test(after||'')||/^0+$/.test(before))throw Error('A valid previous and current commit is required; use manual submission for first deployment.');
const changed=execFileSync('git',['diff','--name-only','--diff-filter=AM','-z',before,after],{encoding:'utf8'}).split('\0').filter(Boolean);
const urls=[...new Set(changed.filter(p=>byFile.has(p)).map(p=>byFile.get(p)))];
if(!urls.length){console.log('No changed canonical HTML; no submission.');process.exit(0);}
if(urls.length>50)throw Error('More than 50 changed pages; use manual batches.');
if(process.argv.includes('--dry-run')){console.log('Changed canonical URLs (dry run):\n'+urls.join('\n'));process.exit(0);}
const normalize=s=>s.replace(/\r\n/g,'\n').trimEnd();
const expected=new Map(await Promise.all(urls.map(async u=>[u,normalize(await readFile(routeFile(u),'utf8'))])));
const pending=new Set(urls);
const fetchCurrent=async url=>{
  const response=await fetch(url,{cache:'no-store',redirect:'error',signal:AbortSignal.timeout(12000),headers:{'Cache-Control':'no-cache'}});
  if(!response.ok)throw Error('HTTP '+response.status);
  return normalize(await response.text());
};
// Bound the deployment wait; don't send stale pages or continuously resubmit.
for(let attempt=1;attempt<=18&&pending.size;attempt++){
  await Promise.all([...pending].map(async url=>{try{if(await fetchCurrent(url)===expected.get(url))pending.delete(url);}catch{}}));
  console.log('Deployment check '+attempt+': '+(urls.length-pending.size)+'/'+urls.length+' match committed HTML');
  if(pending.size&&attempt<18)await sleep(15000);
}
if(pending.size)throw Error('Deployment not verified for '+[...pending].join(', ')+'; use manual notification after checking Pages.');
const result=spawnSync(process.execPath,['scripts/indexnow.mjs'],{stdio:'inherit',env:{...process.env,INDEXNOW_PATHS:urls.join(' ')}});
if(result.error)throw result.error;
process.exitCode=result.status??1;
