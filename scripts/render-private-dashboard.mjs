// Render private, offline HTML from actual local snapshots. Never upload it.
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
const esc = v => String(v ?? 'Unavailable').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = v => typeof v==='number' && Number.isFinite(v) ? v : null;
const fmt = (v,k) => number(v)===null ? 'Unavailable' : k==='ctr' ? (v*100).toFixed(2)+'%' : k==='position' ? v.toFixed(2) : v.toLocaleString('en-US');
const row = cells => '<tr>'+cells.map(c=>'<td>'+esc(c)+'</td>').join('')+'</tr>';
const table = (headers,rows) => '<div class="scroll"><table><thead><tr>'+headers.map(h=>'<th scope="col">'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row).join('')+'</tbody></table></div>';
function csv(text){
  const rows=[];let current=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(ch==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
    else if(ch===','&&!quoted){current.push(cell);cell='';}
    else if(ch==='\n'&&!quoted){current.push(cell);rows.push(current);current=[];cell='';}
    else if(ch!=='\r'||quoted)cell+=ch;
  }
  if(quoted)throw Error('Unclosed CSV quote');
  if(cell||current.length){current.push(cell);rows.push(current);}
  const headers=rows.shift()||[];
  return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}
function visibility(rows){
  const groups=new Map();
  const yes=v=>String(v).trim().toLowerCase()==='yes';
  const answered=v=>['yes','no'].includes(String(v).trim().toLowerCase());
  for(const r of rows){
    const p=r.provider||'Unknown';
    if(!groups.has(p))groups.set(p,{total:0,completed:0,mentioned:0,cited:0,accurate:0,accuracyChecked:0});
    const g=groups.get(p);g.total++;
    if(answered(r.mentioned_yes_no)&&answered(r.cited_yes_no)){g.completed++;if(yes(r.mentioned_yes_no))g.mentioned++;if(yes(r.cited_yes_no))g.cited++;}
    if(answered(r.facts_accurate_yes_no)){g.accuracyChecked++;if(yes(r.facts_accurate_yes_no))g.accurate++;}
  }
  return [...groups].map(([p,g])=>[p,g.completed+' / '+g.total,g.completed?g.mentioned+' / '+g.completed:'Not tested',g.completed?g.cited+' / '+g.completed:'Not tested',g.accuracyChecked?g.accurate+' / '+g.accuracyChecked:'Not assessed']);
}
function render(snapshots,ai,warnings){
  const valid=snapshots.filter(r=>r.google?.status==='ok');
  const latest=valid.at(-1);
  const last=snapshots.at(-1);
  const current=latest?.google?.current;
  const previous=latest?.google?.previous;
  const cards=['clicks','impressions','ctr','position'].map(k=>'<div class="card"><small>'+esc(k)+'</small><strong>'+esc(fmt(current?.total?.[k],k))+'</strong><small>Previous: '+esc(fmt(previous?.total?.[k],k))+'</small></div>').join('');
  const history=valid.map(r=>[r.createdAt?.slice(0,10),r.google.current.range?.startDate,r.google.current.range?.endDate,...['clicks','impressions','ctr','position'].map(k=>fmt(r.google.current.total?.[k],k))]);
  const queries=(current?.queries||[]).filter(r=>number(r.position)!==null&&r.position>=8&&r.position<=20).sort((a,b)=>b.impressions-a.impressions).slice(0,20).map(r=>[r.keys?.[0],fmt(r.impressions),fmt(r.clicks),fmt(r.ctr,'ctr'),fmt(r.position,'position')]);
  const pages=(current?.pages||[]).slice(0,25).map(r=>[r.keys?.[0],fmt(r.clicks),fmt(r.impressions),fmt(r.ctr,'ctr'),fmt(r.position,'position')]);
  const lastAI=ai.at(-1);
  return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Private portfolio search dashboard</title><style>body{font:15px system-ui,sans-serif;max-width:1150px;margin:40px auto;padding:0 20px;background:#111;color:#eee}h1{font-size:28px}h2{margin-top:32px}p,small{color:#bbb}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.card{border:1px solid #444;padding:18px;border-radius:10px;display:grid;gap:8px}.card strong{font-size:26px}.scroll{overflow:auto}table{width:100%;border-collapse:collapse}th,td{padding:10px;text-align:left;border-bottom:1px solid #444;overflow-wrap:anywhere}th{color:#ddd}.warning{color:#ffcf87}code{overflow-wrap:anywhere}</style><main><h1>Private portfolio search dashboard</h1><p>Local data only. Never publish this file or its source snapshots. Missing results are not zero.</p><p>Latest collection: '+esc(last?.createdAt)+' · Google: '+esc(last?.google?.status)+' · Bing: '+esc(last?.bing?.status)+'</p><h2>Google Search performance</h2><p>Last successful snapshot: '+esc(latest?.createdAt)+' · '+esc(current?.range?.startDate)+' to '+esc(current?.range?.endDate)+'</p><div class="grid">'+cards+'</div><h2>Historical snapshots</h2><p>Overlapping rolling 28-day windows, not additive totals.</p>'+table(['Collected','From','To','Clicks','Impressions','CTR','Avg position'],history)+'<h2>Query opportunities</h2><p>Top available queries at average positions 8–20; not exact live rankings.</p>'+table(['Query','Impressions','Clicks','CTR','Position'],queries)+'<h2>Top available pages</h2>'+table(['Page','Clicks','Impressions','CTR','Position'],pages)+'<h2>AI visibility — manual benchmarks</h2><p>Latest log: '+esc(lastAI?.name)+'; unfinished tests are excluded from rates. Results vary by provider and session.</p>'+table(['Provider','Completed','Mentioned','Cited','Accurate'],visibility(lastAI?.rows||[]))+'<h2>Bing data</h2><p>Provider reporting window differs from Google. See the private JSON snapshot for raw provider rows; do not combine these totals.</p>'+(warnings.length?'<h2>Read warnings</h2><ul class="warning">'+warnings.map(w=>'<li>'+esc(w)+'</li>').join('')+'</ul>':'')+'</main></html>';
}
if(process.argv.includes('--self-test')){
  assert.equal(csv('a,b\n"x,y","a""b"\n')[0].b,'a"b');
  assert.deepEqual(visibility([{provider:'Test',mentioned_yes_no:'',cited_yes_no:''}])[0],['Test','0 / 1','Not tested','Not tested','Not assessed']);
  const html=render([{createdAt:'<script>',google:{status:'ok',current:{total:{clicks:0,ctr:0},queries:[],pages:[]},previous:{total:{clicks:2}}}}],[],[]);
  assert.ok(html.includes('&lt;script&gt;')&&!html.includes('<script>'));assert.ok(html.includes('0.00%'));console.log('Private dashboard self-test passed');
}else{
  const dir=path.join(homedir(),'.portfolio-seo');
  await mkdir(dir,{recursive:true,mode:0o700});
  const names=(await readdir(dir)).sort();
  const snapshots=[],ai=[],warnings=[];
  for(const name of names){
    try{
      if(/^search-\d{4}-\d{2}-\d{2}\.json$/.test(name))snapshots.push(JSON.parse(await readFile(path.join(dir,name),'utf8')));
      if(/^ai-visibility-\d{4}-\d{2}-\d{2}\.csv$/.test(name))ai.push({name,rows:csv(await readFile(path.join(dir,name),'utf8'))});
    }catch{warnings.push('Could not read '+name);}
  }
  const output=path.join(dir,'dashboard.html');
  await writeFile(output,render(snapshots,ai,warnings),{mode:0o600});
  console.log('Private offline dashboard: '+output+'; snapshots: '+snapshots.length+'; AI logs: '+ai.length);
}
