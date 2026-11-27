/* CAOS BR FPS · carregador sob demanda: baixa three.js e o boneco do lobby em segundo plano */
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
 CAOS.loadChars=async function(){await script(CAOS.manifest.three);await seq(CAOS.manifest.characters)};   // three.js + boneco e armas do lobby
})();
