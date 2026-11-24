/* CAOS BR FPS · modelo 3D do humanoide (jogador e bots): articulações encaixadas (quadril, joelho, ombro, cotovelo) */
function humanoid(pl,shc){
 const skin=pl?0xc08a5e:0xe59a5a,sh=pl?0x1a1b20:shc,pa=pl?0x1c1d24:0x2a2a2a,ha=0x400000,glv=0x1b1b1f;
 const g=new THREE.Group(),M=[],G2=(p,x,y,z)=>{const q=new THREE.Group();q.position.set(x,y,z);p.add(q);return q};
 const mesh=(geo,c,x,y,z,sx,sy,sz,p)=>{const o=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:c}));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;(p||g).add(o);M.push(o.material);return o};
 const cy=new THREE.CylinderGeometry(.5,.5,1,18),sp=new THREE.SphereGeometry(.5,20,14),bx=new THREE.BoxGeometry(1,1,1),tp=new THREE.CylinderGeometry(.5,.4,1,20),th=new THREE.CylinderGeometry(.5,.42,1,16);
 const hp=G2(g,0,34,0),ts=G2(hp,0,0,0);
 // quadril/pélvis e pernas: esfera no quadril + coxa cônica + joelho + canela + bota
 mesh(sp,pa,0,-1,0,11.5,9,19.5,hp);
 const leg=z=>{const t=G2(hp,0,0,z),k=G2(t,0,-17,0);
  mesh(sp,pa,0,0,0,10,10,10,t);mesh(th,pa,0,-8.5,0,9.4,17.4,9.4,t);
  mesh(sp,pa,0,0,0,8.8,8.8,8.8,k);mesh(th,pa,0,-8.5,0,8,17.4,8,k);mesh(bx,0x23262e,2.6,-.4,0,2.4,5,6.4,k);
  mesh(cy,0x15151a,0,-15.2,0,8.6,3,8.6,k);mesh(sp,0xf2f2f2,2.8,-15,0,14,5.8,8.6,k);mesh(bx,0x111111,2.8,-17,0,14.4,1.4,8.2,k);return{t,k}};
 const L1=leg(-4.4),L2=leg(4.4);
 // tronco: colete tático, cintura, pescoço
 mesh(tp,sh,0,11.5,0,10.6,23,18.4,ts);mesh(bx,0x24262c,.6,13.5,0,10.2,12,16.6,ts);mesh(cy,0x16171a,0,1.8,0,10.8,3.2,18.6,ts);mesh(bx,0xb8b8b8,5.5,1.8,0,.8,2,2.6,ts);
 mesh(bx,0x2d2f36,5.6,8,-4.4,2.4,5,4.6,ts);mesh(bx,0x2d2f36,5.6,8,4.4,2.4,5,4.6,ts);
 mesh(cy,skin,0,24.6,0,4.8,4.4,4.8,ts);mesh(cy,sh,0,23,0,7,2,7,ts);
 const hd=G2(ts,0,31,0);mesh(sp,skin,0,0,0,10.5,11.5,9.8,hd);mesh(sp,skin,0,0,5.2,2.4,3.2,1.6,hd);mesh(sp,skin,0,0,-5.2,2.4,3.2,1.6,hd);mesh(sp,skin,5.3,-.8,0,1.8,2.4,1.6,hd);
 if(pl){
  mesh(sp,0x2a1a12,0,5.8,0,15,11,15,hd);
  for(let i=0;i<9;i++){const a=i*.7;mesh(sp,0x33211a,Math.cos(a)*5.5,6.5+Math.sin(i*1.3),Math.sin(a)*5.5,5.5,5.5,5.5,hd)}
  mesh(bx,0x0b0b0b,5,.8,0,1.4,3.2,9.6,hd);mesh(sp,0xededed,.5,-3.4,0,10.8,5,9.8,hd);
  for(const z of[-4,0,4])mesh(bx,0x2fd34a,5.2*Math.sqrt(1-(z/9.2)**2)+.2,13,z,.6,20,1.5,ts);
  const r=mesh(cy,0x1c1c22,-6.8,12,-2.5,2.6,34,2.6,ts);r.rotation.z=.2;
 }else{
  mesh(sp,0x3a4030,0,3.6,0,12.4,8.2,11.4,hd);mesh(bx,0x2a3024,4.6,1.8,0,2.6,1.2,11,hd);mesh(sp,0x1a1a1a,5.1,.2,-2.5,1.2,2.4,2.4,hd);mesh(sp,0x1a1a1a,5.1,.2,2.5,1.2,2.4,2.4,hd);mesh(bx,0x2d3328,0,14,0,11.2,12,18.8,ts);
 }
 // braços de 2 ossos: ombro (esfera) → braço de manga → cotovelo → antebraço → luva. A pose vem de IK em animacoes.js
 const arm=z=>{const s=G2(ts,0,21,z);s.rotation.order='YXZ';
  mesh(sp,sh,0,0,0,8.4,8.4,8.4,s);mesh(th,sh,0,-6,0,6.2,12,6.2,s);
  const el=G2(s,0,-12,0);mesh(sp,skin,0,0,0,5,5,5,el);mesh(th,skin,0,-6.2,0,4.8,12.4,4.8,el);mesh(cy,0x2b2b2f,0,-10.6,0,5.4,2,5.4,el);mesh(sp,glv,0,-13.4,0,5.8,5.8,5.8,el);
  s.el=el;return s};
 const A1=arm(-9.2),A2=arm(9.2);
 const gn=G2(ts,8,13,3.6);gn.gs=gunModels(pl?null:[1]);gn.gs.forEach(x=>{if(x)gn.add(x)});
 return{g,hp,ts,hd,L1,L2,A1,A2,gn,M,lx:0,ly:0};
}
