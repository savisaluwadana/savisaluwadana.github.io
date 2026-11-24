import {retryModel,bookingModel,agentModel} from './models.mjs';
const models={retry:retryModel,booking:bookingModel,agent:agentModel};
for(const form of document.querySelectorAll('[data-lab-model]')){
  const output=form.querySelector('[data-lab-output]'),trace=form.querySelector('[data-lab-trace]');
  const run=()=>{
    const values={};
    for(const input of form.querySelectorAll('input,select')){
      if(input.type==='checkbox')values[input.name]=input.checked;
      else if(input.type==='number')values[input.name]=input.valueAsNumber;
      else values[input.name]=input.value;
    }
    try{
      const result=models[form.dataset.labModel](values);
      const lines=Object.entries(result).filter(([key])=>!['trace','checks'].includes(key)).map(([key,value])=>key+': '+(typeof value==='boolean'?(value?'yes':'no'):value));
      output.textContent=lines.join(' · ');
      trace.textContent=result.trace.join('\n');
    }catch(e){output.textContent=e.message;trace.textContent='';}
  };
  form.addEventListener('submit',event=>{event.preventDefault();run()});
  form.addEventListener('change',()=>{if(form.checkValidity())run()});
  run();
}
