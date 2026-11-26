/* CAOS BR FPS · GRÁFICOS: qualidade ajustável. Nada é removido; as texturas NUNCA são reduzidas de tamanho (sem pixelar):
   as versões mais leves usam a MESMA textura com menos contraste, até ficar lisa (cor em degradê). Menu em painel-config.js */
(function(){
 const PRE={
  minima:{sh:0,res:0,tx:0,aa:1,fps:45,lb:1,cd:1},
  baixa: {sh:1,res:1,tx:1,aa:1,fps:45,lb:1,cd:1},
  media: {sh:2,res:2,tx:2,aa:1,fps:60,lb:2,cd:1},
  alta:  {sh:3,res:3,tx:3,aa:1,fps:60,lb:2,cd:1}
 };
 let g=null;try{g=JSON.parse(localStorage.getItem('gfx')||'null')}catch(e){}
 if(!g||g.gv!==2){g=Object.assign({gv:2,pre:'minima',fl:0},PRE.minima);try{localStorage.setItem('gfx',JSON.stringify(g))}catch(e){}}   // começa no MÍNIMO
 CAOS.gfx=g;CAOS.GPRE=PRE;
 g.save=()=>{try{localStorage.setItem('gfx',JSON.stringify(g))}catch(e){}};
 const cap=()=>Math.max(1,Math.min(devicePixelRatio||1,2));
 g.pr=()=>Math.min([1.25,1.5,1.75,2][g.res],cap());      // resolução da partida (pixel ratio; nunca abaixo de 1)
 g.lobW=()=>[800,900,1050,1200][g.res];                   // largura do canvas do lobby (16:9)
 g.smap=()=>[0,512,1024,1536][g.sh];                      // mapa de sombra
 g.iv=()=>1000/g.fps;                                     // intervalo mínimo entre quadros
 g.cdm=()=>[1,1.3,1.6][g.cd]||1;                          // distância da câmera (multiplicador)
 // textura mais leve: mesma imagem, menos contraste (1 baixa, 2 média); 0 = lisa em degradê suave. Tamanho nunca muda.
 CAOS.texLite=function(c){const lv=g.tx;if(lv>=3)return c;
  const x=c.getContext('2d');let s=c,w=c.width,h=c.height;
  while(w>16){w=Math.max(16,w>>1);h=Math.max(16,h>>1);const t=document.createElement('canvas');t.width=w;t.height=h;t.getContext('2d').drawImage(s,0,0,w,h);s=t}
  const d=s.getContext('2d').getImageData(0,0,w,h).data;let r=0,gg=0,b=0;const n=w*h;
  for(let i=0;i<d.length;i+=4){r+=d[i];gg+=d[i+1];b+=d[i+2]}r/=n;gg/=n;b/=n;
  const col=k=>`rgb(${Math.min(255,r*k)|0},${Math.min(255,gg*k)|0},${Math.min(255,b*k)|0})`;
  if(lv===0){const gr=x.createLinearGradient(0,0,0,c.height);for(let i=0;i<=8;i++)gr.addColorStop(i/8,col(1+.04*Math.sin(i/8*6.2832)));x.globalAlpha=1;x.fillStyle=gr;x.fillRect(0,0,c.width,c.height)}   // periódico = sem emenda
  else{x.globalAlpha=lv===1?.65:.35;x.fillStyle=col(1);x.fillRect(0,0,c.width,c.height);x.globalAlpha=1}
  return c};
 // contador de FPS opcional
 let n=0,t0=performance.now(),el=null;
 CAOS.gfxTick=()=>{if(!g.fl){if(el){el.remove();el=null}return}n++;const t=performance.now();if(t-t0>=1000){if(!el){el=document.createElement('div');el.style.cssText='position:absolute;left:50%;top:1px;transform:translateX(-50%);z-index:99;font:bold 9px monospace;color:#7dff7d;background:#000a;padding:1px 4px;pointer-events:none';(document.getElementById('stage')||document.body).appendChild(el)}el.textContent=Math.round(n*1000/(t-t0))+' FPS';n=0;t0=t}};
 window.openGfx=()=>openPanel('gfx');
})();
