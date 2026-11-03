'use strict';
(() => {
  const C = window.COURSE;
  const $ = (selector, parent=document) => parent.querySelector(selector);
  const $$ = (selector, parent=document) => [...parent.querySelectorAll(selector)];
  const escape = text => String(text).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key = 'llm-atlas-progress-v1';
  const ids = C.chapters.map(c=>c.id);
  let done = new Set();
  try { const stored=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(stored)) done=new Set(stored.filter(id=>ids.includes(id))); } catch {}
  let current = 'start';
  let toastTimer;
  function toast(message) {
    $('#toast').textContent=message;
    $('#toast').classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600);
  }
  function saveProgress() {
    try {localStorage.setItem(key,JSON.stringify([...done]));}
    catch {toast('此浏览器无法保存进度，本次标记仍然有效。');}
    drawNav();
  }
  function drawNav() {
    let previous='';
    $('#nav').innerHTML=C.chapters.map((c,i)=>{
      const group=c.group!==previous?`<div class="nav-label">${c.group}</div>`:'';
      previous=c.group;
      return `${group}<a class="nav-item ${current===c.id?'active':''}" href="#${c.id}" ${current===c.id?'aria-current="page"':''}><span class="nav-no">${String(i+1).padStart(2,'0')}</span><span>${c.title}</span>${done.has(c.id)?'<span class="nav-done" aria-label="已理解">✓</span>':''}</a>`;
    }).join('');
    $('#progress-text').textContent=`${done.size} / ${ids.length}`;
    $('#progress').max=ids.length;
    $('#progress').value=done.size;
    $('#guides-nav').classList.toggle('active', current==='guides');
    if(current==='guides')$('#guides-nav').setAttribute('aria-current','page');
    else $('#guides-nav').removeAttribute('aria-current');
  }
  function closeMenu() {
    $('#sidebar').classList.remove('open');
    $('#shade').hidden=true;
    $('#menu').setAttribute('aria-expanded','false');
  }
  function render(first=false) {
    clearTimeout(toastTimer);
    $('#toast').classList.remove('visible');
    const requested=location.hash.slice(1);
    current=ids.includes(requested)||['sources','guides'].includes(requested)?requested:'start';
    const chapter=C.chapters.find(c=>c.id===current);
    const index=ids.indexOf(current);
    const title=chapter?chapter.title:current==='guides'?'学习导览与推荐':'资料来源与说明';
    $('#crumb-title').textContent=title;
    document.title=`${title} · 大模型认知地图`;
    const body=chapter?`${chapter.html()}<div class="chapter-bottom"><button id="mark-done" class="button ${done.has(current)?'secondary':'light'}" aria-pressed="${done.has(current)}">${done.has(current)?'已理解本章':'标记为已理解'}</button><div class="pager">${index>0?`<a class="button light" href="#${ids[index-1]}">上一章</a>`:''}${index<ids.length-1?`<a class="button" href="#${ids[index+1]}">下一章</a>`:'<a class="button" href="#guides">继续学习</a>'}</div></div>`:current==='guides'?window.STUDY_GUIDES.html():C.sources();
    $('#main').innerHTML=`<div class="reading-layout"><article class="chapter-content">${body}</article><nav class="chapter-outline" aria-label="本页内容"></nav></div>`;
    $('#main').dataset.page=current;
    $$('.chapter-content h1 br').forEach(br=>br.replaceWith(document.createTextNode('')));
    drawNav();
    closeMenu();
    bindChapter();
    buildOutline();
    if(!first){window.scrollTo({top:0,behavior:'auto'});$('#main').focus({preventScroll:true});}
  }
  function buildOutline() {
    const headings=$$('h2, .experiment-head h3', $('.chapter-content'));
    const outline=$('.chapter-outline');
    if(!headings.length){outline.hidden=true;return;}
    outline.innerHTML='<strong>本页内容</strong>'+headings.map((heading,i)=>{
      heading.id=`${current}-section-${i}`;
      return `<button type="button" data-section="${i}">${escape(heading.textContent)}</button>`;
    }).join('');
    $$('[data-section]',outline).forEach(button=>button.addEventListener('click',()=>{
      const heading=headings[Number(button.dataset.section)];
      heading.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
      heading.setAttribute('tabindex','-1');
      heading.focus({preventScroll:true});
    }));
  }
  function bindChapter() {
    const mark=$('#mark-done');
    if(mark)mark.addEventListener('click',()=>{
      if(done.has(current)){done.delete(current);toast('已取消本章标记。');}
      else {done.add(current);toast('已标记。遇到问题时，随时回来。');}
      saveProgress();
      mark.textContent=done.has(current)?'已理解本章':'标记为已理解';
      mark.className=`button ${done.has(current)?'secondary':'light'}`;
      mark.setAttribute('aria-pressed',String(done.has(current)));
    });
    $$('.quiz').forEach(container=>{
      $$('[data-answer]',container).forEach(button=>button.addEventListener('click',()=>{
        const correct=Number(container.dataset.correct);
        $$('[data-answer]',container).forEach(b=>{b.classList.remove('correct','wrong');b.setAttribute('aria-pressed','false');});
        button.classList.add(Number(button.dataset.answer)===correct?'correct':'wrong');
        button.setAttribute('aria-pressed','true');
        $('.quiz-feedback',container).hidden=false;
        $('.quiz-feedback',container).setAttribute('role','status');
      }));
    });
    if(current==='purpose')bindTasks();
    if(current==='start')bindSampling();
    if(current==='anatomy')bindLayers();
    if(current==='mechanism'){bindAttention();bindSampling();}
    if(current==='training'){bindStages();bindTraining();}
    if(current==='solutions')bindScenarios();
    if(current==='evaluation')bindAttempts();
    if(current==='glossary')bindGlossary();
    if(current==='guides')bindGuides();
    if(current==='sources')$('#clear-progress').addEventListener('click',()=>{done.clear();saveProgress();toast('学习标记已清除。');});
  }
  function bindTasks() {
    const draw=index=>{
      $('#task-tabs').innerHTML=C.tasks.map((t,i)=>`<button data-task="${i}" class="${i===index?'active':''}" aria-pressed="${i===index}">${t[0]}</button>`).join('');
      const [title,task,example,need,limit]=C.tasks[index];
      $('#task-panel').innerHTML=`<span class="small-label">${title}</span><h3>${task}</h3><div class="stage-example">${escape(example)}</div><p>${need}</p><p class="subtle">${limit}</p>`;
      $$('[data-task]').forEach(button=>button.addEventListener('click',()=>draw(Number(button.dataset.task))));
    };
    draw(0);
  }
  function bindLayers() {
    $('#layer-stack').classList.add('desktop-layers');
    $('#layer-detail').classList.add('desktop-layers');
    const panelHTML=index=>{
      const [title,subtitle,what,why,shape]=C.layers[index];
      return `<h3>${title}</h3><p>${what}</p><p class="why">${why}</p><div class="formula">${shape}</div><small>B：批大小 · T：序列长度 · d：隐藏维度 · V：词表大小</small>`;
    };
    const layout=$('#layer-stack').parentElement;
    C.layers.forEach((layer,i)=>{
      const details=document.createElement('details');
      details.className='mobile-layer-details';
      details.name='model-layer-details';
      details.dataset.mobileLayer=i;
      details.open=i===0;
      details.innerHTML=`<summary>${layer[0]}</summary><div class="detail-panel">${panelHTML(i)}</div>`;
      layout.append(details);
    });
    const draw=index=>{
      $('#layer-stack').innerHTML=C.layers.map((l,i)=>`<button data-layer="${i}" class="layer ${index===i?'active':''}" aria-pressed="${index===i}">${String(i+1).padStart(2,'0')}　${l[0]}<span>↗</span></button>`).join('');
      $('#layer-detail').innerHTML=panelHTML(index);
      $$('[data-layer]').forEach(button=>button.addEventListener('click',()=>draw(Number(button.dataset.layer))));
    };
    draw(0);
  }
  function softmax(scores) {
    const max=Math.max(...scores);
    const exps=scores.map(s=>Math.exp(s-max));
    const sum=exps.reduce((a,b)=>a+b,0);
    return exps.map(e=>e/sum);
  }
  function barHTML(labels,probabilities) {
    return labels.map((label,i)=>`<div class="bar-row"><span>${label}</span><div class="bar-track" role="meter" aria-label="${label}的概率" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${(probabilities[i]*100).toFixed(1)}"><div class="bar-fill" style="width:${probabilities[i]*100}%"></div></div><span class="bar-value">${(probabilities[i]*100).toFixed(1)}%</span></div>`).join('');
  }
  function bindAttention() {
    const names=['小猫','坐在','温暖的','垫子上'];
    const Q=[[1,0],[.8,.6],[.2,1],[1,1]];
    const K=[[1,.2],[.3,1],[.8,.5],[.6,.9]];
    const V=[[1,0],[0,1],[1,1],[.5,.2]];
    let query=3;
    const draw=()=>{
      const causal=$('#causal').checked;
      const weights=Q.map((q,i)=>softmax(K.map((k,j)=>causal&&j>i?-Infinity:(q[0]*k[0]+q[1]*k[1])/Math.sqrt(2))));
      $('#query-tokens').innerHTML=names.map((n,i)=>`<button class="token ${i===query?'active':''}" data-query="${i}" aria-pressed="${i===query}">${n}<small>位置 ${i+1}</small></button>`).join('');
      $('#attention-matrix').innerHTML='<div class="matrix-head">Query ↓ / Key →</div>'+names.map(n=>`<div class="matrix-head">${n}</div>`).join('')+weights.map((row,i)=>`<div class="matrix-head">${names[i]}</div>`+row.map((p,j)=>causal&&j>i?`<div class="matrix-cell masked ${i===query?'focus-row':''}" aria-label="${names[i]}不能查看未来的${names[j]}">不可见</div>`:`<div class="matrix-cell ${i===query?'focus-row':''}" data-weight="${p}" style="background:rgba(117,153,91,${.10+.65*p})" aria-label="${names[i]}对${names[j]}的注意力权重 ${(p*100).toFixed(1)}%">${(p*100).toFixed(1)}%</div>`).join('')).join('');
      const out=[0,1].map(d=>weights[query].reduce((sum,p,i)=>sum+p*V[i][d],0));
      $('#attention-detail').innerHTML=`选中位置：<strong>${names[query]}</strong>；对 V 加权得到新向量 <code>[${out.map(v=>v.toFixed(3)).join(', ')}]</code>。${causal?'未来位置被屏蔽。':'当前关闭掩码，可以看到未来位置；这不是本页自回归训练所采用的可见性。'}`;
      $$('[data-query]').forEach(button=>button.addEventListener('click',()=>{query=Number(button.dataset.query);draw();}));
    };
    $('#causal').addEventListener('change',draw);
    draw();
  }
  function bindSampling() {
    const labels=['大模型','数学','编程','音乐'];
    const logits=[2.2,1.4,.9,.1];
    let probabilities;
    const draw=()=>{
      const temperature=Number($('#temperature').value);
      const k=Number($('#topk').value);
      $('#temperature-value').value=temperature.toFixed(1);
      probabilities=softmax(logits.map((logit,i)=>i<k?logit/temperature:-Infinity));
      $('#probability-bars').innerHTML=barHTML(labels,probabilities);
      $('#sample-token').textContent='……';
    };
    $('#temperature').addEventListener('input',draw);
    $('#topk').addEventListener('change',draw);
    $('#sample').addEventListener('click',()=>{
      let r=Math.random();
      let selected=labels.length-1;
      for(let i=0;i<probabilities.length;i++){r-=probabilities[i];if(r<0){selected=i;break;}}
      $('#sample-token').textContent=labels[selected];
    });
    draw();
  }
  function bindStages() {
    const draw=index=>{
      $('#training-tabs').innerHTML=C.stages.map((s,i)=>`<button data-stage="${i}" class="${i===index?'selected':''}" aria-pressed="${i===index}"><strong>${i+1}. ${s[0]}</strong><small>${s[1]}</small></button>${i<2?'<span class="arrow">→</span>':''}`).join('');
      const [title,sub,method,example,why]=C.stages[index];
      $('#training-stage').innerHTML=`<span class="small-label">${sub}</span><h3>${title}</h3><p>${method}</p><div class="stage-example">${example}</div><p>${why}</p>`;
      $$('[data-stage]').forEach(button=>button.addEventListener('click',()=>draw(Number(button.dataset.stage))));
    };
    draw(0);
  }
  function bindTraining() {
    const labels=['学习','水果','跑步','天空'];
    let logits=[0,0,0,0];
    let step=0;
    const draw=()=>{
      const probabilities=softmax(logits);
      $('#train-bars').innerHTML=barHTML(labels,probabilities);
      $('#train-step').textContent=step;
      $('#train-loss').textContent=(-Math.log(probabilities[0])).toFixed(3);
      $('#train-target').textContent=(probabilities[0]*100).toFixed(1)+'%';
    };
    const update=count=>{
      for(let s=0;s<count;s++){
        const p=softmax(logits);
        logits=logits.map((logit,i)=>logit-.5*(p[i]-(i===0?1:0)));
        step++;
      }
      draw();
    };
    $('#train-once').addEventListener('click',()=>update(1));
    $('#train-ten').addEventListener('click',()=>update(10));
    $('#train-reset').addEventListener('click',()=>{logits=[0,0,0,0];step=0;draw();});
    draw();
  }
  function bindScenarios() {
    const draw=index=>{
      $('#scenario-options').innerHTML=C.scenarios.map((s,i)=>`<button class="decision-option ${i===index?'selected':''}" data-scenario="${i}" aria-pressed="${i===index}"><span>${i===index?'●':'○'}</span>${s[0]}</button>`).join('');
      const [problem,title,path,recommendation,limit]=C.scenarios[index];
      $('#scenario-answer').innerHTML=`<span class="small-label">从问题定位改动</span><h3>${title}</h3><div class="decision-path">${path}</div><p>${recommendation}</p><p class="subtle">${limit}</p>`;
      $$('[data-scenario]').forEach(button=>button.addEventListener('click',()=>draw(Number(button.dataset.scenario))));
    };
    draw(0);
  }
  function bindAttempts() {
    const draw=()=>{
      const p=Number($('#success-p').value)/100;
      const n=Number($('#attempts').value);
      $('#success-p-value').value=(p*100).toFixed(0)+'%';
      $('#at-least-one').textContent=((1-(1-p)**n)*100).toFixed(1)+'%';
      $('#attempt-cost').textContent=n+'×';
    };
    $('#success-p').addEventListener('input',draw);
    $('#attempts').addEventListener('change',draw);
    draw();
  }
  function bindGlossary() {
    const draw=()=>{
      const query=$('#glossary-search').value.trim().toLocaleLowerCase();
      const matches=C.glossary.filter(item=>item.slice(0,4).join(' ').toLocaleLowerCase().includes(query));
      $('#glossary-count').textContent=`${matches.length} 个相关概念 / 共 ${C.glossary.length} 个`;
      $('#glossary-list').innerHTML=matches.length?matches.map(([en,zh,definition,related,route])=>`<article class="glossary-item"><h3>${zh}</h3><span class="small-label">${en}</span><p>${definition}</p><small>相关：${related}</small><br><a href="#${route}">回到对应讲解 →</a></article>`).join(''):'<div class="empty">没有匹配的术语。试试中文名、英文全称或缩写。</div>';
    };
    $('#glossary-search').addEventListener('input',draw);
    draw();
  }
  function bindGuides() {
    const G=window.STUDY_GUIDES;
    let selectedPath=G.paths[0];
    const external=(url,label)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    const renderResources=()=>{
      const query=$('#guide-search').value.trim().toLocaleLowerCase();
      const category=$('#guide-category').value;
      const matches=G.resources.filter(g=>(category==='all'||g.category===category)&&[g.name,g.language,g.categoryName,g.reason,g.prerequisites,g.reading,g.fit].join(' ').toLocaleLowerCase().includes(query));
      const rank=id=>selectedPath.sequence.includes(id)?selectedPath.sequence.indexOf(id):99;
      matches.sort((a,b)=>rank(a.id)-rank(b.id));
      $('#guide-count').textContent=`显示 ${matches.length} / ${G.resources.length} 份资料；当前路线中的资料优先排列。`;
      $('#guide-list').innerHTML=matches.length?matches.map(g=>`<article class="guide-item" id="guide-${g.id}" data-guide-id="${g.id}"><div class="guide-name"><h3>${external(g.url,g.name)}</h3><p>${g.language} · ${g.categoryName}</p><div class="guide-links">${external(g.url,'打开资料')}${g.repository&&g.repository!==g.url?external(g.repository,'项目仓库'):''}</div></div><div><p class="guide-reason">${g.reason}</p><dl><div><dt>适合谁</dt><dd>${g.fit}</dd></div><div><dt>前置知识</dt><dd>${g.prerequisites}</dd></div><div><dt>推荐读法</dt><dd>${g.reading}</dd></div></dl></div></article>`).join(''):'<p class="empty" role="status">没有匹配的资料。试试中文名、英文名，或将筛选切换为“全部资源”。</p>';
    };
    const renderPath=()=>{
      $('#guide-paths').innerHTML=G.paths.map(path=>`<button type="button" data-guide-path="${path.id}" aria-pressed="${path.id===selectedPath.id}" class="${path.id===selectedPath.id?'active':''}">${path.name}</button>`).join('');
      $('#guide-route').innerHTML=`<h3>${selectedPath.title}</h3><p>${selectedPath.description}</p><div class="route-sequence">${selectedPath.sequence.map((id,i)=>{const g=G.resources.find(item=>item.id===id);return `${i?'<span aria-hidden="true">→</span>':''}${external(g.url,g.name)}`;}).join('')}</div>`;
      $$('[data-guide-path]').forEach(button=>button.addEventListener('click',()=>{selectedPath=G.paths.find(path=>path.id===button.dataset.guidePath);renderPath();renderResources();}));
    };
    $('#guide-search').addEventListener('input',renderResources);
    $('#guide-category').addEventListener('change',renderResources);
    renderPath();
    renderResources();
  }
  $('#menu').addEventListener('click',()=>{
    const open=!$('#sidebar').classList.contains('open');
    $('#sidebar').classList.toggle('open',open);
    $('#shade').hidden=!open;
    $('#menu').setAttribute('aria-expanded',String(open));
  });
  $('#shade').addEventListener('click',closeMenu);
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  $('.skip-link').addEventListener('click',event=>{event.preventDefault();$('#main').focus();});
  $('#print').addEventListener('click',()=>window.print());
  window.addEventListener('hashchange',()=>render());
  render(true);
})();
