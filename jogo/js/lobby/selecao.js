/* CAOS BR FPS · SELEÇÃO DE MAPAS E MODOS (v51), aberta pelo botão MODOS do lobby. Por enquanto SÓ A INTERFACE (nenhum mapa/modo existe ainda).
   Layout: fundo escuro semitransparente com desfoque sobre o lobby; painel com cabeçalho, coluna MODOS DE JOGO (esquerda), área MAPAS (direita)
   separadas por uma linha dourada, e rodapé com a escolha atual + CONFIRMAR.
   PARA ADICIONAR (futuro), sem mexer na interface:
     CAOS.selecao.modos.push({id:'solo',nome:'SOLO',desc:'Todos contra todos'});
     CAOS.selecao.mapas.push({id:'ilha',nome:'ILHA',img:'img/mapas/ilha.png',modos:['solo']});   // modos omitido = vale para todos os modos
     CAOS.selecao.aoConfirmar=({modo,mapa})=>{...}   // chamado ao tocar em CONFIRMAR
   O lobby 3D fica pausado enquanto a janela está aberta (poupa GPU; o desfoque é sobre uma imagem parada). */
CAOS.selecao={modos:[],mapas:[],sel:{modo:null,mapa:null},aoConfirmar:null};
CAOS.abrirSelecao=function(){
 const st=document.getElementById('stage');if(!st||document.getElementById('sel'))return;
 const S=CAOS.selecao,el=document.createElement('div');el.id='sel';el.className='sel';el.setAttribute('role','dialog');el.setAttribute('aria-label','Seleção de mapas e modos');
 const wasPaused=CAOS.lobby?CAOS.lobby.paused:false;if(CAOS.lobby)CAOS.lobby.paused=true;
 el.innerHTML='<div class="sl-p"><header class="sl-h"><b>SELEÇÃO DE PARTIDA</b><button class="sl-x" aria-label="Fechar">✕</button></header>'+
  '<div class="sl-b"><aside class="sl-m"><h4>MODOS DE JOGO</h4><div class="sl-ml"></div></aside><i class="sl-sep"></i><section class="sl-a"><h4>MAPAS<em class="sl-cnt"></em></h4><div class="sl-ag"></div></section></div>'+
  '<footer class="sl-f"><div class="sl-sum"><span>MODO<b class="sl-vm">—</b></span><span>MAPA<b class="sl-vp">—</b></span></div><button class="sl-ok" disabled>CONFIRMAR</button></footer></div>';
 const $$=s=>el.querySelector(s);
 const ico='<svg viewBox="0 0 24 24"><path d="M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.400 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.3"/></svg>';
 const mapaOk=m=>!m.modos||!S.sel.modo||m.modos.indexOf(S.sel.modo)>=0;
 function render(){
  // modos
  const ml=$$('.sl-ml');
  ml.innerHTML=S.modos.length?S.modos.map(m=>'<button class="sl-mi'+(S.sel.modo===m.id?' on':'')+'" data-id="'+m.id+'"><span>'+m.nome+'</span>'+(m.desc?'<small>'+m.desc+'</small>':'')+'</button>').join(''):
   '<div class="sl-empty"><svg viewBox="0 0 24 24"><rect x="3.500" y="4" width="17" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></svg><b>Nenhum modo ainda</b><small>Os modos de jogo aparecerão aqui.</small></div>';
  ml.querySelectorAll('.sl-mi').forEach(b=>b.onclick=()=>{S.sel.modo=b.dataset.id;if(S.sel.mapa&&!S.mapas.some(m=>m.id===S.sel.mapa&&mapaOk(m)))S.sel.mapa=null;render()});
  // mapas
  const L=S.mapas.filter(mapaOk),ag=$$('.sl-ag');
  $$('.sl-cnt').textContent=S.mapas.length?L.length+' / '+S.mapas.length:'';
  ag.innerHTML=L.length?L.map(m=>'<button class="sl-card'+(S.sel.mapa===m.id?' on':'')+'" data-id="'+m.id+'"><span class="sl-im" style="background-image:url('+(m.img||'')+')"></span><b>'+m.nome+'</b></button>').join(''):
   '<div class="sl-empty big">'+ico+'<b>Nenhum mapa ainda</b><small>Os mapas aparecerão aqui quando forem adicionados.</small></div>';
  ag.classList.toggle('vazio',!L.length);
  ag.querySelectorAll('.sl-card').forEach(b=>b.onclick=()=>{S.sel.mapa=b.dataset.id;render()});
  // rodapé
  const mo=S.modos.find(m=>m.id===S.sel.modo),mp=S.mapas.find(m=>m.id===S.sel.mapa);
  $$('.sl-vm').textContent=mo?mo.nome:'—';$$('.sl-vp').textContent=mp?mp.nome:'—';
  const ok=$$('.sl-ok');ok.disabled=!(mo&&mp);
  ok.onclick=()=>{if(ok.disabled)return;const r={modo:S.sel.modo,mapa:S.sel.mapa};fecha();S.aoConfirmar&&S.aoConfirmar(r)};
 }
 render();
 const fecha=()=>{removeEventListener('keydown',tecla);el.remove();if(CAOS.lobby)CAOS.lobby.paused=wasPaused},tecla=e=>{if(e.key==='Escape')fecha()};
 $$('.sl-x').onclick=fecha;el.addEventListener('pointerdown',e=>{if(e.target===el)fecha()});addEventListener('keydown',tecla);
 st.appendChild(el);
};
