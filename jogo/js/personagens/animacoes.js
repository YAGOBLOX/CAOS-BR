/* CAOS BR FPS · animação/pose do humanoide (andar, agachar, deitar, pular, morrer). a = para onde o CORPO olha */
// comprimento da mão da frente por arma (ponto de apoio da mão esquerda no cano)
const FORE={};
function foreOf(i){if(FORE[i]!==undefined)return FORE[i];const w=WP[i];let r=13;if(w&&w.m&&typeof GUNMESH!=='undefined'&&GUNMESH[w.m]){let mx=0;const v=GUNMESH[w.m].v;for(let k=0;k<v.length;k+=3)mx=Math.max(mx,v[k]);r=Math.max(4,Math.min(15,mx/20*.5))}return FORE[i]=r}
// IK de 2 ossos: leva a mão até (tx,ty,tz) (espaço do tronco). Ombro em (0,21,sz)
function armIK(A,sz,tx,ty,tz){
 const L1=12,L2=13,dx=tx,dy=ty-21,dz=tz-sz,r=Math.hypot(dx,dz);let D=Math.max(7,Math.min(L1+L2-.2,Math.hypot(r,dy)));
 const ga=Math.acos(Math.max(-1,Math.min(1,(L1*L1+L2*L2-D*D)/(2*L1*L2)))),al=Math.acos(Math.max(-1,Math.min(1,(L1*L1+D*D-L2*L2)/(2*L1*D))));
 A.rotation.set(0,Math.atan2(-dz,dx),Math.atan2(r,-dy)-al);A.el.rotation.z=Math.PI-ga;
}
function poseN(e,m,a,t){
 const d=Math.min(6,Math.hypot(e.x-m.lx,e.y-m.ly));m.lx=e.x;m.ly=e.y;
 m.ph=(m.ph||0)+d*.075;m.amp=(m.amp||0)+((e.z>0?0:Math.min(1,d/2.2))-(m.amp||0))*.25;
 const ph=m.ph,am=m.amp,dead=e.hp<=0,pr=e.st===2&&!dead,cr=e.st===1&&!dead,air=e.z>1&&!dead,S=Math.sin,C=Math.cos;
 let a1=S(ph)*.9*am,k1=-Math.max(0,C(ph))*1.1*am,a2=S(ph+3.14)*.9*am,k2=-Math.max(0,C(ph+3.14))*1.1*am,lean=-.1*am,hipY=34;
 if(dead){a1=.25;k1=0;a2=-.2;k2=0;lean=0}
 else if(pr){a1=S(ph)*.25*am;a2=-a1;k1=k2=0;lean=0}
 else if(air){a1=.9;k1=-1.2;a2=.5;k2=-1;lean=-.12}
 else{
  if(cr){a1=1.35+S(ph)*.3*am;a2=1.35-S(ph)*.3*am;k1=k2=-1.9;lean=-.35}
  hipY=Math.max(17*C(a1)+17*C(a1+k1),17*C(a2)+17*C(a2+k2));
 }
 m.g.position.set(e.x,e.z+(dead||pr?6:0),e.y);m.g.scale.setScalar(.8);m.g.rotation.set(0,-a,(dead||pr)?-1.5:0);
 m.hp.position.y=hipY;m.ts.rotation.z=lean;m.hd.rotation.z=pr?.9:-lean*.7;
 m.L1.t.rotation.z=a1;m.L1.k.rotation.z=k1;m.L2.t.rotation.z=a2;m.L2.k.rotation.z=k2;
 const wi=e.w===undefined?1:e.w,has=!!m.gn.gs[wi];
 if(pr)m.gn.position.set(0,56,6);else m.gn.position.set(8,13+(cr?0:S(ph*2)*.5*am),3.6);
 m.gn.gs.forEach((x,i)=>{if(x)x.visible=i===wi});m.gn.rotation.z=pr?1.57:0;
 if(dead){m.A1.rotation.set(0,0,2.4);m.A2.rotation.set(0,0,2.4);m.A1.el.rotation.z=m.A2.el.rotation.z=.3}
 else if(pr){m.A1.rotation.set(0,0,3);m.A2.rotation.set(0,0,3);m.A1.el.rotation.z=m.A2.el.rotation.z=.15}
 else if(has){const p=m.gn.position,f=wi===e.w||e.w===undefined?foreOf(wi):13;armIK(m.A2,9.2,p.x+1,p.y+.4,p.z+1.2);armIK(m.A1,-9.2,p.x+f,p.y-1.4,p.z-1.8)}
 else{const b=S(ph*2)*.8*am;armIK(m.A2,9.2,13,17+b,4.5);armIK(m.A1,-9.2,13,16-b,-4.5)}   // punho: guarda de boxe
 for(const mt of m.M)mt.emissive.setHex(e.fl>0?0xffffff:0);
}
