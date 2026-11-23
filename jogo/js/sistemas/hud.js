/* CAOS BR FPS · HUD 2D: vida, munição, minimapa, mira, dano flutuante */
// ===== HUD =====
function bar(x,n,hp,col){cx.fillStyle='#000a';cx.fillRect(x,8,200,18);cx.fillStyle=col;cx.fillRect(x+2,10,196*hp/200,14);cx.fillStyle='#fff';cx.font='bold 10px monospace';cx.fillText(n+' '+hp,x+6,21)}
function gun(x,y,i,c){cx.fillStyle=c;const L=[22,40,46,34,56,28][i];cx.fillRect(x,y,L,7);cx.fillRect(x+4,y+7,7,10);if(i>0)cx.fillRect(x+L*.45,y+7,6,9)}
function drawCh(){
 const z=zoom?1.3:1;cx.save();const col=onTarget()?'#ff2b2b':'#fff';cx.fillStyle=col;cx.strokeStyle=col;cx.lineWidth=2*z;
 
 cx.strokeStyle='#000b';cx.lineWidth=1.5;for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]]){const g=5*z,l=10*z,t=3*z,x=dx?(dx<0?400-g-l:400+g):400-t/2,y=dy?(dy<0?225-g-l:225+g):225-t/2,w=dx?l:t,h=dx?t:l;cx.fillRect(x,y,w,h);cx.strokeRect(x,y,w,h)}
 cx.beginPath();cx.arc(400,225,1.6*z,0,6.28);cx.fill();cx.restore();
}
function draw(){
 draw3d();
 const p=G.p,b=G.b,t=G.t,w=WP[p.w];
 cx.clearRect(0,0,800,450);cx.globalAlpha=S.hudAlpha;cx.textAlign='left';
 if(G.train||G.range){cx.fillStyle='#000a';cx.fillRect(300,8,200,18);cx.fillStyle='#ffb81f';cx.font='bold 11px monospace';cx.textAlign='center';cx.fillText((G.mode.hudTitle+' · ABATES: ')+G.kills,400,21);cx.textAlign='left'}else bar(300,'BOT TESTE',b.hp,'#e04040');
 cx.fillStyle='#000a';cx.fillRect(320,30,160,16);cx.fillStyle='#ffe81a';cx.font='bold 11px monospace';cx.textAlign='center';cx.fillText('DANO: '+G.dmg,400,42);cx.textAlign='left';
 
 if(G.range){G.hist=G.hist.filter(h=>t-h.t<2);const s=G.st,dps=Math.round(G.hist.reduce((a,h)=>a+h.d,0)/2);cx.fillStyle='#000a';cx.fillRect(150,58,200,64);cx.fillStyle='#fff';cx.font='bold 10px monospace';cx.fillText('DANO POR SEG.  '+dps,158,74);cx.fillText('DANO EFETIVO   '+G.dmg,158,90);cx.fillText('CABEÇA '+s.h+'  TRONCO '+s.t+'  MEMBROS '+s.m,158,106)}
 G.fx=G.fx.filter(f=>t-f.t<1);
 for(const f of G.fx){const ag=t-f.t,v=new THREE.Vector3(f.x,f.z+ag*30,f.y).project(T.cam);if(v.z>1)continue;
  cx.globalAlpha=1-ag;cx.font=(f.hd?'bold 20px':'bold 15px')+' monospace';cx.textAlign='center';cx.fillStyle=f.me?'#ff5050':(f.hd?'#ff3030':'#ffe81a');cx.strokeStyle='#000';cx.lineWidth=3;
  const X=(v.x+1)*400+f.ox,Y=(1-v.y)*225;cx.strokeText(f.txt,X,Y);cx.fillText(f.txt,X,Y)}
 cx.globalAlpha=S.hudAlpha;cx.textAlign='left';
 cx.fillStyle='#000a';cx.fillRect(280,412,240,24);
 cx.fillStyle='#2fcf5a';cx.fillRect(284,416,232*p.hp/200,16);
 
 cx.fillStyle='#fff';cx.font='bold 11px monospace';cx.textAlign='center';cx.fillText(Math.ceil(p.hp)+'/200',400,429);cx.textAlign='left';
 cx.fillStyle='#000a';cx.fillRect(590,8,202,56);cx.strokeStyle='#888';cx.lineWidth=2;cx.strokeRect(590,8,202,56);
 cx.fillStyle='#fff';cx.font='bold 34px monospace';cx.fillText(p.am[p.w],600,44);
 cx.font='bold 12px monospace';cx.fillStyle='#bbb';cx.fillText('/'+w.mag,604+String(p.am[p.w]).length*20,44);
 cx.fillStyle=p.rl>0?'#ffb81f':'#fff';cx.font='bold 11px monospace';cx.fillText(p.rl>0?'RECARREGANDO':w.n,600,58);
 gun(722,22,p.w,'#ddd');
 if(S.mini){cx.save();cx.translate(-680,24);const k=110/W;cx.fillStyle='#000a';cx.fillRect(690,34,110,73);cx.fillStyle='#7a4fd0';
  for(const[a,z,ww,hh]of walls)if(a>=0&&z>=0&&a<W&&z<H)cx.fillRect(690+a*k,34+z*k,Math.max(1,ww*k),Math.max(1,hh*k));
  cx.fillStyle='#2fcf5a';for(const q of G.kits)if(q.t<=0)cx.fillRect(689+q.x*k,33+q.y*k,3,3);
  cx.fillStyle='#ff4040';for(const q of G.bs)if(q.hp>0)cx.fillRect(688+q.x*k,32+q.y*k,5,5);
  cx.fillStyle='#ffe81a';cx.fillRect(688+p.x*k,32+p.y*k,5,5);cx.restore()}
 drawCh();
 if(joy){cx.strokeStyle='#fff6';cx.lineWidth=3;cx.beginPath();cx.arc(joy.x,joy.y,45,0,6.28);cx.stroke();
  cx.fillStyle='#fff6';cx.beginPath();cx.arc(joy.x+jx*45,joy.y+jy*45,20,0,6.28);cx.fill()}
 else{cx.strokeStyle='#fff4';cx.lineWidth=2;cx.strokeRect(50,300,110,110)}
 cx.globalAlpha=1;
 if(t<G.emo){const v=new THREE.Vector3(p.x,62,p.y).project(T.cam);cx.font='28px sans-serif';cx.textAlign='center';cx.fillText('😊',(v.x+1)*400,(1-v.y)*225);cx.textAlign='left'}
 if(t<6){cx.fillStyle='#fffc';cx.font='bold 11px monospace';cx.textAlign='center';cx.fillText('ESQ: ANDAR · DIR: CÂMERA · 🔥 ATIRAR · ⊕ MIRA',400,300);cx.textAlign='left'}
 document.querySelectorAll('.sl').forEach(e=>e.style.borderColor=+e.dataset.w===p.w?'#ffb81f':'');
 $('#aimb').classList.toggle('on',zoom);$('#cro').classList.toggle('on',p.st===1);$('#prn').classList.toggle('on',p.st===2);
}
