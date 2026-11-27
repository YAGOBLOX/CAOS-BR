/* CAOS BR FPS · tiro, raio da câmera, mira, mira assistida, trocar/recarregar arma */
function shoot(e,a,dm,o,ty,d){const h0=(e.z||0)+(e.st===2?10:e.st===1?26:36);G.bl.push({x:e.x+Math.cos(a)*20,y:e.y+Math.sin(a)*20,vx:Math.cos(a)*520,vy:Math.sin(a)*520,o,dm,h:h0,vh:ty===undefined?0:(ty-h0)/Math.max(40,d)*520,life:1.2,ln:10,th:1.3})}
// ===== mira / raio da câmera =====
function camRay(){
 const SM=a=>{const h=G.p.hs===undefined?(G.p.st||0):G.p.hs,i=Math.min(1,Math.floor(h)),f=h-i;return a[i]+(a[i+1]-a[i])*f};   // altura da câmera suave entre em pé/agachado/deitado
 const p=G.p,c=Math.cos(ang),s=Math.sin(ang),dd=(zoom?60:78)*CAOS.gfx.cdm(),sh=zoom?10:20,dh=dd*Math.cos(pit),st=p.st||0,z=p.z||0;
 const zg=p.gz||0,zj=z-zg;   // chão (sobe inteiro) + pulo (amortecido): a câmera e o alvo sobem IGUAL, então a mira não "desce" em lugares altos
 const o={x:cl(p.x-c*dh-s*sh,25,W-25),y:Math.max(10+zg*0,SM([52,40,26])+zg+zj*.8-dd*Math.sin(pit)),z:cl(p.y-s*dh+c*sh,25,H-25)};
 if(CAOS.lv){const f=flb(o.x,o.z,zg+60);if(f!==null)o.y=Math.max(o.y,f+8)}
 const t={x:p.x+c*300-s*sh,y:SM([40,30,18])+zg+zj*.6+Math.tan(pit)*300,z:p.y+s*300+c*sh};
 {// câmera não atravessa parede: encurta o recuo até antes do 1º obstáculo
  const by=40+(p.gz||0)*0+(p.z||0),ex=p.x,ez=p.y,n=Math.max(1,Math.ceil(Math.hypot(o.x-ex,o.z-ez)/6));let kf=1;
  for(let i=1;i<=n;i++){const u=i/n,x=ex+(o.x-ex)*u,z=ez+(o.z-ez)*u,y=by+(o.y-by)*u;if(CAOS.lv?(hitWH(x,z,y)||(flb(x,z,by+40)!==null&&y<flb(x,z,by+40)+6)):(y<WALLH+4&&hitW(x,z,7))){kf=Math.max(.12,(i-1)/n*.92);break}}
  if(kf<1){o.x=ex+(o.x-ex)*kf;o.z=ez+(o.z-ez)*kf;o.y=by+(o.y-by)*kf}}
 const dx=t.x-o.x,dy=t.y-o.y,dz=t.z-o.z,l=Math.hypot(dx,dy,dz)||1;
 return{o,t,d:{x:dx/l,y:dy/l,z:dz/l}};
}
function aimTrace(){
 const R=camRay(),o=R.o,d=R.d;let bt=900,bot=null;
 if(CAOS.lv){for(let t=8;t<bt;t+=8){const x=o.x+d.x*t,y=o.y+d.y*t,z=o.z+d.z*t;if(hitWH(x,z,y)){bt=t;break}const f=flb(x,z,y+8);if(f!==null&&y<=f+2){bt=t;break}}}
 else if(d.y<-1e-4){const t=-o.y/d.y;if(t>0&&t<bt)bt=t}
 for(const[a,b,w,l]of walls){if(CAOS.lv&&!(a<0||b<0||a>=W||b>=H))continue;
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
 const mzv=p.mz&&!w.fist?p.mz:null,mx=mzv?mzv.x:p.x+Math.cos(ang)*14,mz=mzv?mzv.y:p.y+Math.sin(ang)*14,mh2=mzv?mzv.h:mh;
 const hx=R.pt.x-mx,hz=R.pt.z-mz,hy=R.pt.y-mh2,hd=Math.hypot(hx,hz),k=w.sp*(zoom?.8:2);
 const a=(hd>8?Math.atan2(hz,hx):ang)+(Math.random()-.5)*k;
 const vh=(hd>8?hy/hd:Math.tan(pit))+(Math.random()-.5)*k*.5;
 const v=w.bv||900;G.bl.push({x:mx,y:mz,vx:Math.cos(a)*v,vy:Math.sin(a)*v,o:'p',dm:w.dm,h:mh2,vh:vh*v,life:w.life||(w.rg||700)/v,ln:w.bn||14,th:w.bt||1.4});
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
