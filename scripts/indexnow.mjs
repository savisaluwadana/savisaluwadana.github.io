// Notify participating search engines only of owner-selected changed canonical pages.
import {readFile} from 'node:fs/promises';
const origin='https://savisaluwadana.github.io';
const key='420e9442a4258c6c352887231110dda58';
const keyLocation=origin+'/'+key+'.txt';
const sitemap=await readFile(new URL('../sitemap.xml',import.meta.url),'utf8');
const allowed=new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]));
const raw=(process.env.INDEXNOW_PATHS||'').split(/[\s,]+/).filter(Boolean);
if(!raw.length)throw Error('Provide changed canonical paths in INDEXNOW_PATHS; no bulk submission by default.');
const urls=[...new Set(raw.map(p=>new URL(p,origin).href))];
if(urls.length>50||urls.some(u=>!allowed.has(u)))throw Error('Use at most 50 exact canonical sitemap URLs.');
if(process.argv.includes('--dry-run')){console.log('Dry run (no network):\n'+urls.join('\n'));process.exit(0);}
const req=async(url,opts={})=>fetch(url,{...opts,redirect:'error',signal:AbortSignal.timeout(20000)});
const verification=await req(keyLocation);
if(!verification.ok||(await verification.text()).trim()!==key)throw Error('Deployed IndexNow key not yet available; do not submit before deployment.');
for(const url of urls){
  const response=await req(url);const html=await response.text();
  if(!response.ok||html.match(/rel="canonical" href="([^"]+)"/)?.[1]!==url||/noindex/i.test(response.headers.get('x-robots-tag')||'')||/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html))throw Error('Live canonical validation failed: '+url);
}
const response=await req('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify({host:new URL(origin).hostname,key,keyLocation,urlList:urls})});
console.log('IndexNow HTTP '+response.status+' for '+urls.length+' changed URL(s)');
if(![200,202].includes(response.status))throw Error('Submission not accepted; inspect status before retrying.');
console.log(response.status===202?'Accepted for key validation; not an indexing confirmation.':'Submission accepted; indexing and ranking are not guaranteed.');
