/* CAOS BR FPS · TRANSIÇÃO de carregamento (v43): lobby → partida. É a própria tela de carregamento, não um enfeite de tempo fixo.
   Um canvas 2D leve por cima do lobby: faixas de neon fecham a tela → rajada de tiros (clarão no cano, rastros, faíscas, furos) → clarão →
   título "CAOS BR FPS" + barra. Depois da abertura ela FICA em loop (novas rajadas, furos antigos somem) até o carregamento terminar.
   Só sai quando: pronto() é verdadeiro E já passou o tempo mínimo E a barra chegou ao fim. Nunca some antes; se tudo carrega rápido, espera só o
   mínimo (para ser vista); se carrega devagar, espera o necessário; se passar do tempo máximo, sai assim mesmo (fim(false)).
   Uso: CAOS.transicao({progresso:()=>0..1, pronto:()=>bool, fim:ok=>{}, minimo:3.2, maximo:25}) → {cancelar()}.
   Quem decide o que é "carregar" é js/lobby/partida.js (lista de tarefas). Sem imagens, sem áudio, sem bibliotecas. */
CAOS.transicao=function(o){
 o=o||{};const st=document.getElementById('stage');
 const MIN=o.minimo||3.2,MAX=o.maximo||25,prog=o.progresso||(()=>1),pronto=o.pronto||(()=>true);
 let fim0=false;const acabou=ok=>{if(fim0)return;fim0=true;o.fim&&o.fim(ok)};
 if(!st||document.getElementById('trans')){acabou(true);return{cancelar(){}}}
 const cv=document.createElement('canvas');cv.id='trans';cv.width=800;cv.height=450;st.appendChild(cv);
 const x=cv.getContext('2d'),W=800,H=450;
 // tiros: cano na parte de baixo à direita, alvos perto do centro (como se mirasse no meio da tela)
 const MX=690,MY=392,shots=[],holes=[],sparks=[];
 let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
 const tiro=t0=>shots.push({t0,tx:300+rnd()*220,ty:130+rnd()*170,hit:false});
 for(let i=0;i<9;i++)tiro(.42+i*.115+(i>5?.05:0));
 let proxRaj=2.0;   // próximas rajadas (de 3 tiros) enquanto espera o carregamento
 const ease=v=>v<0?0:v>1?1:v*v*(3-2*v),lin=(v,a,b)=>Math.max(0,Math.min(1,(v-a)/(b-a)));
 let t0=null,tp=0,disp=0,te=null,cancel=false,tLento=0;
 function frame(ts){
  if(cancel)return;
  if(t0===null){t0=ts;tp=ts}
  const t=(ts-t0)/1000,dt=Math.min(.1,(ts-tp)/1000);tp=ts;
  // ---- estado do carregamento ----
  const ok=!!pronto(),real=Math.max(0,Math.min(1,+prog()||0));
  // a barra mostra o progresso real (até ~96%) com um avanço lento de segurança para não parecer travada; só chega a 100% quando está pronto
  const alvo=ok?1:Math.min(.96,Math.max(real*.94,disp))+(!ok&&disp<.94?dt*.015:0);
  disp+=(alvo-disp)*Math.min(1,dt*(ok?7:3));
  if(!ok&&disp>.96)disp=.96;
  if(te===null&&ok&&t>=MIN&&disp>.985)te=t;                       // pode sair
  if(te===null&&t>=MAX){te=t;tLento=1}                            // tempo máximo: sai mesmo assim
  if(t>.45&&CAOS.lobby)CAOS.lobby.paused=true;                    // a tela já está coberta: poupa a GPU para o carregamento
  // novas rajadas enquanto carrega
  if(te===null&&t>=proxRaj){for(let i=0;i<3;i++)tiro(t+i*.12);proxRaj=t+1.3+rnd()*.5}
  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,H);
  let sx=0,sy=0;for(const s of shots){const k=t-s.t0;if(k>=0&&k<.09){sx+=(rnd()-.5)*7;sy+=(rnd()-.5)*5}}
  x.translate(sx,sy);
  // 1) faixas de neon fecham a tela (0 → .38 s); depois ficam como fundo escuro
  const c=ease(lin(t,0,.38));
  if(c>0){   // duas faixas com a MESMA inclinação: fecham juntas numa diagonal só, sem sobrar vão
   const SL=140,xe=W/2+70,xl=-260+(xe+260)*c,xr=W+260+(xe-W-260)*c;
   x.fillStyle='rgba(8,5,16,'+(.98*Math.min(1,c*1.5))+')';
   x.beginPath();x.moveTo(-80,0);x.lineTo(xl,0);x.lineTo(xl-SL,H);x.lineTo(-80,H);x.fill();
   x.beginPath();x.moveTo(W+80,0);x.lineTo(xr,0);x.lineTo(xr-SL,H);x.lineTo(W+80,H);x.fill();
   if(c<1){x.strokeStyle='#ffc21a';x.lineWidth=4;x.shadowColor='#ff9a1a';x.shadowBlur=12;
    x.beginPath();x.moveTo(xl,0);x.lineTo(xl-SL,H);x.moveTo(xr,0);x.lineTo(xr-SL,H);x.stroke();x.shadowBlur=0}
  }
  if(t>=.3){
   const g=x.createRadialGradient(W/2,H/2,40,W/2,H/2,W*.62);g.addColorStop(0,'rgba(40,22,10,0)');g.addColorStop(1,'rgba(0,0,0,.55)');
   x.fillStyle=g;x.fillRect(-10,-10,W+20,H+20);
   // 2) furos de bala (os antigos esmaecem e saem; no máximo 16 na tela)
   while(holes.length>16)holes.shift();
   for(let i=holes.length-1;i>=0;i--){const h=holes[i],age=t-h.t;if(age>4.2){holes.splice(i,1);continue}
    const a=Math.min(1,age/.05),f=1-lin(age,3.2,4.2);x.save();x.globalAlpha=f;x.translate(h.x,h.y);x.rotate(h.r);
    x.fillStyle='rgba(0,0,0,.85)';x.beginPath();x.arc(0,0,4.2*a+1,0,6.3);x.fill();
    x.strokeStyle='rgba(255,190,90,'+.55*a+')';x.lineWidth=1.2;x.beginPath();x.arc(0,0,6.5*a,0,6.3);x.stroke();
    x.strokeStyle='rgba(0,0,0,.55)';x.lineWidth=1.3;for(let k=0;k<6;k++){const an=k*1.05+h.r;x.beginPath();x.moveTo(Math.cos(an)*5,Math.sin(an)*5);x.lineTo(Math.cos(an)*(11+h.l[k]*9),Math.sin(an)*(11+h.l[k]*9));x.stroke()}x.restore()}
   // 3) rastros dos tiros + clarão do cano
   for(let i=shots.length-1;i>=0;i--){const s=shots[i];
    const k=t-s.t0;if(k<0)continue;if(k>.5){shots.splice(i,1);continue}
    if(k<.085){
     const p=Math.min(1,k/.07),hx=MX+(s.tx-MX)*p,hy=MY+(s.ty-MY)*p,q=Math.max(0,p-.35),qx=MX+(s.tx-MX)*q,qy=MY+(s.ty-MY)*q;
     const gr=x.createLinearGradient(qx,qy,hx,hy);gr.addColorStop(0,'rgba(255,170,40,0)');gr.addColorStop(1,'rgba(255,245,200,1)');
     x.strokeStyle=gr;x.lineWidth=3.2;x.lineCap='round';x.beginPath();x.moveTo(qx,qy);x.lineTo(hx,hy);x.stroke();
     x.fillStyle='#fff';x.beginPath();x.arc(hx,hy,2.4,0,6.3);x.fill();
    }
    if(k>=.07&&!s.hit){s.hit=true;holes.push({x:s.tx,y:s.ty,r:rnd()*6.3,t,l:[rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]});for(let n=0;n<12;n++){const an=rnd()*6.3,v=60+rnd()*160;sparks.push({x:s.tx,y:s.ty,vx:Math.cos(an)*v,vy:Math.sin(an)*v-30,t})}}
    if(k<.075){
     const a=1-k/.075,r=34+a*30;x.globalCompositeOperation='lighter';
     const f=x.createRadialGradient(MX,MY,2,MX,MY,r);f.addColorStop(0,'rgba(255,250,220,'+a+')');f.addColorStop(.35,'rgba(255,170,40,'+a*.8+')');f.addColorStop(1,'rgba(255,90,0,0)');
     x.fillStyle=f;x.fillRect(MX-r,MY-r,r*2,r*2);
     x.strokeStyle='rgba(255,220,140,'+a+')';x.lineWidth=2;for(let n=0;n<5;n++){const an=-2.6+n*.22;x.beginPath();x.moveTo(MX,MY);x.lineTo(MX+Math.cos(an)*r*1.5,MY+Math.sin(an)*r*1.5);x.stroke()}
     x.globalCompositeOperation='source-over';
    }
   }
   // cano da arma (silhueta) saindo do canto
   x.fillStyle='#07060c';x.beginPath();x.moveTo(MX+8,MY+4);x.lineTo(MX-120,MY+60);x.lineTo(W+20,H+20);x.lineTo(W+20,MY+40);x.closePath();x.fill();
   x.strokeStyle='#ffc21a';x.lineWidth=1.5;x.globalAlpha=.7;x.beginPath();x.moveTo(MX+8,MY+4);x.lineTo(W+20,MY+40);x.stroke();x.globalAlpha=1;
   // faíscas
   x.globalCompositeOperation='lighter';
   for(let i=sparks.length-1;i>=0;i--){const p=sparks[i],k=t-p.t;if(k>.35){sparks.splice(i,1);continue}if(k<0)continue;
    const a=1-k/.35;x.fillStyle='rgba(255,'+(170+60*a|0)+',60,'+a+')';x.fillRect(p.x+p.vx*k,p.y+p.vy*k+300*k*k,2.4,2.4)}
   x.globalCompositeOperation='source-over';
  }
  // 4) clarão branco-alaranjado da abertura (1.28 → 1.75 s)
  const fl=lin(t,1.28,1.42)*(1-lin(t,1.42,1.75));
  if(fl>0){x.fillStyle='rgba(255,236,190,'+fl+')';x.fillRect(-10,-10,W+20,H+20)}
  // 5) título + barra de carregamento (1.45 s em diante; fica até acabar)
  if(t>1.45){
   const a=ease(lin(t,1.45,1.8)),s=1.25-.25*a;
   x.save();x.translate(W/2,H/2-14);x.scale(s,s);x.globalAlpha=a;x.font='800 64px "Barlow Condensed",Impact,"Arial Narrow",sans-serif';x.textAlign='center';x.textBaseline='middle';
   x.shadowColor='#ff9a1a';x.shadowBlur=22;x.fillStyle='#ffc21a';x.fillText('CAOS BR FPS',0,0);x.shadowBlur=0;
   x.lineWidth=2;x.strokeStyle='#fff';x.strokeText('CAOS BR FPS',0,0);
   x.fillStyle='#ffc21a';x.fillRect(-170,36,340,3);
   x.restore();
   x.globalAlpha=a;
   x.fillStyle='rgba(255,255,255,.14)';x.fillRect(W/2-150,H/2+58,300,7);
   x.fillStyle='#ffc21a';x.fillRect(W/2-150,H/2+58,300*disp,7);
   if(disp>.02){x.fillStyle='#fff3c4';x.fillRect(W/2-150+300*disp-2,H/2+56,3,11)}
   x.font='700 13px "Barlow Condensed",Arial,sans-serif';x.fillStyle='#e8dcc0';x.textAlign='center';
   x.fillText((ok?'PRONTO!':'CARREGANDO… '+Math.round(disp*100)+'%'),W/2,H/2+84);
   x.globalAlpha=1;
  }
  // 6) saída: clarão curto e some (0,45 s depois de poder sair)
  if(te!==null){
   const k=t-te,f=lin(k,0,.18)*(1-lin(k,.18,.4)*.0);
   x.fillStyle='rgba(255,236,190,'+f*.9+')';x.fillRect(-10,-10,W+20,H+20);
   cv.style.opacity=1-lin(k,.2,.45);
   if(k>=.45){cv.remove();if(CAOS.lobby)CAOS.lobby.paused=false;acabou(!tLento);return}
  }
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
 return{cancelar(){cancel=true;cv.remove();if(CAOS.lobby)CAOS.lobby.paused=false;acabou(false)}};
};
