(() => {
  'use strict';
  const robot = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="9" width="22" height="18" rx="7"/><path d="M16 9V5M2 16v5m28-5v5M12 23h8"/><circle cx="16" cy="3.5" r="1.5"/><rect x="10" y="14" width="3" height="5" rx="1.5" fill="currentColor" stroke="none"/><rect x="19" y="14" width="3" height="5" rx="1.5" fill="currentColor" stroke="none"/></svg>';
  const icons = { close:'<path d="m6 6 12 12M18 6 6 18"/>', send:'<path d="m5 12 7-7 7 7M12 5v14"/>', clear:'<path d="M3 12a9 9 0 1 0 3-6M3 3v6h6"/>', stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>' };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
  const local = location.hostname === '127.0.0.1' && location.port === '8787';
  const endpoint = (local ? location.origin : window.DAVID_AGENT_CONFIG?.endpoint || '').replace(/\/$/,'');
  const copy = {
    zh: { launch:'问问 David AI',title:'David 的 AI 助手',subtitle:'经历、项目，还有背后的思考。',hello:'从一个问题，认识 David。',intro:'我可以介绍他的经历、讲解项目，也可以带你找到相关作品。',placeholder:'问问他的项目、经历或求职方向…',send:'发送问题',stop:'停止回答',close:'关闭对话',clear:'新对话',sources:'回答依据',suggestions:['他想找什么方向的工作？','AKC 项目最难的是什么？','机器人控制端是怎么做的？'],disclosure:'AI 助手 · 回答以已确认资料为依据。对话交由 Gemini 处理，免费层内容可能用于改进 Google 产品。',waiting:'正在连接…',understand:'理解你的问题',retrieve:'查阅相关资料',compose:'整理回答',verify:'核对事实与职责',offline:'AI 暂时无法连接，你仍然可以浏览项目或查看简历。',quota:'今天的免费 AI 额度暂时用完了，可以稍后再来，或直接浏览项目。',rate:'提问有点快，请稍后再试。',unverified:'这次回答未通过资料核对。可以换一种问法，或直接查看相关项目。',unknown:'以下细节仍需 David 本人补充',work:'浏览作品',resume:'查看简历',retry:'重试这个问题',cancelled:'已停止这次回答。',notice:'对话仅保留在当前页面，不会自动用于更新 David 的资料。',ready:'基于本人确认的资料',notReady:'可先浏览资料',newChat:'新对话已开始。' },
    en: { launch:'Ask David AI',title:'David’s AI assistant',subtitle:'The work. The journey. The thinking behind it.',hello:'Get to know David, one question at a time.',intro:'Explore his experience, unpack a project, or let me point you to his work.',placeholder:'Ask about a project, his experience or career interests…',send:'Send question',stop:'Stop response',close:'Close conversation',clear:'New conversation',sources:'Sources',suggestions:['What kind of role is David looking for?','What was hardest about the AKC project?','How does the robot controller work?'],disclosure:'AI assistant · Grounded in approved information. Messages are processed by Gemini; free-tier content may be used to improve Google products.',waiting:'Connecting…',understand:'Understanding your question',retrieve:'Finding relevant sources',compose:'Putting the answer together',verify:'Checking facts and contributions',offline:'AI is unavailable right now. You can still explore the projects or read the résumé.',quota:'The free AI allowance is temporarily exhausted. Please return later or explore the projects directly.',rate:'A few too many requests. Please try again shortly.',unverified:'This answer could not be verified against the sources. Try rephrasing or open the relevant project.',unknown:'These details still need David’s confirmation',work:'Explore projects',resume:'Read résumé',retry:'Retry question',cancelled:'This response was stopped.',notice:'This conversation stays in the current page and does not automatically update David’s information.',ready:'Grounded in David’s approved information',notReady:'Explore the available sources',newChat:'A new conversation has started.' }
  };
  const language = () => document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const tr = key => copy[language()][key];
  const launcher = document.createElement('button');
  launcher.type='button';launcher.className='agent-launcher';launcher.setAttribute('aria-haspopup','dialog');launcher.setAttribute('aria-controls','agent-dialog');
  launcher.innerHTML=`<span class="agent-avatar">${robot}</span><span class="agent-launch-label"></span><span class="agent-launch-dot" aria-hidden="true"></span>`;
  const panel = document.createElement('dialog');panel.id='agent-dialog';panel.className='agent-dialog';panel.setAttribute('aria-labelledby','agent-title');
  panel.innerHTML=`<div class="agent-shell"><header class="agent-header"><div class="agent-avatar">${robot}</div><div><h2 id="agent-title"></h2><p id="agent-subtitle"></p></div><button type="button" class="agent-small-button" id="agent-new">${icon('clear')}</button><button type="button" class="agent-small-button" id="agent-close">${icon('close')}</button></header><div class="agent-scroll" id="agent-scroll"><div class="agent-welcome"><span class="agent-kicker">HELLO, CURIOUS HUMAN.</span><h3 id="agent-welcome-title"></h3><p id="agent-welcome-intro"></p><div id="agent-starters" class="agent-starters"></div><div class="agent-trust"><span></span><small id="agent-ready"></small></div></div><div id="agent-messages" class="agent-messages" aria-label="Conversation"></div><div id="agent-progress" class="agent-progress" role="status" hidden><span class="agent-thinking" aria-hidden="true"><i></i><i></i><i></i></span><span></span></div></div><div class="agent-compose"><form id="agent-form"><label class="agent-sr-only" for="agent-input"></label><textarea id="agent-input" rows="2" maxlength="2000"></textarea><button type="submit" id="agent-send">${icon('send')}</button></form><p class="agent-disclosure" id="agent-disclosure"></p></div><span class="agent-sr-only" id="agent-announcement" role="status" aria-live="polite"></span></div>`;
  document.body.append(launcher,panel);
  const el=id=>panel.querySelector('#'+id);
  let conversation=[], controller=null, busy=false, ready=false, lastTrigger=launcher, conversationVersion=0;
  const scrollDown=()=>{el('agent-scroll').scrollTop=el('agent-scroll').scrollHeight;};
  function updateCopy(){
    launcher.querySelector('.agent-launch-label').textContent=tr('launch');launcher.setAttribute('aria-label',tr('launch'));
    for(const [id,key] of [['agent-title','title'],['agent-subtitle','subtitle'],['agent-welcome-title','hello'],['agent-welcome-intro','intro'],['agent-disclosure','disclosure']])el(id).textContent=tr(key);
    el('agent-input').placeholder=tr('placeholder');panel.querySelector('label[for=agent-input]').textContent=tr('placeholder');
    for(const [id,key] of [['agent-close','close'],['agent-new','clear'],['agent-send',busy?'stop':'send']])el(id).setAttribute('aria-label',tr(key));
    el('agent-ready').textContent=tr(ready?'ready':'notReady');
    el('agent-starters').replaceChildren(...copy[language()].suggestions.map(q=>questionButton(q)));
  }
  function questionButton(q){const b=document.createElement('button');b.type='button';b.textContent=q;b.onclick=()=>submit(q);return b;}
  async function open(trigger=launcher){
    if(panel.open)return;
    lastTrigger=trigger;updateCopy();panel.showModal();document.body.classList.add('agent-open');launcher.setAttribute('aria-expanded','true');el('agent-input').focus();
    if(endpoint)try{const r=await fetch(endpoint+'/health',{signal:AbortSignal.timeout(8000)});const status=await r.json();ready=r.ok&&status.ready;el('agent-ready').textContent=tr(ready?'ready':'notReady');}catch{ready=false;}
  }
  function close(){panel.close();}
  launcher.onclick=()=>open();el('agent-close').onclick=close;
  panel.addEventListener('click',event=>{if(event.target!==panel)return;const r=panel.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();});
  panel.addEventListener('close',()=>{controller?.abort();document.body.classList.remove('agent-open');launcher.setAttribute('aria-expanded','false');lastTrigger?.focus?.({preventScroll:true});});
  el('agent-new').onclick=()=>{conversationVersion++;controller?.abort();controller=null;setBusy(false);conversation=[];el('agent-messages').replaceChildren();panel.querySelector('.agent-welcome').hidden=false;el('agent-announcement').textContent=tr('newChat');el('agent-input').focus();};
  function setBusy(value){busy=value;el('agent-progress').hidden=!value;el('agent-send').innerHTML=icon(value?'stop':'send');el('agent-send').setAttribute('aria-label',tr(value?'stop':'send'));el('agent-input').disabled=value;panel.querySelectorAll('.agent-starters button,.agent-followups button').forEach(b=>b.disabled=value);if(!value)el('agent-input').focus();}
  function stage(name){el('agent-progress').lastElementChild.textContent=tr(name)||tr('waiting');scrollDown();}
  function bubble(role,text){const item=document.createElement('article');item.className=`agent-message agent-${role}`;const label=document.createElement('span');label.className='agent-speaker';label.textContent=role==='user'?(language()==='zh'?'你':'You'):tr('title');const p=document.createElement('div');p.className='agent-answer';p.textContent=text;item.append(label,p);el('agent-messages').append(item);scrollDown();return item;}
  function act(action){close();requestAnimationFrame(()=>window.dispatchEvent(new CustomEvent('portfolio-agent-action',{detail:action})));}
  function actionButton(action){const b=document.createElement('button');b.type='button';b.textContent=action.label;b.onclick=()=>act(action);return b;}
  function safeSourceURL(raw){try{const url=new URL(raw,location.origin+'/');if(url.origin===location.origin||url.origin==='https://ntu-planner.com')return url.href;}catch{}return null;}
  function renderReply(result){
    const item=bubble('assistant',result.answer);
    if(result.citations?.length){const details=document.createElement('details');details.className='agent-sources';const summary=document.createElement('summary');summary.textContent=tr('sources')+` · ${result.citations.length}`;details.append(summary);for(const source of result.citations){const href=safeSourceURL(source.url);if(!href)continue;const a=document.createElement('a');a.textContent=source.title;a.href=href;a.target='_blank';a.rel='noopener noreferrer';details.append(a);}item.append(details);}
    if(result.actions?.length){const actions=document.createElement('div');actions.className='agent-actions';for(const a of result.actions)if(['project','section','resume'].includes(a.type))actions.append(actionButton(a));item.append(actions);}
    if(result.missingInformation?.length){const d=document.createElement('details');d.className='agent-gaps';const s=document.createElement('summary');s.textContent=tr('unknown');d.append(s);for(const q of result.missingInformation){const p=document.createElement('p');p.textContent=q;d.append(p);}item.append(d);}
    if(result.followUps?.length){const list=document.createElement('div');list.className='agent-followups';list.append(...result.followUps.map(q=>questionButton(q)));item.append(list);}
    el('agent-announcement').textContent=result.answer;scrollDown();
  }
  function renderError(code,question){
    const key=['quota_exhausted','daily_limit'].includes(code)?'quota':code==='rate_limited'?'rate':['unable_to_ground','unable_to_answer','invalid_model_response'].includes(code)?'unverified':code==='cancelled'?'cancelled':'offline';
    const item=bubble('system',tr(key)),actions=document.createElement('div');actions.className='agent-actions';
    actions.append(actionButton({type:'section',target:'work',label:tr('work')}),actionButton({type:'resume',target:language(),label:tr('resume')}));
    if(key!=='quota'){const retry=document.createElement('button');retry.type='button';retry.textContent=tr('retry');retry.onclick=()=>submit(question);actions.append(retry);}item.append(actions);scrollDown();
  }
  async function submit(text){
    if(busy){controller?.abort();return;}
    const question=text.trim();if(!question||question.length>2000)return;
    panel.querySelector('.agent-welcome').hidden=true;bubble('user',question);el('agent-input').value='';
    const history=conversation.slice(-8),version=conversationVersion;setBusy(true);stage('waiting');controller=new AbortController();
    try{
      if(!endpoint)throw new Error('not_configured');
      const response=await fetch(endpoint+'/chat',{method:'POST',headers:{'Content-Type':'application/json','Accept':'text/event-stream'},body:JSON.stringify({question,history,language:language()}),signal:controller.signal});
      if(!response.ok){const error=await response.json();throw new Error(error.error||'service_unavailable');}
      let result=null;
      if(response.headers.get('Content-Type')?.includes('text/event-stream')){
        const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';
        for(;;){const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});const events=buffer.split('\n\n');buffer=events.pop();for(const event of events){if(!event.startsWith('data: '))continue;const data=JSON.parse(event.slice(6));if(data.type==='status')stage(data.stage);else if(data.type==='result')result=data.result;else if(data.type==='error')throw new Error(data.error);}}
      }else result=await response.json();
      if(!result?.answer)throw new Error('incomplete_response');
      if(version!==conversationVersion)return;
      conversation.push({role:'user',content:question},{role:'assistant',content:result.answer});renderReply(result);
    }catch(error){if(version===conversationVersion)renderError(error.name==='AbortError'?'cancelled':error.message,question);}
    finally{if(version===conversationVersion){controller=null;setBusy(false);}}
  }
  el('agent-form').onsubmit=e=>{e.preventDefault();submit(el('agent-input').value);};
  el('agent-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();submit(e.currentTarget.value);}});
  new MutationObserver(updateCopy).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.portfolioAgent={open};updateCopy();
})();
