/* CAOS BR FPS · modelo 3D do humanoide (jogador e bots) */
function humanoid(pl,shc){
 const skin=pl?0xc08a5e:0xe59a5a,sh=pl?0x131313:shc,pa=pl?0x15151a:0x2a2a2a,ha=0x400000;
 const g=new THREE.Group(),M=[],G2=(p,x,y,z)=>{const q=new THREE.Group();q.position.set(x,y,z);p.add(q);return q};
 const mesh=(geo,c,x,y,z,sx,sy,sz,p)=>{const o=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:c}));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;(p||g).add(o);M.push(o.material);return o};
 const cy=new THREE.CylinderGeometry(.5,.5,1,18),sp=new THREE.SphereGeometry(.5,20,14),bx=new THREE.BoxGeometry(1,1,1),tp=new THREE.CylinderGeometry(.5,.4,1,20);
 const hp=G2(g,0,34,0),ts=G2(hp,0,0,0);
 const leg=z=>{const t=G2(hp,0,0,z),k=G2(t,0,-17,0);mesh(cy,pa,0,-8.5,0,9,17.5,9,t);mesh(cy,pa,0,-8.5,0,8,17.5,8,k);mesh(sp,0xf2f2f2,2.8,-14.2,0,14,5.5,8.5,k);mesh(bx,0x1f2128,0,-10,Math.sign(z)*4.6,7,7,1.4,t);mesh(bx,0x111111,2.8,-14.2,Math.sign(z)*4.3,9,1.6,.5,k);return{t,k}};
 const L1=leg(-4),L2=leg(4);
 mesh(tp,sh,0,11.5,0,10.5,23,18,ts);mesh(cy,skin,0,25,0,4.8,4,4.8,ts);mesh(cy,0x1a1a1a,0,1.8,0,10.8,3,18.4,ts);mesh(bx,0xb8b8b8,5.5,1.8,0,.8,2,2.6,ts);mesh(cy,sh,0,23.2,0,6.2,2,6.2,ts);
 const hd=G2(ts,0,31,0);mesh(sp,skin,0,0,0,10.5,11.5,9.8,hd);mesh(sp,skin,0,0,5.2,2.4,3.2,1.6,hd);mesh(sp,skin,0,0,-5.2,2.4,3.2,1.6,hd);mesh(sp,skin,5.3,-.8,0,1.8,2.4,1.6,hd);
 if(pl){
  mesh(sp,0x2a1a12,0,5.8,0,15,11,15,hd);
  for(let i=0;i<9;i++){const a=i*.7;mesh(sp,0x33211a,Math.cos(a)*5.5,6.5+Math.sin(i*1.3),Math.sin(a)*5.5,5.5,5.5,5.5,hd)}
  mesh(bx,0x0b0b0b,5,.8,0,1.4,3.2,9.6,hd);mesh(sp,0xededed,.5,-3.4,0,10.8,5,9.8,hd);
  for(const z of[-4,0,4])mesh(bx,0x2fd34a,4.7*Math.sqrt(1-(z/8.1)**2)+.2,11.5,z,.6,20,1.5,ts);
  const r=mesh(cy,0x1c1c22,-6.5,12,-2.5,2.6,34,2.6,ts);r.rotation.z=.2;
 }else{
  mesh(sp,0x3a4030,0,3.6,0,12.4,8.2,11.4,hd);mesh(bx,0x2a3024,4.6,1.8,0,2.6,1.2,11,hd);mesh(sp,0x1a1a1a,5.1,.2,-2.5,1.2,2.4,2.4,hd);mesh(sp,0x1a1a1a,5.1,.2,2.5,1.2,2.4,2.4,hd);mesh(bx,0x2d3328,0,14,0,11.2,12,18.8,ts);mesh(bx,0x242a1f,5.9,9,-4,1.8,5,5,ts);mesh(bx,0x242a1f,5.9,9,4,1.8,5,5,ts);
 }
 const arm=z=>{const s=G2(ts,0,21.5,z);mesh(cy,skin,0,-11.5,0,4.8,23,4.8,s);mesh(cy,sh,0,-4.2,0,6.4,8.4,6.4,s);mesh(sp,skin,0,-23.5,0,5.2,5.2,5.2,s);mesh(cy,0x2b2b2b,0,-20.2,0,5.6,2.2,5.6,s);return s};
 const A1=arm(-9.5),A2=arm(9.5);
 const gn=G2(ts,8,13,5);gn.gs=gunModels(pl?null:[1]);gn.gs.forEach(x=>{if(x)gn.add(x)});
 return{g,hp,ts,hd,L1,L2,A1,A2,gn,M,lx:0,ly:0};
}
