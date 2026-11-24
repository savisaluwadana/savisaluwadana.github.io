// Pure deterministic teaching models, not production service implementations.
function bounded(value,min,max,name){
  if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(name+' outside allowed range');
  return value;
}
export function retryModel({requests=5,retries=2,deduplicate=true}={}){
  bounded(requests,1,20,'requests');bounded(retries,0,5,'retries');
  const seen=new Set(),trace=[];let effects=0,duplicates=0;
  for(let attempt=0;attempt<=retries;attempt++)for(let id=1;id<=requests;id++){
    if(seen.has(id)&&deduplicate){duplicates++;trace.push('Request '+id+' / attempt '+(attempt+1)+': replay suppressed');}
    else{seen.add(id);effects++;trace.push('Request '+id+' / attempt '+(attempt+1)+': side effect applied');}
  }
  return {deliveries:requests*(retries+1),effects,duplicates,invariant:effects===requests,trace};
}
export function bookingModel({capacity=3,contenders=8,serialized=true}={}){
  bounded(capacity,1,10,'capacity');bounded(contenders,1,30,'contenders');
  // Race scenario: every contender reads the same original available count before writing.
  const accepted=serialized?Math.min(capacity,contenders):contenders;
  const trace=Array.from({length:contenders},(_,i)=>'Request '+(i+1)+': '+(i<accepted?'accepted':'rejected: full'));
  return {accepted,rejected:contenders-accepted,remaining:capacity-accepted,oversold:Math.max(0,accepted-capacity),invariant:accepted<=capacity,trace};
}
export function agentModel({role='viewer',action='read',sameTenant=true,approved=false}={}){
  if(!['viewer','operator','admin'].includes(role)||!['read','write','transfer'].includes(action))throw new RangeError('Unknown role or action');
  const roleAllowed=action==='read'||(action==='write'&&role!=='viewer')||(action==='transfer'&&role==='admin');
  const approvalAllowed=action!=='transfer'||approved;
  const checks=[['Tenant boundary',sameTenant],['Role permission',roleAllowed],['Human approval',approvalAllowed]];
  return {allowed:checks.every(x=>x[1]),checks,trace:checks.map(([name,pass])=>name+': '+(pass?'pass':'deny'))};
}
