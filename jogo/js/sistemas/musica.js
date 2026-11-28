/* CAOS BR FPS · MÚSICA do lobby (v49). Web Audio: a faixa toca em LOOP SEM PAUSA (o silêncio de cada ponta do MP3 é cortado do loop)
   e passa por um limitador, então nunca estoura. Volume 0–100%: com 0 a música PARA e o áudio é liberado (contexto fechado, faixa
   descartada da memória) — não pesa o jogo. Começa sozinha quando o jogo abre (CAOS.musica.iniciar(), em lobby.js); se o navegador
   bloquear o som até o 1º toque, ela começa no 1º toque. Escolha salva em localStorage `mus` = {f:id da faixa, v:volume}.
   Para ADICIONAR uma faixa: ponha o MP3 em audio/ e uma linha em FAIXAS (o menu CONFIGURAÇÕES mostra sozinho). */
CAOS.musica=(function(){
 const FAIXAS=[{id:'natalino',nome:'Espírito Natalino',src:'audio/espirito-natalino.mp3'}];
 const cfg={f:FAIXAS[0].id,v:60};
 try{const s=JSON.parse(localStorage.getItem('mus')||'null');if(s){if(FAIXAS.some(x=>x.id===s.f))cfg.f=s.f;if(typeof s.v==='number'&&isFinite(s.v))cfg.v=Math.max(0,Math.min(100,Math.round(s.v)))}}catch(e){}
 const salvar=()=>{try{localStorage.setItem('mus',JSON.stringify(cfg))}catch(e){}};
 const AC=window.AudioContext||window.webkitAudioContext;
 let ctx=null,gain=null,src=null,ativo=false,tok=0,busy=false,toca=false;const enc={};
 const ganho=v=>Math.pow(v/100,1.6)*.85;   // curva suave; teto 0,85 (+ limitador) para não estourar
 const faixa=()=>FAIXAS.find(x=>x.id===cfg.f)||FAIXAS[0];
 function parar(){
  tok++;toca=false;
  if(src){try{src.stop()}catch(e){}try{src.disconnect()}catch(e){}src=null}
  if(ctx){try{ctx.close()}catch(e){}ctx=null;gain=null}
 }
 function destravar(){   // navegadores só liberam som depois de um toque
  const f=()=>{if(ctx&&ctx.state==='suspended')ctx.resume().catch(()=>{})};
  ['pointerdown','touchend','keydown'].forEach(e=>addEventListener(e,f,{passive:true}));
 }
 async function tocar(){
  if(!AC||!ativo||cfg.v<=0||src||busy)return;
  busy=true;const my=++tok,f=faixa();let c=null;
  try{
   if(!enc[f.id])enc[f.id]=await (await fetch(f.src+'?v='+CAOS.ver)).arrayBuffer();
   if(my!==tok)throw 0;
   c=new AC();
   const buf=await c.decodeAudioData(enc[f.id].slice(0));
   if(my!==tok)throw 0;
   // pontos do loop: pula o silêncio do começo e do fim (senão há uma pausa a cada volta)
   const n=buf.length,th=.0015;let a=0,b=n-1;const ch=[];for(let i=0;i<buf.numberOfChannels;i++)ch.push(buf.getChannelData(i));
   const alto=i=>{for(const d of ch)if(Math.abs(d[i])>th)return true;return false};
   while(a<n-1&&!alto(a))a++;while(b>a&&!alto(b))b--;
   const s=c.createBufferSource();s.buffer=buf;s.loop=true;s.loopStart=a/buf.sampleRate;s.loopEnd=(b+1)/buf.sampleRate;
   const g=c.createGain();g.gain.value=ganho(cfg.v);
   const lim=c.createDynamicsCompressor();lim.threshold.value=-4;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.002;lim.release.value=.1;
   s.connect(g);g.connect(lim);lim.connect(c.destination);
   s.start(0,s.loopStart);
   ctx=c;gain=g;src=s;toca=true;c=null;
   if(ctx.state==='suspended'){ctx.resume().catch(()=>{});destravar()}
  }catch(e){if(e)console.warn('música:',e)}
  if(c){try{c.close()}catch(e){}}
  busy=false;
  if(!src&&ativo&&cfg.v>0&&my!==tok)tocar();   // mudou algo enquanto carregava
 }
 document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden)ctx.suspend().catch(()=>{});else ctx.resume().catch(()=>{})});
 return{
  FAIXAS,
  get faixaId(){return cfg.f},get volume(){return cfg.v},get tocando(){return toca},
  iniciar(){ativo=true;tocar()},
  setVolume(v){cfg.v=Math.max(0,Math.min(100,Math.round(+v||0)));salvar();
   if(cfg.v<=0)parar();else if(gain)gain.gain.setTargetAtTime(ganho(cfg.v),ctx.currentTime,.03);else tocar()},
  setFaixa(id){if(!FAIXAS.some(x=>x.id===id))return;cfg.f=id;salvar();parar();tocar()}
 };
})();
