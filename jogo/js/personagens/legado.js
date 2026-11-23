/* CAOS BR FPS · [NÃO CARREGADO] versões antigas dos modelos, guardadas para referência */
function man(sh,pa,ha){
 const g=new THREE.Group(),M=[];
 const P=(w,h,d,x,y,z,c,par)=>{const cyl=h>=1.5*w||(d>=20&&h<8&&w<14),o=new THREE.Mesh(cyl?new THREE.CylinderGeometry(.5,.5,1,16):new THREE.SphereGeometry(.5,14,10),new THREE.MeshLambertMaterial({color:c}));o.scale.set(w,h,d);o.castShadow=true;o.position.set(x,y,z);(par||g).add(o);M.push(o.material);return o};
 const hip=z=>{const q=new THREE.Group();q.position.set(0,24,z);g.add(q);P(10,24,10,0,-12,0,pa,q);P(14,5,12,2,-22,0,0xf2f2f2,q);return q};
 const l1=hip(-6),l2=hip(6);
 P(12,26,22,0,37,0,sh);P(12.6,5,22.6,0,32,0,0x3ac43a);
 P(14,14,14,0,60,0,0xe59a5a);P(14.6,5,14.6,0,66,0,ha);
 P(1,3,3,7.2,60,-3.5,0x4de2ff);P(1,3,3,7.2,60,3.5,0x4de2ff);
 P(18,8,8,10,41,-12,0xff8a1f);P(18,8,8,10,41,12,0xff8a1f);
 P(32,8,7,22,40,6,0x1c1c22);
 g.scale.setScalar(.8);
 return{g,l1,l2,M,lx:0,ly:0};
}
function man2(sh,pa,ha){
 const g=new THREE.Group(),M=[],G2=(p,x,y,z)=>{const q=new THREE.Group();q.position.set(x,y,z);p.add(q);return q};
 const mesh=(geo,c,x,y,z,sx,sy,sz,p)=>{const o=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:c}));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;(p||g).add(o);M.push(o.material);return o};
 const cy=new THREE.CylinderGeometry(.5,.5,1,12),sp=new THREE.SphereGeometry(.5,12,9);
 const hp=G2(g,0,24,0),ts=G2(hp,0,0,0);
 const leg=z=>{const t=G2(hp,0,0,z),k=G2(t,0,-12,0);mesh(cy,pa,0,-6,0,9,12.5,9,t);mesh(cy,pa,0,-6,0,8,12.5,8,k);mesh(sp,0xf2f2f2,2.5,-12.5,0,15,6,10,k);return{t,k}};
 const L1=leg(-5),L2=leg(5);
 mesh(cy,sh,0,13,0,12,26,22,ts);mesh(cy,0x3ac43a,0,7,0,12.6,5,22.6,ts);
 const hd=G2(ts,0,36,0);mesh(sp,0xe59a5a,0,0,0,14,14,14,hd);mesh(sp,ha,0,3.5,0,14.8,9,14.8,hd);mesh(sp,0x4de2ff,6.6,0,-3.5,1.5,3,3,hd);mesh(sp,0x4de2ff,6.6,0,3.5,1.5,3,3,hd);
 const arm=z=>{const s=G2(ts,0,24,z);mesh(cy,0xff8a1f,0,-9,0,7,18,7,s);mesh(sp,0xe59a5a,0,-19,0,7.5,7.5,7.5,s);return s};
 const A1=arm(-11),A2=arm(11);
 const gn=G2(ts,12,22,6);mesh(sp,0x1c1c22,14,0,0,32,6,6,gn);mesh(sp,0x1c1c22,2,-5,0,5,10,5,gn);
 return{g,hp,ts,hd,L1,L2,A1,A2,gn,M,lx:0,ly:0};
}
function man3(){
 const m=man2(0x131313,0x15151a,0x2a1a12),skin=0xc08a5e;
 const mk2=(geo,c,x,y,z,sx,sy,sz,p)=>{const o=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:c}));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;p.add(o);m.M.push(o.material);return o};
 const cy=new THREE.CylinderGeometry(.5,.5,1,12),sp=new THREE.SphereGeometry(.5,12,9),bx=new THREE.BoxGeometry(1,1,1);
 m.hd.children[0].material.color.setHex(skin);m.hd.children[2].visible=m.hd.children[3].visible=false;
 mk2(sp,0x2a1a12,0,6,0,19,15,19,m.hd);
 for(let i=0;i<9;i++){const a=i*.7;mk2(sp,0x33211a,Math.cos(a)*7,8+Math.sin(i*1.3)*1.5,Math.sin(a)*7,7,7,7,m.hd)}
 mk2(bx,0x0b0b0b,6.6,1,0,1.6,4,13,m.hd);
 mk2(sp,0xededed,.6,-4.2,0,14.6,6.5,14.6,m.hd);
 for(const z of[-6,0,6])mk2(bx,0x2fd34a,6*Math.sqrt(1-(z/11)**2)+.2,13,z,.6,22,1.6,m.ts);
 for(const A of[m.A1,m.A2]){A.children[0].material.color.setHex(skin);A.children[1].material.color.setHex(skin);mk2(cy,0x131313,0,-4,0,8.4,9,8.4,A)}
 const r=mk2(cy,0x1c1c22,-8,14,-3,3,36,3,m.ts);r.rotation.z=.2;
 return m;
}
function pose2(e,m,a,t){
 const d=Math.min(6,Math.hypot(e.x-m.lx,e.y-m.ly));m.lx=e.x;m.ly=e.y;
 m.ph=(m.ph||0)+d*.075;m.amp=(m.amp||0)+((e.z>0?0:Math.min(1,d/2.2))-(m.amp||0))*.25;
 const ph=m.ph,am=m.amp,dead=e.hp<=0,pr=e.st===2&&!dead,cr=e.st===1&&!dead,air=e.z>1&&!dead,S=Math.sin,C=Math.cos;
 let a1=S(ph)*.9*am,k1=-Math.max(0,C(ph))*1.1*am,a2=S(ph+3.14)*.9*am,k2=-Math.max(0,C(ph+3.14))*1.1*am,lean=-.1*am,arm=1.25,hipY=24;
 if(dead){a1=.25;k1=0;a2=-.2;k2=0;lean=0;arm=2.4}
 else if(pr){a1=S(ph)*.25*am;a2=-a1;k1=k2=0;lean=0;arm=3}
 else if(air){a1=.9;k1=-1.2;a2=.5;k2=-1;lean=-.12;arm=1.8}
 else{
  if(cr){a1=1.35+S(ph)*.3*am;a2=1.35-S(ph)*.3*am;k1=k2=-1.9;lean=-.35}
  hipY=Math.max(12*C(a1)+12*C(a1+k1),12*C(a2)+12*C(a2+k2));
 }
 m.g.position.set(e.x,e.z+(dead?6:pr?7:0),e.y);m.g.scale.setScalar(.8);m.g.rotation.set(0,-a,(dead||pr)?-1.5:0);
 m.hp.position.y=hipY;m.ts.rotation.z=lean;m.hd.rotation.z=pr?.9:-lean*.7;
 m.L1.t.rotation.z=a1;m.L1.k.rotation.z=k1;m.L2.t.rotation.z=a2;m.L2.k.rotation.z=k2;
 m.A1.rotation.z=arm;m.A2.rotation.z=arm;
 if(pr)m.gn.position.set(0,62,6);else m.gn.position.set(12,22,6);
 m.gn.rotation.z=pr?1.57:0;
 for(const mt of m.M)mt.emissive.setHex(e.fl>0?0xffffff:0);
}
function pose(e,m,a,t){
 const d=Math.min(6,Math.hypot(e.x-m.lx,e.y-m.ly));m.lx=e.x;m.ly=e.y;m.ph=(m.ph||0)+d*.075;m.amp=(m.amp||0)+((e.z>0?.3:Math.min(1,d/2.2))-(m.amp||0))*.3;
 m.g.position.set(e.x,e.z+Math.abs(Math.sin(m.ph))*1.4*m.amp,e.y);m.g.scale.set(.8,e.st===1?.62:.8,.8);m.g.rotation.set(0,-a,(e.hp<=0||e.st===2)?-1.5:-.09*m.amp);
 const sw=e.hp>0?Math.sin(m.ph)*.8*m.amp:0;m.l1.rotation.z=sw;m.l2.rotation.z=-sw;
 for(const mt of m.M)mt.emissive.setHex(e.fl>0?0xffffff:0);
}
