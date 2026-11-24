import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
const prompts=JSON.parse(await readFile(new URL('../data/ai-visibility-prompts.json',import.meta.url),'utf8'));
const dir=path.join(homedir(),'.portfolio-seo');
await mkdir(dir,{recursive:true,mode:0o700});
const quote=s=>'"'+String(s).replaceAll('"','""')+'"';
const date=new Date().toISOString().slice(0,10);
const rows=[['date','provider','prompt','expected_path','mentioned_yes_no','cited_yes_no','cited_url','facts_accurate_yes_no','notes']];
for(const provider of ['ChatGPT Search','Google AI Mode','Bing Copilot','Perplexity'])for(const p of prompts)rows.push([date,provider,p.prompt,p.target,'','','','','']);
const file=path.join(dir,'ai-visibility-'+date+'.csv');
try{await writeFile(file,rows.map(r=>r.map(quote).join(',')).join('\n')+'\n',{flag:'wx',mode:0o600});console.log('Created '+file);}
catch(e){if(e.code==='EEXIST')console.log('Existing log preserved: '+file);else throw e;}
