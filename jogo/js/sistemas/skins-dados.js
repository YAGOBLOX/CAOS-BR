/* CAOS BR FPS · SKINS (conjuntos completos) — lista, escolha do jogador e menu SKINS do lobby
   COMO ADICIONAR UMA SKIN (só o dono faz isso, mexendo nos arquivos; o jogador NÃO envia skins):
   1) Ponha a imagem em jogo/img/skins/<id>.png (skin do Minecraft 64x64, ou 64x32 antiga) e acrescente UMA linha em CAOS.SKINS abaixo:
      {id:'<id>',n:'NOME',tipo:'mc',tex:'img/skins/<id>.png',pr:0}
   2) 'pr' = PREÇO em moedas (0 = grátis). Hoje todas são grátis; o preço já aparece no card. A compra ainda NÃO existe (ver skinHave()).
   3) tipo 'xbot' = modelo 3D com roupa feita no código (Samurai Oni). tipo 'mc' = boneco de blocos com a imagem da skin.
   A skin escolhida fica em localStorage 'sk' = {s:id da skin, o:[ids comprados]}. Nunca reordene/apague ids que já foram usados. */
CAOS.SKINS=[
 {id:'oni',n:'SAMURAI ONI',tipo:'xbot',pv:'img/skins/oni.png',pr:0},
 {id:'skin1',n:'SKIN 1',tipo:'mc',tex:'img/skins/skin1.png',pr:0}
];
(function(){
 let sel='oni',ownS=[];
 try{const s=JSON.parse(localStorage.getItem('sk')||'{}');if(typeof s.s==='string')sel=s.s;if(Array.isArray(s.o))ownS=s.o}catch(e){}
 if(!CAOS.SKINS.some(s=>s.id===sel))sel=CAOS.SKINS[0].id;
 const save=()=>{try{localStorage.setItem('sk',JSON.stringify({s:sel,o:ownS}))}catch(e){}};
 const have=s=>!(s.pr>0)||ownS.includes(s.id);   // FUTURO: preço > 0 só vale depois de comprada (ownS)
 CAOS.skinCur=()=>CAOS.SKINS.find(s=>s.id===sel)||CAOS.SKINS[0];
 CAOS.skinTex={};
 // carrega a imagem da skin escolhida (precisa do three.js). Se falhar, o jogo usa o modelo Xbot.
 CAOS.loadSkinTex=()=>{const s=CAOS.skinCur();
  if(s.tipo!=='mc'||CAOS.skinTex[s.id]||typeof THREE==='undefined')return Promise.resolve();
  return new Promise(ok=>new THREE.TextureLoader().load(s.tex+'?v='+CAOS.ver,t=>{
   t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;
   try{const im=t.image;if(im.height===64){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.drawImage(im,0,0);s.slim=x.getImageData(51,17,1,1).data[3]===0}}catch(e){}
   CAOS.skinTex[s.id]=t;ok()},undefined,()=>ok()));
 };
 const imgs={};
 const prev=(cv,s)=>{const x=cv.getContext('2d');x.imageSmoothingEnabled=false;
  if(s.tipo!=='mc'){const i=new Image();i.onload=()=>{cv.width=48;cv.height=96;cv.getContext('2d').drawImage(i,0,0,48,96)};i.src=s.pv;return}
  const draw=im=>{const d=(sx,sy,w,h,dx,dy)=>x.drawImage(im,sx,sy,w,h,dx,dy,w,h),n=im.height>=64;
   d(4,20,4,12,4,20);d(n?20:4,n?52:20,4,12,8,20);d(20,20,8,12,4,8);d(44,20,4,12,0,8);d(n?36:44,n?52:20,4,12,12,8);d(8,8,8,8,4,0);
   if(n){d(20,36,8,12,4,8);d(4,36,4,12,4,20);d(4,52,4,12,8,20);d(44,36,4,12,0,8);d(52,52,4,12,12,8)}d(40,8,8,8,4,0)};
  if(imgs[s.id]&&imgs[s.id].complete)return draw(imgs[s.id]);
  const i=imgs[s.id]=new Image();i.onload=()=>draw(i);i.src=s.tex};
 window.openSkins=function(msg){
  const cur=CAOS.skinCur();
  open('<h2>SKINS</h2><div class="cs">'+(msg||'Cada skin é um conjunto completo. Toque para usar.')+'</div><div class="skg">'+CAOS.SKINS.map(s=>{
   const on=s.id===cur.id,h=have(s);
   return `<div class="sk${on?' on':''}"><canvas class="skp" width="16" height="32" data-s="${s.id}"></canvas><b>${s.n}</b><small>${s.pr>0?'🪙 '+s.pr:'GRÁTIS'}</small>`+
    (on?'<button class="btn wb on" disabled>✓ EM USO</button>':h?`<button class="btn wb" data-u="${s.id}">USAR</button>`:'<button class="btn wb" disabled>EM BREVE</button>')+'</div>';
  }).join('')+'</div>');
  card.querySelectorAll('.skp').forEach(c=>prev(c,CAOS.SKINS.find(s=>s.id===c.dataset.s)));
  card.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{
   const s=CAOS.SKINS.find(z=>z.id===b.dataset.u);if(!s||!have(s))return;sel=s.id;save();
   openSkins('Skin equipada: '+s.n);
   Promise.resolve(CAOS.loadSkinTex()).then(()=>{if(window.heroRefresh)heroRefresh()});
  });
 };
})();
