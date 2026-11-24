/* CAOS BR FPS · início da partida, fim, mortes e atualização por quadro (upd) */
function startGame(){
 const mode=CAOS.modes[CAOS.sel.mode],map=CAOS.maps[CAOS.sel.map];
 CAOS.map=map;W=map.size[0];H=map.size[1];WALLH=map.wallHeight||70;
 G={mode,map,train:!!mode.flags.train,range:!!mode.flags.range,kills:0,p:mk(map.playerSpawn[0],map.playerSpawn[1]),dmg:0,st:{h:0,t:0,m:0},hist:[],fx:[],b:null,kits:map.kits.map(([x,y])=>({x,y,t:0})),bl:[],over:0,t:0,emo:0};
 T=null;walls=map.walls();G.bs=mode.createBots(G,map);G.b=G.bs[0];jx=jy=0;fire=false;joy=null;aim=null;pit=0;
 G.p.w=eqs[0];   // começa com a 1ª arma EQUIPADA no menu ARMAS
 $('#game').style.display='block';$('#shopb').style.display=G.mode.shop?'flex':'none';buildSlots();
 const g=G;let last=performance.now();
 (function f(ts){if(G!==g)return;const dt=Math.min(.05,(ts-last)/1000);last=ts;if(!editMode)upd(dt);draw();requestAnimationFrame(f)})(last);
}
function end(win){
 if(G.over)return;G.over=1;
 setTimeout(()=>{if(!G)return;
  open('<h2>'+(win?'VITÓRIA!':'DERROTA')+'</h2>'+(win?'Você derrotou o BOT TESTE.':(G.train?'Você caiu! Abates: '+G.kills:'O BOT TESTE te venceu. Tenta de novo!'))+'<button class="btn" id="re">JOGAR DE NOVO</button>');
  $('#x').textContent='VOLTAR AO LOBBY';
  $('#x').onclick=()=>{ov.classList.remove('on');$('#quit').click()};
  $('#re').onclick=()=>{ov.classList.remove('on');startGame()};
 },700);
}
function die(t){if(t===G.p)end(false);else{G.kills++;t.rs=3;if(G.mode.endOnKill)end(true)}}
function upd(dt){
 const g=G,p=g.p;g.t+=dt;p.fl-=dt;g.bs.forEach(q=>q.fl-=dt);
 if(!g.over){
  let mx=jx+(keys.d?1:0)-(keys.a?1:0),my=jy+(keys.s?1:0)-(keys.w?1:0);
  const l=Math.hypot(mx,my);if(l>1){mx/=l;my/=l}
  ang+=((keys.ArrowRight?1:0)-(keys.ArrowLeft?1:0))*2.2*dt;pit=cp(pit+((keys.ArrowUp?1:0)-(keys.ArrowDown?1:0))*1.2*dt);
  const c=Math.cos(ang),s=Math.sin(ang),sp=[170,105,50][p.st];
  const k=Math.min(1,dt*(mx||my?14:18));p.vx=(p.vx||0)+((-my*c-mx*s)*sp-(p.vx||0))*k;p.vy=(p.vy||0)+((-my*s+mx*c)*sp-(p.vy||0))*k;if(mv(p,p.vx*dt,0)===0)p.vx=0;if(mv(p,0,p.vy*dt)===0)p.vy=0;
  p.vz-=900*dt;p.z+=p.vz*dt;if(p.z<=0){p.z=0;p.vz=0}
  assist(g,dt);p.cd-=dt;
  // corpo independente da câmera: vira (suave) para onde anda; ao atirar/mirar vira para a mira
  {if(p.fa===undefined)p.fa=ang;if(fire||fb)p.ft=.6;else if(p.ft>0)p.ft-=dt;
   const sv=Math.hypot(p.vx||0,p.vy||0),aimN=fire||fb||zoom||p.ft>0;let tg=null;
   if(aimN)tg=ang;else if(sv>25)tg=Math.atan2(p.vy,p.vx);
   if(tg!==null){const df=Math.atan2(Math.sin(tg-p.fa),Math.cos(tg-p.fa));p.fa+=df*Math.min(1,dt*(aimN?13:9))}}
  if(p.rl>0){p.rl-=dt;if(p.rl<=0)p.am[p.w]=WP[p.w].mag}
  else if(p.am[p.w]<=0)p.rl=WP[p.w].rl;
  else if((fire||fb)&&p.cd<=0){const w=WP[p.w];if(!w.fist)p.am[p.w]--;for(let i=0;i<w.pel;i++)shootAim(w);p.cd=w.cd;if(!w.fist&&p.am[p.w]<=0)p.rl=w.rl}
  for(const k of g.kits){k.t-=dt;if(k.t<=0)for(const e of[p,g.b])if(e.hp>0&&e.hp<e.mx&&Math.hypot(e.x-k.x,e.y-k.y)<22){e.hp=Math.min(e.mx,e.hp+40);k.t=12}}
  for(const q of g.bs)if(q.hp<=0&&q.rs>0){q.rs-=dt;if(q.rs<=0){if(q.hx!=null){q.x=q.hx;q.y=q.hy}else{const sq=spawnPt();q.x=sq[0];q.y=sq[1]}q.hp=200}}
  for(const q of g.bs){if(q.hp<=0)continue;if(g.range){q.a=Math.atan2(p.y-q.y,p.x-q.x);continue}
   const d=Math.hypot(p.x-q.x,p.y-q.y),a=Math.atan2(p.y-q.y,p.x-q.x),los=see(q,p);
   q.bst-=dt;if(q.bst<=0){q.bst=.6+Math.random()*.8;q.bsd=Math.random()<.5?1:-1}
   let bx,by;
   if(q.blk>0){q.blk-=dt;bx=Math.cos(q.wa);by=Math.sin(q.wa)}
   else{const f=(!los||d>320)?1:(d<180?-1:0),s2=q.bsd*.7;bx=Math.cos(a)*f+Math.cos(a+1.571)*s2;by=Math.sin(a)*f+Math.sin(a+1.571)*s2}
   const bl=Math.hypot(bx,by)||1,spd=q.spd||105;
   if(!mv(q,bx/bl*spd*dt,by/bl*spd*dt)&&q.blk<=0){q.blk=.5;q.wa=Math.random()*6.28}
   q.cd-=dt;if(los&&d<520&&q.cd<=0){shoot(q,a+(Math.random()-.5)*.35*(q.acc||1),q.dmg||7,'b');q.cd=q.rate||.5}
   q.a=a;
  }
 }
 for(let i=g.bl.length-1;i>=0;i--){
  const s=g.bl[i],NS=Math.max(1,Math.ceil(Math.hypot(s.vx,s.vy)*dt/8)),sd=dt/NS;let gone=false;
  for(let k=0;k<NS&&!gone;k++){s.x+=s.vx*sd;s.y+=s.vy*sd;s.h+=s.vh*sd;s.life-=sd;
  const t=s.o==='p'?(g.bs.find(q=>q.hp>0&&Math.hypot(s.x-q.x,s.y-q.y)<16)||g.bs[0]):p;
  if(s.life<=0||s.h<0||hitWH(s.x,s.y,s.h)){g.bl.splice(i,1);gone=true;break}
  if(!g.over&&t.hp>0&&s.h>t.z&&s.h<t.z+(t.st===2?18:t.st===1?45:58)&&Math.hypot(s.x-t.x,s.y-t.y)<16){
   const hd=s.h>t.z+(t.st===2?14:t.st===1?32:41),dm=s.dm*(hd?2:1);let rest=dm;
   if(t.ar>0){const ab=Math.min(t.ar,rest);t.ar-=ab;rest-=ab}
   t.hp=Math.max(0,t.hp-rest);
   if(s.o==='p'){g.dmg+=Math.round(dm);const hr=(s.h-t.z)/(t.st===2?18:t.st===1?45:58);g.st[hd?'h':hr>.34?'t':'m']++;g.hist.push({t:g.t,d:dm})}
   g.fx.push({x:t.x,y:t.y,z:(t.z||0)+(t.st===2?20:62),txt:String(Math.round(dm))+(hd?'!':''),hd,me:s.o!=='p',t:g.t,ox:(Math.random()-.5)*30});
   t.fl=.12;g.bl.splice(i,1);gone=true;
   if(t.hp<=0)die(t);
  }
  }
 }
}
