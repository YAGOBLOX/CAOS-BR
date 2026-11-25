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
 if(m.xb)return poseX(e,m,a,t);
 const d=Math.min(6,Math.hypot(e.x-m.lx,e.y-m.ly));m.lx=e.x;m.ly=e.y;
 const dt=Math.max(0,Math.min(.05,t-(m.pt===undefined?t:m.pt)));m.pt=t;
 m.ph=(m.ph||0)+d*.075;m.amp=(m.amp||0)+((e.z>0?0:Math.min(1,d/2.2))-(m.amp||0))*.25;
 const dead=e.hp<=0,kk=1-Math.exp(-dt*11);
 // agachar/deitar suaves: cs (0..1 agachado) e ps (0..1 deitado) andam até o alvo
 m.cs=(m.cs||0)+(((e.st===1&&!dead)?1:0)-(m.cs||0))*kk;m.ps=(m.ps||0)+(((e.st===2&&!dead)?1:0)-(m.ps||0))*kk;
 const cs=m.cs,ps=m.ps,ph=m.ph,am=m.amp,air=e.z>1&&!dead,S=Math.sin,C=Math.cos,L=(x,y,k)=>x+(y-x)*k;
 let a1=S(ph)*.9*am,k1=-Math.max(0,C(ph))*1.1*am,a2=S(ph+3.14)*.9*am,k2=-Math.max(0,C(ph+3.14))*1.1*am,lean=-.1*am;
 // alvo agachado e deitado, misturados pelo quanto já chegou
 a1=L(a1,1.35+S(ph)*.3*am,cs);a2=L(a2,1.35-S(ph)*.3*am,cs);k1=L(k1,-1.9,cs);k2=L(k2,-1.9,cs);lean=L(lean,-.35,cs);
 a1=L(a1,S(ph)*.25*am,ps);a2=L(a2,-S(ph)*.25*am,ps);k1=L(k1,0,ps);k2=L(k2,0,ps);lean=L(lean,0,ps);
 if(dead){a1=.25;k1=0;a2=-.2;k2=0;lean=0}
 else if(air){a1=.9;k1=-1.2;a2=.5;k2=-1;lean=-.12}
 let hipY=Math.max(17*C(a1)+17*C(a1+k1),17*C(a2)+17*C(a2+k2));hipY=L(hipY,34,ps);
 const lie=dead?1:ps;
 m.g.position.set(e.x,e.z+6*lie,e.y);m.g.scale.setScalar(.8);m.g.rotation.set(0,-a,-1.5*lie);
 m.hp.position.y=hipY;m.ts.rotation.z=lean;m.hd.rotation.z=L(-lean*.7,.9,ps);
 m.L1.t.rotation.z=a1;m.L1.k.rotation.z=k1;m.L2.t.rotation.z=a2;m.L2.k.rotation.z=k2;
 const wi=e.w===undefined?BOTW:e.w,has=!!m.gn.gs[wi];
 // arma na altura do ombro/peito alto, à frente do colete (não dentro do peito)
 m.gn.position.set(L(11,0,ps),L(15.5+(cs>.5?0:S(ph*2)*.5*am),56,ps),L(3.6,6,ps));
 m.gn.gs.forEach((x,i)=>{if(x)x.visible=i===wi});m.gn.rotation.z=ps*1.57;
 if(dead){m.A1.rotation.set(0,0,2.4);m.A2.rotation.set(0,0,2.4);m.A1.el.rotation.z=m.A2.el.rotation.z=.3}
 else{
  const p=m.gn.position;
  if(has){const f=foreOf(wi);armIK(m.A2,9.2,p.x+1,p.y+.4,p.z+1.2);armIK(m.A1,-9.2,p.x+f,p.y-1.4,p.z-1.8)}
  else{const b=S(ph*2)*.8*am;armIK(m.A2,9.2,13,17+b,4.5);armIK(m.A1,-9.2,13,16-b,-4.5)}   // punho: guarda de boxe
  if(ps>0)for(const A of[m.A1,m.A2]){A.rotation.y=L(A.rotation.y,0,ps);A.rotation.z=L(A.rotation.z,3,ps);A.el.rotation.z=L(A.el.rotation.z,.15,ps)}
 }
 for(const mt of m.M)mt.emissive.setHex(e.fl>0?0xffffff:0);
}

