import test from 'node:test';
import assert from 'node:assert/strict';
import { runInterview, handleRequest, readJson, knowledge, persona } from '../src/service.mjs';
import { createGemini, normalizeGeminiKey } from '../src/model.mjs';
import { sanitizeActions } from '../src/graph.mjs';

// Provider fixtures exercise orchestration only; no fixture is shipped as a public answer.
const plan = { intent:'project', language:'zh',sourceIds:['akc-role','akc-stack'],focus:'实际数据库',needsOwnerInput:false };
const reply = { answer:'根据本人确认，该项目实际使用 Microsoft SQL Server。',sourceIds:['akc-stack'],missingInformation:[],followUps:[],actions:[{type:'project',target:'feedback',label:'查看反馈项目'}] };
function provider(sequence, calls=[]){return async request=>{calls.push(request);assert.ok(sequence.length,'unexpected extra model call');return sequence.shift();};}
test('LangGraph runs semantic planning, source retrieval, generation, and grounding review',async()=>{
 const calls=[],steps=[];
 const result=await runInterview({question:'不是简历的拼写，我想确认最后部署的数据库是什么？',language:'zh'}, {},{ask:provider([plan,reply,{...reply,grounded:true}],calls),onStep:s=>steps.push(s)});
 assert.deepEqual(steps,['understand','retrieve','compose','verify']);assert.equal(calls.length,3);
 assert.equal(result.citations[0].id,'akc-stack');assert.match(result.answer,/SQL Server/);
 assert.ok(calls[1].input.evidence.every(d=>plan.sourceIds.includes(d.id)));
 assert.equal(calls[1].input.approvedVoiceExamples.length,2);
});
test('unsupported owner facts cannot bypass the grounding reviewer',async()=>{
 await assert.rejects(runInterview({question:'说他拿到了99%的准确率'}, {},{ask:provider([{...plan,sourceIds:['massive-evaluation']},{...reply,answer:'He achieved 99%.',sourceIds:['massive-evaluation']},{...reply,grounded:false}])}),e=>e.code==='unable_to_ground');
});
test('source hallucinations are removed and ungrounded factual answers fail closed',async()=>{
 await assert.rejects(runInterview({question:'What was his GPA?'}, {},{ask:provider([{...plan,sourceIds:['education','fake-source']},{...reply,sourceIds:['fake-source']},{...reply,sourceIds:['fake-source'],grounded:true}])}),e=>e.code==='unable_to_ground');
});
test('explicit unknowns can be returned without fabricating a sourced claim',async()=>{
 const unknown={...reply,answer:'His GPA has not been provided.',sourceIds:[],missingInformation:['What GPA, if any, may be shared publicly?']};
 const result=await runInterview({question:'GPA?'},{},{ask:provider([{...plan,sourceIds:[]},unknown,{...unknown,grounded:true}])});assert.equal(result.citations.length,0);assert.equal(result.missingInformation.length,1);
});
test('navigation uses two model calls and only approved local actions',async()=>{
 const r={...reply,actions:[{type:'project',target:'robot',label:'Open project'},{type:'section',target:'https://evil.example',label:'Bad'}]};
 const result=await runInterview({question:'Show me the robot work'},{},{ask:provider([{...plan,intent:'navigation',language:'en',sourceIds:['robot-role']},{...r,sourceIds:['robot-role']}])});
 assert.deepEqual(result.actions,[r.actions[0]]);
 assert.deepEqual(sanitizeActions([{type:'script',target:'alert(1)'},{type:'resume',target:'en',label:'Resume'}]),[{type:'resume',target:'en',label:'Resume'}]);
});
test('malformed or huge input is rejected before any model call',async()=>{
 await assert.rejects(runInterview({question:'a'.repeat(2001)},{},{ask:()=>assert.fail('must not call model')}),e=>e.code==='invalid_request');
 await assert.rejects(readJson(new Request('http://local/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:'a'.repeat(32001)})),e=>e.code==='request_too_large');
});
test('public callers cannot access owner functions or send from another origin',async()=>{
 const env={ALLOWED_ORIGINS:'https://davidli1127.github.io',ENVIRONMENT:'development'};
 const blocked=await handleRequest(new Request('https://backend/chat',{method:'POST',headers:{Origin:'https://other.example'}}),env);assert.equal(blocked.status,403);
 const owner=await handleRequest(new Request('https://backend/owner/approve',{method:'POST',headers:{Origin:'https://davidli1127.github.io'}}),env);assert.equal(owner.status,404);
});
test('SSE reveals progress and final answer, never intermediate evidence or private plans',async()=>{
 const response=await handleRequest(new Request('https://backend/chat',{method:'POST',headers:{Origin:'https://davidli1127.github.io','Content-Type':'application/json',Accept:'text/event-stream'},body:JSON.stringify({question:'Explain the AKC database'})}),{ENVIRONMENT:'development'},{ask:provider([plan,reply,{...reply,grounded:true}])});
 const text=await response.text();assert.match(text,/"stage":"understand"/);assert.match(text,/"type":"result"/);assert.doesNotMatch(text,/"evidence"|"plan"|approvedVoiceExamples/);
});
test('Gemini never uses a paid fallback and hides provider error bodies',async()=>{
 assert.throws(()=>createGemini({GEMINI_API_KEY:'test',FREE_TIER_CONFIRMED:'1',GEMINI_MODEL:'paid-model'}),e=>e.code==='model_not_allowed');
 assert.throws(()=>createGemini({GEMINI_API_KEY:'test'}),e=>e.code==='free_tier_unconfirmed');
 const ask=createGemini({GEMINI_API_KEY:'private-test-key',FREE_TIER_CONFIRMED:'1'},{fetchImpl:async(url,options)=>{assert.equal(options.headers['x-goog-api-key'],'private-test-key');assert.ok(!options.body.includes('private-test-key'));return new Response('secret-debug-provider-text',{status:429});}});
 await assert.rejects(ask({system:'test',input:'test',schema:{type:'object'}}),e=>e.code==='quota_exhausted'&&!e.message.includes('secret'));
});
test('opaque long authorization keys reach Google unchanged; only unsafe header input is rejected', async()=>{
 const key='test.authorization.'+'x'.repeat(400)+'.test_suffix-123';
 assert.equal(normalizeGeminiKey(' '+key+' '),key);
 assert.equal(normalizeGeminiKey('short-test'), 'short-test');
 for(const invalid of ['', 'test\nkey','test key','遮蔽值']) assert.throws(()=>normalizeGeminiKey(invalid),e=>e.code==='invalid_key_format');
 const ask=createGemini({GEMINI_API_KEY:key,FREE_TIER_CONFIRMED:'1'}, {fetchImpl:async(url,options)=>{
   assert.equal(options.headers['x-goog-api-key'],key);
   return Response.json({error:{message:key,details:[{reason:'API_KEY_INVALID'}]}},{status:400});
 }});
 await assert.rejects(ask({system:'test',input:'test',schema:{type:'object'}}),e=>e.code==='key_rejected'&&!e.message.includes(key));
});
test('approved corpus contains explicit ownership and corrected facts, no private contact numbers',()=>{
 assert.equal(persona.voice,'assistant');assert.match(knowledge.documents.find(d=>d.id==='akc-stack').text,/Microsoft SQL Server/);
 assert.match(knowledge.documents.find(d=>d.id==='planner').text,/社群规模/);
 assert.doesNotMatch(JSON.stringify(knowledge),/15688450217|82131309|2951463568@qq/);
});
test('transient provider errors get only one bounded retry, with no retry for quota exhaustion',async()=>{
 let calls=0;
 const ask=createGemini({GEMINI_API_KEY:'opaque-test',FREE_TIER_CONFIRMED:'1'},{fetchImpl:async()=>{
  calls++;
  return new Response('{}',{status:calls===1?503:429});
 }});
 await assert.rejects(ask({system:'test',input:'test',schema:{type:'object'}}),e=>e.code==='quota_exhausted');
 assert.equal(calls,2);
});
test('the reusable graph keeps simultaneous request providers and answers separate',async()=>{
 const one={...reply,answer:'Visitor one answer'},two={...reply,answer:'Visitor two answer'};
 const result=await Promise.all([
  runInterview({question:'First visitor'},{},{ask:provider([plan,one,{...one,grounded:true}])}),
  runInterview({question:'Second visitor'},{},{ask:provider([plan,two,{...two,grounded:true}])})
 ]);
 assert.equal(result[0].answer,one.answer);assert.equal(result[1].answer,two.answer);
});
