// Measure static HTML discovery only. This is not a crawler/indexation/ranking metric.
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='https://savisaluwadana.github.io/';
export function analyze(routes,edges,bodyEdges){
 const graph=new Map(routes.map(r=>[r,new Set(edges.get(r)||[])]));
 const distances=new Map([['/',0]]),queue=['/'];
 for(let i=0;i<queue.length;i++)for(const to of graph.get(queue[i])||[]){
   if(graph.has(to)&&!distances.has(to)){distances.set(to,distances.get(queue[i])+1);queue.push(to);}
 }
 return routes.map(route=>({route,depth:distances.get(route)??null,inbound:[...graph].filter(([from,tos])=>from!==route&&tos.has(route)).length,contextualInbound:[...bodyEdges].filter(([from,tos])=>from!==route&&tos.has(route)).length})).sort((a,b)=>(b.depth??Infinity)-(a.depth??Infinity)||a.contextualInbound-b.contextualInbound||a.route.localeCompare(b.route));
}
if(process.argv.includes('--self-test')){
 const routes=['/','/a/','/b/','/orphan/'],g=new Map([['/',new Set(['/a/'])],['/a/',new Set(['/b/'])]]);
 const rows=analyze(routes,g,g);assert.equal(rows.find(x=>x.route==='/b/').depth,2);assert.equal(rows.find(x=>x.route==='/orphan/').depth,null);assert.equal(rows.find(x=>x.route==='/a/').contextualInbound,1);console.log('Discovery graph tests passed');process.exit(0);
}
const xml=await readFile(new URL('../sitemap.xml',import.meta.url),'utf8');
const routes=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const allowed=new Set(routes);
function links(html,route){
 const found=new Set();
 for(const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)){
   try{const u=new URL(m[1].replaceAll('&amp;','&'),new URL(route,base));if(u.origin===new URL(base).origin&&allowed.has(u.pathname)&&u.pathname!==route)found.add(u.pathname);}catch{}
 }
 return found;
}
const graph=new Map(),bodyGraph=new Map();
for(const route of routes){
 const html=await readFile(new URL('..'+route+(route.endsWith('/')?'index.html':''),import.meta.url),'utf8');
 graph.set(route,links(html,route));
 const main=html.match(/<main\b[\s\S]*?<\/main>/i)?.[0]||'';
 bodyGraph.set(route,links(main.replace(/<nav\b[\s\S]*?<\/nav>/gi,''),route));
}
const rows=analyze(routes,graph,bodyGraph);
const warnings=rows.filter(r=>r.route!=='/'&&(r.depth===null||r.depth>3||r.contextualInbound===0));
const summary={pages:rows.length,unreachable:rows.filter(r=>r.depth===null).length,maxDepth:Math.max(...rows.filter(r=>r.depth!==null).map(r=>r.depth)),noContextualInbound:rows.filter(r=>r.route!=='/'&&r.contextualInbound===0).length};
const output={summary,warnings,rows,limitation:'Static links and shortest click depth only; no external backlinks, indexing or search impressions measured.'};
await writeFile('discovery-audit.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(summary));
const md=['## Static discovery graph','','Canonical pages: '+summary.pages+' · Max depth: '+summary.maxDepth+' · Unreachable: '+summary.unreachable+' · No contextual inbound links: '+summary.noContextualInbound,'','| Route | Click depth | Inbound pages | Contextual inbound pages |','|---|---:|---:|---:|',...rows.map(r=>'| '+r.route+' | '+(r.depth??'unreachable')+' | '+r.inbound+' | '+r.contextualInbound+' |'),'','This is static site navigation, not Google index coverage.'].join('\n')+'\n';
if(process.env.GITHUB_STEP_SUMMARY){const {appendFile}=await import('node:fs/promises');await appendFile(process.env.GITHUB_STEP_SUMMARY,md);}
if(summary.unreachable)process.exitCode=1;