// ---- pose do jogador Xbot ----
const _a=new THREE.Vector3(),_b=new THREE.Vector3(),_c=new THREE.Vector3(),_q=new THREE.Quaternion(),_q2=new THREE.Quaternion(),_q3=new THREE.Quaternion();
function aimBone(bone,child,target){   // gira o osso para que o filho aponte para o alvo (mundo)
 bone.getWorldPosition(_a);child.getWorldPosition(_b);const from=_b.sub(_a).normalize(),to=_c.copy(target).sub(_a).normalize();
 _q.setFromUnitVectors(from,to);bone.getWorldQuaternion(_q2);_q2.premultiply(_q);bone.parent.getWorldQuaternion(_q3);bone.quaternion.copy(_q3.invert().multiply(_q2));bone.updateMatrixWorld(true);
}
function ik2(up,fo,ha,T,pole){   // IK de 2 ossos (ombro-cotovelo-mão) com cotovelo para o lado do "pole"
 const S=up.getWorldPosition(new THREE.Vector3()),E0=fo.getWorldPosition(new THREE.Vector3()),H0=ha.getWorldPosition(new THREE.Vector3());
 const L1=S.distanceTo(E0),L2=E0.distanceTo(H0),d=T.clone().sub(S);let D=d.length();D=Math.max(.01,Math.min(L1+L2-.001,D));const dir=d.normalize();
 const aa=(L1*L1-L2*L2+D*D)/(2*D),h=Math.sqrt(Math.max(0,L1*L1-aa*aa)),n=pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
 aimBone(up,fo,S.clone().add(dir.clone().multiplyScalar(aa)).add(n.multiplyScalar(h)));aimBone(fo,ha,T);
}
const XBK={up:-1.05,kn:2.1};
function poseX(e,m,a,t){
 const d=Math.min(6,Math.hypot(e.x-m.lx,e.y-m.ly));m.lx=e.x;m.ly=e.y;
 const dt=Math.max(0,Math.min(.05,t-(m.pt===undefined?t:m.pt)));m.pt=t;const kk=1-Math.exp(-dt*11);
 m.amp=(m.amp||0)+((e.z>0?0:Math.min(1,d/2.2))-(m.amp||0))*.25;m.ph=(m.ph||0)+d*.09;
 const dead=e.hp<=0;m.cs=(m.cs||0)+(((e.st===1&&!dead)?1:0)-(m.cs||0))*kk;m.ps=(m.ps||0)+(((e.st===2&&!dead)?1:0)-(m.ps||0))*kk;
 const am=m.amp,run=Math.max(0,Math.min(1,(d-1.5)/1.1)),cs=m.cs,ps=m.ps,A=m.act,L=(x,y,k)=>x+(y-x)*k;
 // animação de andar/correr só em pé (agachado e deitado usam o parado + pose por código; sem tremer)
 const mv=am*(1-Math.max(cs,ps)),set=(n,w)=>{if(A[n])A[n].setEffectiveWeight(w)};
 set('sneak_pose',0);set('idle',1-mv);set('walk',mv*(1-run));set('run',mv*run);
 if(A.walk)A.walk.timeScale=Math.max(.6,d/1.2);if(A.run)A.run.timeScale=Math.max(.8,d/2);
 m.mx.update(dt);
 const bb=m.root,gb=n=>bb.getObjectByName('mixamorig'+n),drop=88.8*(1-Math.cos(1.05*cs));   // queda do quadril (cm) para os pés ficarem no chão
 if(cs>.005){gb('Hips').position.y-=drop;const sw=Math.sin(m.ph*2)*.4*am;for(const sd of['Left','Right']){const sg=sd==='Left'?1:-1;gb(sd+'UpLeg').rotateX(XBK.up*cs+sg*sw*cs);gb(sd+'Leg').rotateX(XBK.kn*cs-Math.max(0,sg*sw)*.8*cs)}}
 const lie=dead?1:ps,g=m.g;g.position.set(e.x,e.z+5*lie,e.y);g.rotation.set(0,-a,-1.5*lie);g.scale.setScalar(1);
 const wi=e.w===undefined?BOTW:e.w,has=!!m.gn.gs[wi];m.gn.gs.forEach((x,i)=>{if(x)x.visible=i===wi});
 g.updateMatrixWorld(true);
 if(!dead){
  const dropU=drop*XB_H/180,hy=41-dropU;
  m.gn.position.set(L(10,-8,ps),L(hy,46,ps),4.4);m.gn.rotation.z=ps*1.5708;m.gn.visible=true;m.gn.updateMatrixWorld(true);
  const side=new THREE.Vector3(0,0,1).transformDirection(g.matrixWorld),down=new THREE.Vector3(0,-1,0);
  const fg=has?Math.min(foreOf(wi),9):8,T1=m.gn.localToWorld(new THREE.Vector3(0,-.4,.4)),T2=m.gn.localToWorld(new THREE.Vector3(fg,-1.4,-3.2));
  const pl=(sg)=>down.clone().multiplyScalar(1-ps*.7).addScaledVector(side,sg*(.9+ps*.6));   // cotovelo sempre para fora (a mão não cruza o corpo)
  const b=m.bn;ik2(b.rU,b.rF,b.rH,T1,pl(1));ik2(b.lU,b.lF,b.lH,T2,pl(-1));
 }else m.gn.visible=false;
 for(const mt of m.M)if(mt.emissive)mt.emissive.setHex(e.fl>0?0xffffff:0);
}
