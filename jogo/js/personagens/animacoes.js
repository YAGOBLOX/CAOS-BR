/* CAOS BR FPS · animação/pose do humanoide (andar, agachar, deitar, pular, morrer) */
function poseN(e,m,a,t){
 const d=Math.min(6,Math.hypot(e.x-m.lx,e.y-m.ly));m.lx=e.x;m.ly=e.y;
 m.ph=(m.ph||0)+d*.075;m.amp=(m.amp||0)+((e.z>0?0:Math.min(1,d/2.2))-(m.amp||0))*.25;
 const ph=m.ph,am=m.amp,dead=e.hp<=0,pr=e.st===2&&!dead,cr=e.st===1&&!dead,air=e.z>1&&!dead,S=Math.sin,C=Math.cos;
 let a1=S(ph)*.9*am,k1=-Math.max(0,C(ph))*1.1*am,a2=S(ph+3.14)*.9*am,k2=-Math.max(0,C(ph+3.14))*1.1*am,lean=-.1*am,arm=1.25,hipY=34;
 if(dead){a1=.25;k1=0;a2=-.2;k2=0;lean=0;arm=2.4}
 else if(pr){a1=S(ph)*.25*am;a2=-a1;k1=k2=0;lean=0;arm=3}
 else if(air){a1=.9;k1=-1.2;a2=.5;k2=-1;lean=-.12;arm=1.8}
 else{
  if(cr){a1=1.35+S(ph)*.3*am;a2=1.35-S(ph)*.3*am;k1=k2=-1.9;lean=-.35}
  hipY=Math.max(17*C(a1)+17*C(a1+k1),17*C(a2)+17*C(a2+k2));
 }
 m.g.position.set(e.x,e.z+(dead||pr?6:0),e.y);m.g.scale.setScalar(.8);m.g.rotation.set(0,-a,(dead||pr)?-1.5:0);
 m.hp.position.y=hipY;m.ts.rotation.z=lean;m.hd.rotation.z=pr?.9:-lean*.7;
 m.L1.t.rotation.z=a1;m.L1.k.rotation.z=k1;m.L2.t.rotation.z=a2;m.L2.k.rotation.z=k2;
 m.A1.rotation.z=arm;m.A2.rotation.z=arm;
 if(pr)m.gn.position.set(0,56,6);else m.gn.position.set(8,13,5);m.gn.gs.forEach((x,i)=>{if(x)x.visible=i===(e.w===undefined?1:e.w)});
 m.gn.rotation.z=pr?1.57:0;
 for(const mt of m.M)mt.emissive.setHex(e.fl>0?0xffffff:0);
}
