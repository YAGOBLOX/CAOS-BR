/* CAOS BR FPS · utilidades básicas: seletor $, escala do palco, cl/cp, tap, orientação */
const $=s=>document.querySelector(s),stage=$('#stage');
let rot=false;
/* TELA ESTICADA (NÃO VOLTAR PARA "scale uniforme"): o palco 800x450 é esticado nos dois eixos
   (scaleX e scaleY separados) para PREENCHER A TELA INTEIRA, sem faixas pretas nas laterais.
   Se o celular estiver em pé (rot), o palco gira 90° e continua preenchendo tudo.
   Os toques usam getBoundingClientRect (entrada.js), então continuam alinhados com a escala esticada. */
function fit(){rot=innerHeight>innerWidth*1.05;const sx=rot?innerHeight/800:innerWidth/800,sy=rot?innerWidth/450:innerHeight/450;stage.style.transform=(rot?'rotate(90deg) ':'')+'scale('+sx+','+sy+')'}
addEventListener('resize',fit);fit();
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),cp=v=>cl(v,-.5,.9);
const tap=(s,f)=>$(s).addEventListener('pointerdown',e=>{e.preventDefault();f()});
addEventListener('orientationchange',()=>{setTimeout(fit,150);setTimeout(fit,500)});
addEventListener('pointerdown',()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}},{once:true});
