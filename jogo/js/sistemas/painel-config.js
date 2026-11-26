/* CAOS BR FPS · painel de CONFIGURAÇÕES (estilo menu de jogo: abas à esquerda, linhas com ◀ valor ▶). openPanel(aba) */
(function(){
 const g=CAOS.gfx,PRE=CAOS.GPRE;
 const I=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
 const TABS=[['gfx','Gráficos',I('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/>')],
  ['ctl','Controles',I('<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="16" cy="11.5" r=".6"/><circle cx="18" cy="13.5" r=".6"/>')],
  ['hud','HUD',I('<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>')],
  ['acc','Conta',I('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/>')]];
 const AL='<svg viewBox="0 0 24 24"><path d="M15 5l-8 7 8 7z" fill="currentColor"/></svg>',AR='<svg viewBox="0 0 24 24"><path d="M9 5l8 7-8 7z" fill="currentColor"/></svg>';
 let el,cur='gfx';
 function build(){
  el=document.createElement('div');el.id='cfgp';
  el.innerHTML='<div class="cph">'+I('<circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="7"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>')+'<span>CONFIGURAÇÕES</span><button class="cpx" aria-label="Fechar">✕</button></div><div class="cpt"></div><div class="cpc"></div>';
  (ov.parentNode||document.body).appendChild(el);
  el.querySelector('.cpx').onclick=close;
  addEventListener('keydown',e=>{if(e.key==='Escape'&&el.classList.contains('on'))close()});
  const pt=el.querySelector('.cpt');
  TABS.forEach(([k,n,ic])=>{const b=document.createElement('button');b.dataset.t=k;b.innerHTML=ic+'<small>'+n+'</small>';b.onclick=()=>{cur=k;render()};pt.appendChild(b)});
 }
 function close(){el.classList.remove('on')}
 const row=(label,ctl)=>{const r=document.createElement('div');r.className='cpr';r.innerHTML='<span></span>';r.firstChild.textContent=label;r.appendChild(ctl);return r};
 const sec=t=>{const d=document.createElement('div');d.className='cpsec';d.innerHTML='<i></i>';d.append(t);return d};
 function stepper(label,get,set,opts){
  const w=document.createElement('div');w.className='cps';
  let i=opts.findIndex(o=>String(o[0])===String(get()));if(i<0)i=opts.length-1;
  w.innerHTML='<button class="cpa">'+AL+'</button><b>'+opts[i][1]+'</b><button class="cpa">'+AR+'</button>';
  const [a,b]=w.querySelectorAll('button');a.disabled=i<=0;b.disabled=i>=opts.length-1;
  a.onclick=()=>set(opts[i-1][0]);b.onclick=()=>set(opts[i+1][0]);
  return row(label,w);
 }
 function slider(label,k,mn,mx,st){
  const w=document.createElement('div');w.className='cps cpsl';w.innerHTML='<input type="range" min="'+mn+'" max="'+mx+'" step="'+st+'" value="'+S[k]+'"><b>'+S[k]+'</b>';
  const inp=w.firstChild,b=w.lastChild;inp.oninput=()=>{S[k]=+inp.value;b.textContent=S[k];saveCfg();applyCfg()};
  return row(label,w);
 }
 const btn=(t,f)=>{const b=document.createElement('button');b.className='cpbtn';b.textContent=t;b.onclick=f;return b};
 function render(){
  el.querySelectorAll('.cpt button').forEach(b=>b.classList.toggle('on',b.dataset.t===cur));
  const pc=el.querySelector('.cpc'),st=pc.scrollTop;pc.innerHTML='';const A=x=>pc.appendChild(x);
  const SG=(k,v)=>{if(k==='pre'){if(PRE[v])Object.assign(g,PRE[v]);g.pre=v}else{g[k]=v;if(k!=='fl')g.pre='custom'}g.save();render()};
  const gs=(l,k,o)=>A(stepper(l,()=>g[k],v=>SG(k,v),o));
  if(cur==='gfx'){
   A(sec('Básico'));
   gs('Qualidade gráfica','pre',[['minima','Mínima'],['baixa','Baixa'],['media','Média'],['alta','Alta']].concat(g.pre==='custom'?[['custom','Personalizada']]:[]));
   gs('Limite de FPS','fps',[[30,'30 fps'],[45,'45 fps'],[60,'60 fps']]);
   A(sec('Personalizado'));
   gs('Qualidade das sombras','sh',[[0,'Desligadas'],[1,'Baixa'],[2,'Média'],[3,'Alta']]);
   gs('Qualidade das texturas','tx',[[0,'Lisa (cor)'],[1,'Baixa'],[2,'Média'],[3,'Alta']]);
   gs('Resolução','res',[[0,'Mínima'],[1,'Baixa'],[2,'Média'],[3,'Alta']]);
   gs('Suavização de bordas','aa',[[0,'Desligada'],[1,'Ligada']]);
   gs('Distância da câmera','cd',[[0,'Normal'],[1,'Longa'],[2,'Muito longa']]);
   A(sec('Lobby'));
   gs('Lobby 3D','lb',[[0,'Desligado (2D)'],[1,'Leve'],[2,'Completo']]);
   A(sec('Outros'));
   gs('Mostrar FPS','fl',[[0,'Não'],[1,'Sim']]);
   const h=document.createElement('div');h.className='cph2';h.textContent='Sombras, resolução, FPS e câmera valem na próxima partida. Lobby, texturas e suavização: reabra o jogo.';A(h);
   A(btn('REABRIR O JOGO (APLICAR TUDO)',()=>{g.save();location.reload()}));
  }else if(cur==='ctl'){
   A(sec('Sensibilidade'));
   A(slider('Câmera','sens',.3,2.5,.05));A(slider('Câmera com zoom','zs',.2,1.5,.05));A(slider('Vertical (cima/baixo)','vs',.2,2.5,.05));
   A(stepper('Inversor vertical',()=>S.inv,v=>{S.inv=v;saveCfg();render()},[[0,'Normal'],[1,'Invertido']]));
   A(slider('Grudar na mira','asst',0,1,.05));
  }else if(cur==='hud'){
   A(sec('Tela'));
   A(slider('Opacidade do HUD','hudAlpha',.2,1,.05));
   A(stepper('Minimapa',()=>S.mini,v=>{S.mini=v;saveCfg();render()},[[0,'Desligado'],[1,'Ligado']]));
   A(sec('Botão atirar'));
   A(slider('Tamanho','fS',56,130,2));A(slider('Distância da direita','fR',8,300,2));A(slider('Distância de baixo','fB',8,200,2));
   const e=btn('EDITAR POSIÇÃO DOS BOTÕES',()=>{if(!G){e.textContent='ENTRE NUMA PARTIDA PRIMEIRO';return}close();setEdit(true)});A(e);
   A(btn('RESTAURAR PADRÃO',()=>{Object.assign(S,DEF);saveCfg();resetLay();applyCfg();render()}));
  }else{
   A(sec('Perfil'));
   const i=document.createElement('input');i.type='text';i.maxLength=12;i.value=$('#nick').textContent;i.className='cpin';
   i.oninput=()=>{const v=i.value.trim().toUpperCase()||'PLAYER_01';$('#nick').textContent=v;try{localStorage.setItem('nick',v)}catch(e){}};
   A(row('Nome',i));
  }
  pc.scrollTop=st;
 }
 window.openPanel=function(tab){if(!el)build();if(tab)cur=tab;render();el.classList.add('on')};
})();
