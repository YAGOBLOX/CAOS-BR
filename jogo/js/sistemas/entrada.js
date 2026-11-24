/* CAOS BR FPS · controles: toque, mouse, teclado, botão de tiro, sair */
const fbt=$('#fbtn');
// ===== controles =====
function pos(e){const r=cv.getBoundingClientRect();return rot?[(e.clientY-r.top)/r.height*800,(r.right-e.clientX)/r.width*450]:[(e.clientX-r.left)/r.width*800,(e.clientY-r.top)/r.height*450]}
cv.addEventListener('pointerdown',e=>{if(!G)return;const[x,y]=pos(e);cv.setPointerCapture(e.pointerId);
 if(e.pointerType==='mouse'){aim=e.pointerId;fire=true;return}
 if(x<400&&!joy)joy={id:e.pointerId,x,y};else if(aim===null){aim=e.pointerId;lx=x;ly=y}});
cv.addEventListener('pointermove',e=>{if(!G)return;const[x,y]=pos(e);
 if(e.pointerType==='mouse'){if(e.buttons){ang+=e.movementX*.006*sn();pit=cp(pit-e.movementY*.005*S.vs*sn()*(S.inv?-1:1))}return}
 if(joy&&e.pointerId===joy.id){   // analógico: a bolinha anda até 45; passou disso, a base SEGUE o dedo
  let dx=x-joy.x,dy=y-joy.y;const l=Math.hypot(dx,dy);
  if(l>45){const k=(l-45)/l;joy.x=cl(joy.x+dx*k,50,380);joy.y=cl(joy.y+dy*k,110,425);dx=x-joy.x;dy=y-joy.y}
  const m=Math.hypot(dx,dy)/45;jx=m>1?dx/(m*45):dx/45;jy=m>1?dy/(m*45):dy/45}
 else if(e.pointerId===aim){ang+=(x-lx)*.008*sn();pit=cp(pit-(y-ly)*.006*S.vs*sn()*(S.inv?-1:1));lx=x;ly=y}});
const up=e=>{if(joy&&e.pointerId===joy.id){joy=null;jx=jy=0}if(e.pointerId===aim){aim=null;fire=false}};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
tap('#wsw',swp);tap('#rld',rel);tap('#jmp',jump);tap('#cro',()=>stance(1));tap('#prn',()=>stance(2));
$('#game').addEventListener('contextmenu',e=>e.preventDefault());
const kd=(e,v)=>{if(/INPUT|SELECT/.test(e.target.tagName))return;const k=e.key.toLowerCase();
 if(k.length===1&&'wasd'.includes(k))keys[k]=v;
 if(e.key.startsWith('Arrow'))keys[e.key]=v;
 if(e.key===' ')fb=!!v;
 if(!v)return;
 if(k==='q')swp();if(k==='r')rel();if(k==='e')jump();if(k==='c')stance(1);if(k==='z')stance(2);
 if(G&&!G.over&&k.length===1&&'123456'.includes(k)&&lst()[+k-1]!=null){G.p.w=lst()[+k-1];G.p.rl=0}};
addEventListener('keydown',e=>kd(e,1));addEventListener('keyup',e=>kd(e,0));
tap('#aimb',()=>{zoom=!zoom});
tap('#smile',()=>{if(G)G.emo=G.t+2});
// ===== botão de ATIRAR analógico: fica FIXO; o dedo pode arrastar (vira a câmera) sem parar de atirar =====
// A bolinha interna (.fk) acompanha o dedo só até um limite e volta ao centro ao soltar.
const fk=$('#fbtn .fk');let fKx=0,fKy=0;
const fKnob=(dx,dy)=>{fk.style.transform='translate('+dx+'px,'+dy+'px)'};
fbt.addEventListener('pointerdown',e=>{e.preventDefault();fb=true;fid=e.pointerId;fpx=e.clientX;fpy=e.clientY;fk.style.transition='none';try{fbt.setPointerCapture(e.pointerId)}catch(_){}});
// escuta na janela inteira: continua atirando e girando mesmo que o dedo saia de cima do botão
addEventListener('pointermove',e=>{if(e.pointerId!==fid)return;const rr=cv.getBoundingClientRect(),ddx=e.clientX-fpx,ddy=e.clientY-fpy,sx=rot?ddy*800/rr.height:ddx*800/rr.width,sy=rot?-ddx*450/rr.width:ddy*450/rr.height;
 ang+=sx*.008*sn();pit=cp(pit-sy*.006*S.vs*sn()*(S.inv?-1:1));fpx=e.clientX;fpy=e.clientY;
 const[x,y]=pos(e);let dx=x-(fbt.offsetLeft+fbt.offsetWidth/2),dy=y-(fbt.offsetTop+fbt.offsetHeight/2);const R=fbt.offsetWidth*.3,l=Math.hypot(dx,dy);if(l>R){dx*=R/l;dy*=R/l}fKnob(dx,dy)});
const fEnd=e=>{if(e.pointerId!==fid)return;fb=false;fid=null;fk.style.transition='transform .12s';fKnob(0,0)};
addEventListener('pointerup',fEnd);addEventListener('pointercancel',fEnd);
// o navegador não pode "roubar" o toque para rolar/dar zoom (isso interrompia o tiro)
addEventListener('touchmove',e=>{if(e.cancelable)e.preventDefault()},{passive:false});
$('#quit').onclick=()=>{G=null;$('#game').style.display='none';ov.classList.remove('on')};
