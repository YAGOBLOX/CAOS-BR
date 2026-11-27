/* CAOS BR FPS · carregador sob demanda: só baixa o que o mapa e o modo escolhidos precisam */
(function(){
 const cache=new Map();
 function script(src){
  if(cache.has(src)) return cache.get(src);
  const p=new Promise((ok,fail)=>{
   const s=document.createElement('script');s.src=/^https?:/.test(src)?src:src+'?v='+CAOS.ver;s.async=false;
   s.onload=ok;s.onerror=()=>{cache.delete(src);fail(new Error('Não consegui carregar '+src))};
   document.head.appendChild(s);
  });
  cache.set(src,p);return p;
 }
 const seq=async list=>{for(const f of list) await script(f)};   // mantém a ordem
 // modelo 3D do jogador (Xbot, glb). Se falhar (offline), o jogo usa o boneco simples
 CAOS.loadXbot=()=>CAOS.xbotP||(CAOS.xbotP=new Promise(ok=>{setTimeout(()=>ok(false),25000);try{new THREE.GLTFLoader().load('modelos/xbot.glb?v='+CAOS.ver,g=>{CAOS.xbot=g;ok(true)},undefined,()=>ok(false))}catch(e){ok(false)}}));
 CAOS.loadChars=async function(){await script(CAOS.manifest.three);await seq(CAOS.manifest.characters);await CAOS.loadXbot();await CAOS.loadSkinTex()};   // só three.js + personagens (boneco do lobby)
 // Carrega tudo que a partida precisa (cada arquivo só 1 vez; trocar de mapa/modo baixa só o que falta)
 CAOS.load=async function(modeId,mapId){
  const M=CAOS.manifest,mo=M.modes[modeId],ma=M.maps[mapId];
  if(!mo||!ma) throw new Error('Modo/mapa inexistente: '+modeId+' / '+mapId);
  await Promise.all([script(M.three),seq(M.game),seq(M.characters),seq(ma.files),seq(mo.files)]);
  await CAOS.loadXbot();await CAOS.loadSkinTex();
  if(CAOS.maps[mapId]&&CAOS.maps[mapId].preload)await CAOS.maps[mapId].preload();   // mapas com modelo GLB baixam o arquivo aqui (só ao escolher o mapa)
  if(!CAOS.maps[mapId]||!CAOS.modes[modeId]) throw new Error('Arquivo do mapa/modo não registrou '+mapId+'/'+modeId);
 };
})();
