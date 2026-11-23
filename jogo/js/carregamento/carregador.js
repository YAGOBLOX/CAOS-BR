/* CAOS BR FPS · carregador sob demanda: só baixa o que o mapa e o modo escolhidos precisam */
(function(){
 const cache=new Map();
 function script(src){
  if(cache.has(src)) return cache.get(src);
  const p=new Promise((ok,fail)=>{
   const s=document.createElement('script');s.src=src;s.async=false;
   s.onload=ok;s.onerror=()=>{cache.delete(src);fail(new Error('Não consegui carregar '+src))};
   document.head.appendChild(s);
  });
  cache.set(src,p);return p;
 }
 const seq=async list=>{for(const f of list) await script(f)};   // mantém a ordem
 // Carrega tudo que a partida precisa (cada arquivo só 1 vez; trocar de mapa/modo baixa só o que falta)
 CAOS.load=async function(modeId,mapId){
  const M=CAOS.manifest,mo=M.modes[modeId],ma=M.maps[mapId];
  if(!mo||!ma) throw new Error('Modo/mapa inexistente: '+modeId+' / '+mapId);
  await Promise.all([script(M.three),seq(M.game),seq(M.characters),seq(ma.files),seq(mo.files)]);
  if(!CAOS.maps[mapId]||!CAOS.modes[modeId]) throw new Error('Arquivo do mapa/modo não registrou '+mapId+'/'+modeId);
 };
})();
