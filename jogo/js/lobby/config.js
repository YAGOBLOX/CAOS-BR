/* CAOS BR FPS · painel de CONFIGURAÇÕES (v49), aberto pela engrenagem do lobby. Abas à esquerda; por enquanto só "Configurações Gerais".
   Opções: MÚSICA DO LOBBY (faixa) e VOLUME DA MÚSICA (0–100%; 0 desliga de vez). Dados e áudio em js/sistemas/musica.js.
   Nova opção = uma linha .cf-row em render(). Nova aba = um botão em .cf-tabs. Estilo: css/config.css. */
CAOS.abrirConfig=function(){
 const st=document.getElementById('stage');if(!st||document.getElementById('cfg'))return;
 const M=CAOS.musica,el=document.createElement('div');el.id='cfg';el.className='cfg';el.setAttribute('role','dialog');el.setAttribute('aria-label','Configurações');
 el.innerHTML='<div class="cf-top"><b>CONFIGURAÇÕES</b><button class="cf-x" aria-label="Fechar">✕</button></div>'+
  '<div class="cf-body"><nav class="cf-tabs"><button class="on">CONFIGURAÇÕES GERAIS</button></nav><section class="cf-pg"><h3>CONFIGURAÇÕES GERAIS</h3><div class="cf-list"></div></section></div>';
 const list=el.querySelector('.cf-list');
 function render(){
  const v=M.volume,id=M.faixaId;
  list.innerHTML=
   '<div class="cf-row"><div class="cf-l"><b>Música do lobby</b><i>Escolha a trilha que toca no lobby.</i></div>'+
   '<div class="cf-opts">'+M.FAIXAS.map(f=>'<button class="cf-opt'+(f.id===id?' on':'')+'" data-f="'+f.id+'"><svg viewBox="0 0 16 16"><path d="M6 12.2V3.4l7-1.6v8.6"/><circle cx="4.4" cy="12.4" r="1.9"/><circle cx="11.4" cy="10.6" r="1.9"/></svg><span>'+f.nome+'</span><em></em></button>').join('')+'</div></div>'+
   '<div class="cf-row"><div class="cf-l"><b>Volume da música</b><i class="cf-st">'+(v<=0?'Desligada: o áudio fica totalmente parado.':'Ajuste de 0% a 100%.')+'</i></div>'+
   '<div class="cf-vol"><input type="range" min="0" max="100" step="1" value="'+v+'" aria-label="Volume da música" style="--p:'+v+'%"><output>'+v+'%</output></div></div>';
  list.querySelectorAll('.cf-opt').forEach(b=>b.onclick=()=>{M.setFaixa(b.dataset.f);render()});
  const r=list.querySelector('input'),o=list.querySelector('output'),s=list.querySelector('.cf-st');
  r.oninput=()=>{const n=+r.value;r.style.setProperty('--p',n+'%');o.textContent=n+'%';s.textContent=n<=0?'Desligada: o áudio fica totalmente parado.':'Ajuste de 0% a 100%.';M.setVolume(n)};
 }
 render();
 const fecha=()=>{removeEventListener('keydown',tecla);el.remove()},tecla=e=>{if(e.key==='Escape')fecha()};
 el.querySelector('.cf-x').onclick=fecha;addEventListener('keydown',tecla);
 st.appendChild(el);
};
