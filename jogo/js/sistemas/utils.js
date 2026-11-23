/* CAOS BR FPS · utilidades básicas: seletor $, escala do palco, cl/cp, tap, orientação */
const $=s=>document.querySelector(s),stage=$('#stage');
let rot=false;
function fit(){rot=innerHeight>innerWidth*1.05;const s=rot?Math.min(innerHeight/800,innerWidth/450):Math.min(innerWidth/800,innerHeight/450);stage.style.transform=(rot?'rotate(90deg) ':'')+'scale('+s+')'}
addEventListener('resize',fit);fit();
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),cp=v=>cl(v,-.5,.9);
const tap=(s,f)=>$(s).addEventListener('pointerdown',e=>{e.preventDefault();f()});
addEventListener('orientationchange',()=>{setTimeout(fit,150);setTimeout(fit,500)});
addEventListener('pointerdown',()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}},{once:true});
