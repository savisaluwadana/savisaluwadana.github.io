// Local/private only. No credentials or search analytics are sent to GitHub.
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
const site = 'https://savisaluwadana.github.io/';
const out = path.join(homedir(), '.portfolio-seo');
const stamp = new Date().toISOString().slice(0,10);
const googleToken = process.env.GSC_ACCESS_TOKEN;
const bingKey = process.env.BING_WEBMASTER_API_KEY;
const date = offset => new Date(Date.now()-offset*86400000).toISOString().slice(0,10);
const windows = {current:{startDate:date(30),endDate:date(3)},previous:{startDate:date(58),endDate:date(31)}};
const report = {site,createdAt:new Date().toISOString(),google:{status:'not configured'},bing:{status:'not configured'}};
const request = async (url,options={},label='API') => {
  try {
    const response = await fetch(url,{...options,signal:AbortSignal.timeout(30000),redirect:'error'});
    if(!response.ok)throw new Error(label+' HTTP '+response.status);
    return await response.json();
  } catch(e) { if(/^API |^Google |^Bing /.test(e.message)) throw e; throw new Error(label+' request failed'); }
};
const gsc = async (range,dimensions) => {
  const url = 'https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(site)+'/searchAnalytics/query';
  const body = { ...range,dimensions,type:'web',dataState:'final',rowLimit:dimensions.length===2?1000:dimensions.length?250:1 };
  const response = await request(url,{method:'POST',headers:{Authorization:'Bearer '+googleToken,'Content-Type':'application/json'},body:JSON.stringify(body)},'Google');
  return response.rows||[];
};
const bing = async method => {
  const u = new URL('https://ssl.bing.com/webmaster/api.svc/json/'+method);
  u.searchParams.set('siteUrl',site);u.searchParams.set('apikey',bingKey);
  const response = await request(u,{},'Bing');
  return response.d ?? response;
};
let failed=false;
if(googleToken){
  try{
    const results={};
    for(const [name,range] of Object.entries(windows)){
      results[name]={range,total:(await gsc(range,[]))[0]??null,queries:await gsc(range,['query']),pages:await gsc(range,['page']),queryPages:await gsc(range,['query','page'])};
    }
    report.google={status:'ok',...results,limitation:'Top 250 rows for single dimensions and up to 1000 query-page pairs; totals queried independently. Privacy filtering and row limits can omit data. Finalized web search data only.'};
  } catch(e){report.google={status:'error',error:e.message};failed=true;}
}
if(bingKey){
  try {report.bing={status:'ok',queries:await bing('GetQueryStats'),traffic:await bing('GetRankAndTrafficStats'),limitation:'Provider-defined reporting window; not directly comparable to Google periods.'};}
  catch(e){report.bing={status:'error',error:e.message};failed=true;}
}
if(!googleToken&&!bingKey){console.error('Set GSC_ACCESS_TOKEN or BING_WEBMASTER_API_KEY locally; no report written.');process.exit(2);}
await mkdir(out,{recursive:true,mode:0o700});
const reportFile=path.join(out,'search-'+stamp+'.json');
await writeFile(reportFile,JSON.stringify(report,null,2)+'\n',{mode:0o600});
const metric=(v,k)=>v?.[k]??'Unavailable';
const lines=['# Private search performance report','Generated '+stamp,'','Google: '+report.google.status,'Bing: '+report.bing.status,''];
if(report.google.status==='ok'){
  const a=report.google.current.total,b=report.google.previous.total;
  lines.push('## Google Search (two equal 28-day periods)','| Metric | Current | Previous |','| --- | ---: | ---: |');
  for(const k of ['clicks','impressions','ctr','position'])lines.push('| '+k+' | '+metric(a,k)+' | '+metric(b,k)+' |');
  lines.push('','CTR is a fraction. Average position is an impression-weighted metric; lower is generally better.','', '## Query opportunities (positions 8–20, sorted by impressions)');
  const safe=s=>String(s).replace(/[\r\n|]/g,' ');
  for(const row of report.google.current.queries.filter(r=>r.position>=8&&r.position<=20).sort((a,b)=>b.impressions-a.impressions).slice(0,15))lines.push('- '+safe(row.keys[0])+': '+row.impressions+' impressions, position '+row.position.toFixed(1));
}
lines.push('','See the private JSON snapshot for provider rows. Missing data is not zero. Do not publish these files.');
await writeFile(path.join(out,'search-'+stamp+'.md'),lines.join('\n')+'\n',{mode:0o600});
console.log('Private reports saved to '+out+'; Google: '+report.google.status+'; Bing: '+report.bing.status);
if(failed)process.exitCode=1;
