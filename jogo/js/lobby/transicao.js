/* CAOS BR FPS · TRANSIÇÃO do DECOLAR (v42): lobby → partida, em ~2,4 s, só com desenho 2D leve (um canvas por cima do lobby).
   Sequência: faixas de neon fecham a tela → rajada de tiros com clarão no cano, rastros, faíscas e furos de bala → clarão branco →
   título "CAOS BR FPS" com barra de carregamento. Termina chamando done(). Sem imagens, sem áudio, sem bibliotecas. */
CAOS.transicao=function(done){
 const st=document.getElementById('stage');if(!st||document.getElementById('trans')){done&&done();return}
 const cv=document.createElement('canvas');cv.id='trans';cv.width=800;cv.height=450;st.appendChild(cv);
 const x=cv.getContext('2d'),W=800,H=450,T=2.5;
 if(CAOS.lobby)CAOS.lobby.paused=false;
 // tiros: cano na parte de baixo à direita, alvos perto do centro (como se mirasse no meio da tela)
 const MX=690,MY=392,shots=[],holes=[],sparks=[];
 let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
 for(let i=0;i<9;i++){const t0=.42+i*.115+(i>5?.05:0);shots.push({t0,tx:330+rnd()*170+(i%3)*10,ty:150+rnd()*130,hit:false})}
 const ease=v=>v<0?0:v>1?1:v*v*(3-2*v),lin=(v,a,b)=>Math.max(0,Math.min(1,(v-a)/(b-a)));
 let t0=null,fin=false;
 function frame(ts){
  if(t0===null)t0=ts;const t=(ts-t0)/1000;
  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,H);
  // tremor da tela a cada tiro
  let sx=0,sy=0;for(const s of shots){const k=t-s.t0;if(k>=0&&k<.09){sx+=(rnd()-.5)*7;sy+=(rnd()-.5)*5}}
  x.translate(sx,sy);
  // 1) faixas de neon fecham a tela (0 → .38 s)
  const c=ease(lin(t,0,.38));
  if(c>0){   // duas faixas com a MESMA inclinação: fecham juntas numa diagonal só, sem sobrar vão
   const SL=140,xe=W/2+70,xl=-260+(xe+260)*c,xr=W+260+(xe-W-260)*c;   // xl/xr = onde a borda de cada faixa cruza o topo da tela
   x.fillStyle='rgba(8,5,16,'+(.96*Math.min(1,c*1.5))+')';
   x.beginPath();x.moveTo(-80,0);x.lineTo(xl,0);x.lineTo(xl-SL,H);x.lineTo(-80,H);x.fill();
   x.beginPath();x.moveTo(W+80,0);x.lineTo(xr,0);x.lineTo(xr-SL,H);x.lineTo(W+80,H);x.fill();
   if(c<1){x.strokeStyle='#ffc21a';x.lineWidth=4;x.shadowColor='#ff9a1a';x.shadowBlur=12;
    x.beginPath();x.moveTo(xl,0);x.lineTo(xl-SL,H);x.moveTo(xr,0);x.lineTo(xr-SL,H);x.stroke();x.shadowBlur=0}
  }
  if(t>=.3){
   // fundo escuro com vinheta quente
   const g=x.createRadialGradient(W/2,H/2,40,W/2,H/2,W*.62);g.addColorStop(0,'rgba(40,22,10,0)');g.addColorStop(1,'rgba(0,0,0,.55)');
   x.fillStyle=g;x.fillRect(-10,-10,W+20,H+20);
   // 2) furos de bala (ficam na tela)
   for(const h of holes){const a=Math.min(1,(t-h.t)/.05);x.save();x.translate(h.x,h.y);x.rotate(h.r);
    x.fillStyle='rgba(0,0,0,.85)';x.beginPath();x.arc(0,0,4.2*a+1,0,6.3);x.fill();
    x.strokeStyle='rgba(255,190,90,'+.55*a+')';x.lineWidth=1.2;x.beginPath();x.arc(0,0,6.5*a,0,6.3);x.stroke();
    x.strokeStyle='rgba(0,0,0,.55)';x.lineWidth=1.3;for(let k=0;k<6;k++){const an=k*1.05+h.r;x.beginPath();x.moveTo(Math.cos(an)*5,Math.sin(an)*5);x.lineTo(Math.cos(an)*(11+h.l[k]*9),Math.sin(an)*(11+h.l[k]*9));x.stroke()}x.restore()}
   // 3) rastros dos tiros + clarão do cano
   for(const s of shots){
    const k=t-s.t0;if(k<0)continue;
    if(k<.085){   // rastro: da boca do cano até o alvo, cabeça rápida e cauda que apaga
     const p=Math.min(1,k/.07),hx=MX+(s.tx-MX)*p,hy=MY+(s.ty-MY)*p,tp=Math.max(0,p-.35),tx=MX+(s.tx-MX)*tp,ty=MY+(s.ty-MY)*tp;
     const gr=x.createLinearGradient(tx,ty,hx,hy);gr.addColorStop(0,'rgba(255,170,40,0)');gr.addColorStop(1,'rgba(255,245,200,1)');
     x.strokeStyle=gr;x.lineWidth=3.2;x.lineCap='round';x.beginPath();x.moveTo(tx,ty);x.lineTo(hx,hy);x.stroke();
     x.fillStyle='#fff';x.beginPath();x.arc(hx,hy,2.4,0,6.3);x.fill();
    }
    if(k>=.07&&!s.hit){s.hit=true;holes.push({x:s.tx,y:s.ty,r:rnd()*6.3,t,l:[rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]});for(let n=0;n<12;n++){const an=rnd()*6.3,v=60+rnd()*160;sparks.push({x:s.tx,y:s.ty,vx:Math.cos(an)*v,vy:Math.sin(an)*v-30,t})}}
    if(k<.075){   // clarão no cano (aditivo)
     const a=1-k/.075,r=34+a*30;x.globalCompositeOperation='lighter';
     const f=x.createRadialGradient(MX,MY,2,MX,MY,r);f.addColorStop(0,'rgba(255,250,220,'+a+')');f.addColorStop(.35,'rgba(255,170,40,'+a*.8+')');f.addColorStop(1,'rgba(255,90,0,0)');
     x.fillStyle=f;x.fillRect(MX-r,MY-r,r*2,r*2);
     x.strokeStyle='rgba(255,220,140,'+a+')';x.lineWidth=2;for(let n=0;n<5;n++){const an=-2.6+n*.22;x.beginPath();x.moveTo(MX,MY);x.lineTo(MX+Math.cos(an)*r*1.5,MY+Math.sin(an)*r*1.5);x.stroke()}
     x.globalCompositeOperation='source-over';
    }
   }
   // cano da arma (silhueta) saindo do canto
   x.fillStyle='#07060c';x.beginPath();x.moveTo(MX+8,MY+4);x.lineTo(MX-120+0,MY+60);x.lineTo(W+20,H+20);x.lineTo(W+20,MY+40);x.closePath();x.fill();
   x.strokeStyle='#ffc21a';x.lineWidth=1.5;x.globalAlpha=.7;x.beginPath();x.moveTo(MX+8,MY+4);x.lineTo(W+20,MY+40);x.stroke();x.globalAlpha=1;
   // faíscas
   x.globalCompositeOperation='lighter';
   for(const p of sparks){const k=t-p.t;if(k<0||k>.35)continue;const a=1-k/.35;x.fillStyle='rgba(255,'+(170+60*a|0)+',60,'+a+')';x.fillRect(p.x+p.vx*k,p.y+p.vy*k+300*k*k,2.4,2.4)}
   x.globalCompositeOperation='source-over';
  }
  // 4) clarão branco-alaranjado (1.3 → 1.6 s)
  const fl=lin(t,1.28,1.42)*(1-lin(t,1.42,1.75));
  if(fl>0){x.fillStyle='rgba(255,236,190,'+fl+')';x.fillRect(-10,-10,W+20,H+20)}
  // 5) título + barra de carregamento (1.45 → fim)
  if(t>1.45){
   const a=ease(lin(t,1.45,1.8)),s=1.25-.25*a;
   x.save();x.translate(W/2,H/2-14);x.scale(s,s);x.globalAlpha=a;x.font='800 64px "Barlow Condensed",Impact,"Arial Narrow",sans-serif';x.textAlign='center';x.textBaseline='middle';
   x.shadowColor='#ff9a1a';x.shadowBlur=22;x.fillStyle='#ffc21a';x.fillText('CAOS BR FPS',0,0);x.shadowBlur=0;
   x.lineWidth=2;x.strokeStyle='#fff';x.strokeText('CAOS BR FPS',0,0);
   x.fillStyle='#ffc21a';x.fillRect(-170,36,340,3);
   x.restore();
   const pr=ease(lin(t,1.55,2.3));x.globalAlpha=a;
   x.fillStyle='rgba(255,255,255,.14)';x.fillRect(W/2-150,H/2+58,300,7);
   x.fillStyle='#ffc21a';x.fillRect(W/2-150,H/2+58,300*pr,7);
   x.font='700 13px "Barlow Condensed",Arial,sans-serif';x.fillStyle='#e8dcc0';x.textAlign='center';x.fillText('PREPARANDO A PARTIDA…',W/2,H/2+84);
   x.globalAlpha=1;
  }
  // saída: some suave nos últimos 0,25 s
  cv.style.opacity=1-lin(t,T-.25,T);
  if(t<T)requestAnimationFrame(frame);
  else if(!fin){fin=true;cv.remove();done&&done()}
 }
 requestAnimationFrame(frame);
};
