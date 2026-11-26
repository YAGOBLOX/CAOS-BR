/* CAOS BR FPS · GRÁFICOS: qualidade ajustável (sombra, resolução, textura, FPS, lobby). Nada é removido: só baixa a qualidade. */
(function(){
 const touch=('ontouchstart' in window)||navigator.maxTouchPoints>0;
 const PRE={
  alta:  {sh:3,res:3,tx:0,aa:1,fps:60,lb:0,lz:1},
  media: {sh:2,res:2,tx:1,aa:1,fps:60,lb:0,lz:1},
  baixa: {sh:1,res:1,tx:1,aa:0,fps:45,lb:1,lz:0},
  minima:{sh:0,res:0,tx:2,aa:0,fps:30,lb:1,lz:0}
 };
 let g=null;try{g=JSON.parse(localStorage.getItem('gfx')||'null')}catch(e){}
 if(!g||!g.pre)g=Object.assign({pre:touch?'media':'alta',fl:0},touch?PRE.media:PRE.alta);   // 1ª vez: celular começa em MÉDIA
 const save=()=>{try{localStorage.setItem('gfx',JSON.stringify(g))}catch(e){}};
 CAOS.gfx=g;
 // valores derivados (lidos pelo jogo e pelo lobby)
 g.pr=()=>[.75,1,1.25,Math.min(devicePixelRatio||1,2)][g.res];       // resolução da partida (pixel ratio)
 g.lobW=()=>[640,800,1000,1200][g.res];                              // largura do canvas do lobby (16:9)
 g.tk=()=>[1,.5,.25][g.tx];                                          // escala das texturas
 g.an=()=>[4,2,1][g.tx];                                             // anisotropia
 g.smap=()=>[0,512,1024,1536][g.sh];                                 // tamanho do mapa de sombra
 g.iv=()=>1000/g.fps;
 // contador de FPS opcional
 let n=0,t0=performance.now(),el=null;
 CAOS.gfxTick=()=>{if(!g.fl)return;n++;const t=performance.now();if(t-t0>=1000){if(!el){el=document.createElement('div');el.style.cssText='position:absolute;left:50%;top:1px;transform:translateX(-50%);z-index:99;font:bold 9px monospace;color:#7dff7d;background:#000a;padding:1px 4px;pointer-events:none';const s=document.getElementById('stage');(s||document.body).appendChild(el)}el.textContent=Math.round(n*1000/(t-t0))+' FPS';n=0;t0=t}};
 window.openGfx=function(){
  const O=(l,k,o)=>`<div class="cr"><span>${l}</span><select data-g="${k}">${o.map(([v,nm])=>`<option value="${v}"${String(g[k])===String(v)?' selected':''}>${nm}</option>`).join('')}</select></div>`;
  open('<h2>GRÁFICOS</h2><div class="cs">PREDEFINIÇÃO</div>'+
   O('Qualidade geral','pre',[['alta','Alta (original)'],['media','Média'],['baixa','Baixa'],['minima','Mínima'],['custom','Personalizada']])+
   '<div class="cs">PARTIDA</div>'+
   O('Sombras','sh',[[3,'Alta'],[2,'Média'],[1,'Baixa'],[0,'Desligadas']])+
   O('Resolução','res',[[3,'Alta (nítida)'],[2,'Média'],[1,'Baixa'],[0,'Mínima']])+
   O('Texturas (chão/paredes)','tx',[[0,'Alta (original)'],[1,'Média'],[2,'Baixa']])+
   O('Suavização de bordas','aa',[[1,'Ligada'],[0,'Desligada']])+
   O('Limite de FPS','fps',[[60,'60'],[45,'45'],[30,'30']])+
   '<div class="cs">LOBBY</div>'+
   O('Lobby 3D','lb',[[0,'Completo'],[1,'Leve'],[2,'Desligado (fundo 2D)']])+
   '<div class="cs">OUTROS</div>'+
   O('Mostrar FPS','fl',[[0,'Não'],[1,'Sim']])+
   '<div style="font-size:11px;opacity:.8;margin:6px 0">Partida: vale na próxima partida. Lobby, suavização e texturas: tocar em REABRIR.</div>'+
   '<button class="btn" id="gre">REABRIR O JOGO (aplicar tudo)</button>');
  card.querySelectorAll('[data-g]').forEach(el=>el.onchange=()=>{
   const k=el.dataset.g,v=isNaN(+el.value)?el.value:+el.value;
   if(k==='pre'){if(PRE[v])Object.assign(g,PRE[v]);g.pre=v;save();openGfx();return}
   g[k]=v;if(k!=='fl')g.pre='custom';else if(!v){const e=document.querySelector('#stage>div[style*="monospace"]');if(e)e.remove()}save();
   if(k!=='fl')openGfx();
  });
  $('#gre').onclick=()=>{save();location.reload()};
 };
})();
