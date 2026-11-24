/* CAOS BR FPS · tiro, raio da câmera, mira, mira assistida, trocar/recarregar arma */
function shoot(e,a,dm,o){G.bl.push({x:e.x+Math.cos(a)*20,y:e.y+Math.sin(a)*20,vx:Math.cos(a)*520,vy:Math.sin(a)*520,o,dm,h:(e.z||0)+(e.st===2?10:e.st===1?26:36),vh:0,life:1.2,ln:10,th:1.3})}
// ===== mira / raio da câmera =====
function camRay(){
 const SM=a=>{const h=G.p.hs===undefined?(G.p.st||0):G.p.hs,i=Math.min(1,Math.floor(h)),f=h-i;return a[i]+(a[i+1]-a[i])*f};   // altura da câmera suave entre em pé/agachado/deitado
 const p=G.p,c=Math.cos(ang),s=Math.sin(ang),dd=zoom?60:78,sh=zoom?10:20,dh=dd*Math.cos(pit),st=p.st||0,z=p.z||0;
 const o={x:cl(p.x-c*dh-s*sh,25,W-25),y:Math.max(10,SM([52,40,26])+z*.8-dd*Math.sin(pit)),z:cl(p.y-s*dh+c*sh,25,H-25)};
 const t={x:p.x+c*300-s*sh,y:SM([40,30,18])+z*.6+Math.tan(pit)*300,z:p.y+s*300+c*sh};
 const dx=t.x-o.x,dy=t.y-o.y,dz=t.z-o.z,l=Math.hypot(dx,dy,dz)||1;
 return{o,t,d:{x:dx/l,y:dy/l,z:dz/l}};
}
function aimTrace(){
 const R=camRay(),o=R.o,d=R.d;let bt=900,bot=null;
 if(d.y<-1e-4){const t=-o.y/d.y;if(t>0&&t<bt)bt=t}
 for(const[a,b,w,l]of walls){
  const hh=(a<0||b<0||a>=W||b>=H)?22:70;let t0=0,t1=bt;
  const sl=(p0,dv,lo,hi)=>{if(Math.abs(dv)<1e-6)return p0>=lo&&p0<=hi;let u=(lo-p0)/dv,v=(hi-p0)/dv;if(u>v){const x=u;u=v;v=x}t0=Math.max(t0,u);t1=Math.min(t1,v);return t0<=t1};
  if(sl(o.x,d.x,a,a+w)&&sl(o.y,d.y,0,hh)&&sl(o.z,d.z,b,b+l)&&t0>0&&t0<bt)bt=t0;
 }
 for(const q of G.bs){
  if(q.hp<=0)continue;
  const top=q.st===2?18:q.st===1?45:58,z0=q.z||0,ox=o.x-q.x,oz=o.z-q.y;
  const A=d.x*d.x+d.z*d.z,B=2*(ox*d.x+oz*d.z),C=ox*ox+oz*oz-225;
  if(A<1e-9)continue;
  const D=B*B-4*A*C;if(D<0)continue;
  const t=(-B-Math.sqrt(D))/(2*A);
  if(t>0&&t<bt){const y=o.y+d.y*t;if(y>=z0&&y<=z0+top){bt=t;bot=q}}
 }
 return{pt:{x:o.x+d.x*bt,y:o.y+d.y*bt,z:o.z+d.z*bt},bot,t:bt};
}
const onTarget=()=>!!aimTrace().bot;
function shootAim(w){
 const p=G.p,R=aimTrace(),mh=(p.z||0)+(p.st===2?10:p.st===1?26:36);
 const mx=p.x+Math.cos(ang)*14,mz=p.y+Math.sin(ang)*14;
 const hx=R.pt.x-mx,hz=R.pt.z-mz,hy=R.pt.y-mh,hd=Math.hypot(hx,hz),k=w.sp*(zoom?.8:2);
 const a=(hd>8?Math.atan2(hz,hx):ang)+(Math.random()-.5)*k;
 const vh=(hd>8?hy/hd:Math.tan(pit))+(Math.random()-.5)*k*.5;
 const v=w.bv||900;G.bl.push({x:mx,y:mz,vx:Math.cos(a)*v,vy:Math.sin(a)*v,o:'p',dm:w.dm,h:mh,vh:vh*v,life:w.life||(w.rg||700)/v,ln:w.bn||14,th:w.bt||1.4});
}
function assist(g,dt){
 const p=g.p;afr=1;
 if(S.asst<=0)return;
 const o=camRay().o;let best=null,bd=1e9,bdf=0;
 for(const q of g.bs){
  if(q.hp<=0)continue;
  const dx=q.x-o.x,dz=q.y-o.z,d=Math.hypot(dx,dz);
  if(d>600||d<30||d>=bd)continue;
  let df=Math.atan2(dz,dx)-ang;df=Math.atan2(Math.sin(df),Math.cos(df));
  if(Math.abs(df)<Math.atan(34/d)+.03&&see(p,q)){best=q;bd=d;bdf=df}
 }
 if(!best)return;
 afr=1-.55*S.asst;
 if(fire||fb)ang+=bdf*Math.min(1,dt*8*S.asst);
}
function swp(){if(G&&!G.over){const L=lst();G.p.w=L[(L.indexOf(G.p.w)+1)%L.length];G.p.rl=0}}
function rel(){if(G&&!G.over){const p=G.p;if(p.rl<=0&&p.am[p.w]<WP[p.w].mag)p.rl=WP[p.w].rl}}
