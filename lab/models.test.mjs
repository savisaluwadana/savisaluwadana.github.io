import {test} from 'node:test';
import assert from 'node:assert/strict';
import {retryModel,bookingModel,agentModel} from './models.mjs';
test('deduplicated retries preserve one effect per request',()=>{
  for(let requests=1;requests<=20;requests++)for(let retries=0;retries<=5;retries++){
    const r=retryModel({requests,retries,deduplicate:true});
    assert.equal(r.effects,requests);assert.equal(r.duplicates,requests*retries);assert.ok(r.invariant);
  }
});
test('unprotected replay exposes duplicate effects',()=>{
  const r=retryModel({requests:5,retries:2,deduplicate:false});assert.equal(r.effects,15);assert.equal(r.invariant,false);
});
test('serialized reservations never exceed capacity',()=>{
  for(let capacity=1;capacity<=10;capacity++)for(let contenders=1;contenders<=30;contenders++){
    const r=bookingModel({capacity,contenders,serialized:true});
    assert.equal(r.accepted,Math.min(capacity,contenders));assert.equal(r.oversold,0);assert.ok(r.invariant);
  }
});
test('simultaneous stale reads can oversell',()=>{
  const r=bookingModel({capacity:3,contenders:8,serialized:false});assert.equal(r.oversold,5);assert.equal(r.invariant,false);
});
test('all role, action, tenant and approval combinations enforce policy',()=>{
  for(const role of ['viewer','operator','admin'])for(const action of ['read','write','transfer'])for(const sameTenant of [true,false])for(const approved of [true,false]){
    const expected=sameTenant&&(action==='read'||(action==='write'&&role!=='viewer')||(action==='transfer'&&role==='admin'&&approved));
    assert.equal(agentModel({role,action,sameTenant,approved}).allowed,expected);
  }
});
test('invalid parameters are rejected',()=>{
  assert.throws(()=>retryModel({requests:0}),RangeError);assert.throws(()=>bookingModel({capacity:11}),RangeError);assert.throws(()=>agentModel({role:'unknown'}),RangeError);
});
