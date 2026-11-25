/* CAOS BR FPS · modelo 3D do humanoide (jogador e bots): articulações encaixadas (quadril, joelho, ombro, cotovelo) */
function humanoid(pl,shc){
 if(pl&&CAOS.xbot)return xbotBody();
 const skin=pl?0xc08a5e:0xe59a5a,sh=pl?0x1a1b20:shc,pa=pl?0x1c1d24:0x303524,ha=0x400000,glv=0x1b1b1f;
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
  // soldado: capacete, óculos, máscara e colete (no lugar do bloco quadrado)
  mesh(sp,0x3a4030,0,3.4,0,12.6,8.6,11.6,hd);mesh(cy,0x2c3224,0,1.2,0,12.8,1.6,12,hd);mesh(bx,0x1a1a1a,4.9,.2,0,1.2,2.6,9.2,hd);mesh(sp,0x4aa8ff,5.4,.2,-2.5,.8,2,2.4,hd);mesh(sp,0x4aa8ff,5.4,.2,2.5,.8,2,2.4,hd);
  mesh(sp,0x23271d,4.4,-3.6,0,4,3.6,9.4,hd);mesh(bx,0x242a1f,-1,-5.4,0,9,.8,9,hd);
  mesh(tp,0x39402f,0,13.8,0,11.6,13,19.6,ts);mesh(bx,0x2d3328,6.2,16,0,1.6,4.4,8,ts);mesh(bx,0x2d3328,6,9.2,-5,2.2,4.6,4.6,ts);mesh(bx,0x2d3328,6,9.2,5,2.2,4.6,4.6,ts);
 }
 // braços de 2 ossos: ombro (esfera) → braço de manga → cotovelo → antebraço → luva. A pose vem de IK em animacoes.js
 const arm=z=>{const s=G2(ts,0,21,z);s.rotation.order='YXZ';
  mesh(sp,sh,0,0,0,8.4,8.4,8.4,s);mesh(th,sh,0,-6,0,6.2,12,6.2,s);
  const el=G2(s,0,-12,0);mesh(sp,skin,0,0,0,5,5,5,el);mesh(th,skin,0,-6.2,0,4.8,12.4,4.8,el);mesh(cy,0x2b2b2f,0,-10.6,0,5.4,2,5.4,el);mesh(sp,glv,0,-13.4,0,5.8,5.8,5.8,el);
  s.el=el;return s};
 const A1=arm(-9.2),A2=arm(9.2);
 const gn=G2(ts,8,13,3.6);gn.gs=gunModels(pl?null:[BOTW]);gn.gs.forEach(x=>{if(x)gn.add(x)});
 return{g,hp,ts,hd,L1,L2,A1,A2,gn,M,lx:0,ly:0};
}

// ===== jogador com o modelo Xbot (glb com esqueleto Mixamo). Animação: parado/andar/correr + agachar; braços por IK para segurar a arma =====
const XB_H=61;   // altura do boneco no jogo (o antigo tinha ~61)
function xbotBody(){
 const X=CAOS.xbot,root=THREE.SkeletonUtils.clone(X.scene),M=[],g=new THREE.Group(),hold=new THREE.Group();
 root.traverse(o=>{if(o.isMesh||o.isSkinnedMesh){o.frustumCulled=false;o.castShadow=true;if(o.material){o.material=o.material.clone();M.push(o.material)}}});
 xbClothes(root,M);
 const mx=new THREE.AnimationMixer(root),act={};
 X.animations.forEach(c=>{act[c.name]=mx.clipAction(c)});
 for(const n of['idle','walk','run','sneak_pose']){if(act[n]){act[n].play();act[n].setEffectiveWeight(n==='idle'?1:0)}}
 // o three r128 mede a malha pelo bind pose (errado p/ este modelo); a altura real do Xbot é 1,8 m com os pés em y=0 (medido pelos ossos)
 hold.scale.setScalar(XB_H/1.8);hold.rotation.y=Math.PI/2;hold.add(root);g.add(hold);
 const B=n=>root.getObjectByName('mixamorig'+n);
 const gn=new THREE.Group();gn.gs=gunModels(null);gn.gs.forEach(x=>{if(x)gn.add(x)});gn.scale.setScalar(.8);g.add(gn);
 return{xb:1,g,hold,root,mx,act,gn,M,lx:0,ly:0,
  bn:{rU:B('RightArm'),rF:B('RightForeArm'),rH:B('RightHand'),lU:B('LeftArm'),lF:B('LeftForeArm'),lH:B('LeftHand')}};
}

// ===== roupa do Xbot (samurai/oni, ref. do dono): peças presas aos OSSOS (seguem as animações). Medidas em cm (unidade local dos ossos) =====
// obs.: em poseX o quadril/cintura é afinado (Hips.scale.x) e Spine2/UpLeg compensam; peças em Hips/Spine/Spine1 herdam o afinamento.
function xbClothes(root,M){
 const B=n=>root.getObjectByName('mixamorig'+n),V=new THREE.Vector3(0,1,0),Q=new THREE.Quaternion();
 root.traverse(o=>{if(o.isSkinnedMesh&&o.material){o.material.color.setHex(/Joints/.test(o.name)?0xb98560:0xd9a87c);if(o.material.roughness!==undefined)o.material.roughness=.7}});
 const mt=c=>{const m=new THREE.MeshStandardMaterial({color:c,roughness:.88,metalness:0});M.push(m);return m};
 const put=(bone,geo,c,x,y,z,sx,sy,sz)=>{const o=new THREE.Mesh(geo,mt(c));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.frustumCulled=false;bone.add(o);return o};
 const limb=(bone,child,r0,r1,c,f0,f1,ex,ez,dz)=>{const d=child.position.clone(),L=d.length();Q.setFromUnitVectors(V,d.clone().normalize());
  const o=put(bone,new THREE.CylinderGeometry(r1,r0,L*(f1-f0),20),c,d.x*(f0+f1)/2,d.y*(f0+f1)/2,d.z*(f0+f1)/2+(dz||0),ex||1,1,ez||1);o.quaternion.copy(Q);return o};
 const ball=(bone,c,x,y,z,rx,ry,rz)=>put(bone,new THREE.SphereGeometry(1,16,12),c,x,y,z,rx,ry,rz);
 const box=(bone,c,x,y,z,w,h,d)=>put(bone,new THREE.BoxGeometry(w,h,d),c,x,y,z,1,1,1);
 const AZ=0x4a69ab,AZ2=0x2e3a66,RO=0xe24f9c,BR=0xf0f0f4,PA=0x4a4070,PA2=0x382f58,MG=0x8c3a74,MG2=0xb04a8a,SAN=0xdcdae4,DK=0x2a2a30,COR=0xe9b9a0;
 const H=B('Hips'),S=B('Spine'),S1=B('Spine1'),S2=B('Spine2'),hd=B('Head'),nk=B('Neck');
 // ---- cintura/quadril: calça (cobre a pelve toda) + faixa magenta grossa + laço grande
 limb(H,S,21.5,19.5,PA,-1.7,.5,1,.98,-1.8);limb(H,S,20.2,19.4,MG,.28,1.12,1,.96,-1.6);limb(H,S,20.6,19.8,MG2,.28,.4,1,.97,-1.6);
 box(H,AZ2,4,0,15.3,2.8,16,1.5);box(H,AZ2,-4,-4,15.2,2.8,14,1.5);ball(H,AZ2,0,8.5,15,3.2,3,1.8);
 // ---- camisa branca + jaqueta azul curta (cobre costas e frente) com lapela rosa
 limb(S,S1,18.2,18,BR,0,1.04,1,.96,-1.6);
 limb(S,S1,19.4,19.8,AZ,.5,1.05,1,.98,-1.4);limb(S1,S2,19.8,21,AZ,0,1.04,1,.98,-1.4);limb(S2,nk,22,18,AZ,0,1.02,1,.96,-1.2);
 limb(S,S1,19.6,19.9,RO,.46,.56,1,.98,-1.4);                              // barra rosa da jaqueta
 for(const sg of[1,-1]){box(S,RO,sg*5.4,5,16.6,3.4,12,1);box(S1,RO,sg*5.4,0,17.4,3.4,12,1);box(S2,RO,sg*5.4,2,18.6,3.6,22,1);}
 box(S2,AZ2,0,2,18.2,7.4,22,1);box(S1,AZ2,0,0,17,7.4,12,1);box(S2,BR,0,14,18,5.4,9,1);
 box(S2,AZ2,0,2,-16.4,22,20,1);box(S1,AZ2,0,-3,-17,2,10,1);                    // costas: pano da jaqueta com costura central
 for(let k=0;k<3;k++)box(S1,AZ2,0,-4+k*5,-16.9,34,.8,1);                         // dobras horizontais nas costas
 ball(S2,BR,-14,11,11,2.6,2.6,1.5);ball(S2,BR,-14,6,11.5,2,3.4,1.2);box(S2,BR,-14,2,11.5,1,6,.8); // trevo + fita branca
 limb(nk,hd,5.8,5.4,COR,0,.6,1,1);
 for(const sd of['Left','Right']){
  const up=B(sd+'UpLeg'),kn=B(sd+'Leg'),ft=B(sd+'Foot'),to=B(sd+'ToeBase'),sg=sd==='Left'?1:-1;
  // calça larga (hakama) com dobras, boca da canela cinchada, faixa magenta com corda e meia branca
  limb(up,kn,14.2,13.2,PA,-.1,1.03,1.05,1.14).position.x+=sg*1.2;ball(kn,PA,0,0,2,13,13,13.5);
  limb(up,kn,14.6,14.6,PA2,.28,.34,1.05,1.14).position.x+=sg*1.2;limb(up,kn,13.6,13.6,PA2,.62,.67,1.05,1.14).position.x+=sg*1.2;
  limb(kn,ft,13,11.8,PA,0,.64,1.04,1.1);limb(kn,ft,12,11,PA2,.2,.26,1.04,1.1);ball(kn,PA2,0,-14,8,9.5,5,5);
  limb(kn,ft,9.6,8,MG,.62,1.0);limb(kn,ft,10.2,9.6,0x6b2f5c,.64,.7);limb(kn,ft,9,8.5,COR,.9,.95);
  limb(ft,to,6.4,5.6,SAN,-.1,1.05,1.02,1);ball(to,SAN,0,0,5,5.6,4.2,6.6);box(to,DK,0,-3.6,3.5,11.5,2.2,15.5);box(ft,DK,0,3,5,.9,.9,10);
  // manga curta larga em camadas + atadura
  const sh=B(sd+'Shoulder'),ar=B(sd+'Arm'),fo=B(sd+'ForeArm'),ha=B(sd+'Hand');
  limb(sh,ar,7,7.4,AZ,0,1);ball(ar,AZ,0,0,0,8,8,8);limb(ar,fo,9.4,9,AZ,0,.66);limb(ar,fo,9.7,9.6,AZ2,.62,.7);limb(ar,fo,10.4,9.8,AZ,.18,.5,1,1);
  limb(fo,ha,5,4.5,BR,.28,1.0);limb(fo,ha,5.3,5.3,0xcfcfd6,.45,.5);limb(fo,ha,5.3,5.3,0xcfcfd6,.7,.75);
  if(sg<0){ball(fo,0xb02030,3,14,4.3,1.6,3.2,.9);ball(fo,0xb02030,-3,19,3.5,1.2,2.2,.9);ball(fo,0xb02030,2,22,-3,1.4,2.4,.9)}
 }
 // ---- cabeça: cabelo preto + coque, máscara oni (rosto vermelho, testa dourada, dentes, nariz) e chifres curvos
 ball(hd,0x161616,0,15.4,-.6,9.9,11.6,12.6);ball(hd,0x161616,0,27,-3,3.8,4.4,3.8);ball(hd,0x161616,-2,29,-3,1.5,4.2,1.5);ball(hd,0x161616,2,29,-3,1.5,4.2,1.5);
 ball(hd,0xc0282a,0,11.4,10.2,8.8,10.6,3.6);ball(hd,0xa81f22,-5.2,8.5,12,3.4,3.4,2.4);ball(hd,0xa81f22,5.2,8.5,12,3.4,3.4,2.4);   // rosto + bochechas
 ball(hd,0xcfa74e,0,20,10.6,7,3.3,3.2);ball(hd,0xe2c15c,0,20,13,2,1.8,1);box(hd,0xcfa74e,0,16.6,13.4,1.2,5,1.2);                 // testa dourada
 ball(hd,0x0d0d0d,-3.7,13.6,13.4,2.5,1.1,.9);ball(hd,0x0d0d0d,3.7,13.6,13.4,2.5,1.1,.9);box(hd,0x1a0f0f,-3.8,16.2,13.2,4.5,.9,1);box(hd,0x1a0f0f,3.8,16.2,13.2,4.5,.9,1);// olhos e sobrancelhas
 ball(hd,0x8a1518,0,10,14.2,1.8,2.4,1.6);                                                                                              // nariz
 box(hd,0x2b1c14,0,5,12.8,9,3.4,2.2);for(let k=-3;k<=3;k++)box(hd,0xf4f0e2,k*1.15,5.8,14.1,.8,1.8,.8);                                // boca com dentes
 for(const sg of[1,-1]){
  const a=put(hd,new THREE.ConeGeometry(2,8,10),0x2e2420,sg*8.2,23,6,1,1,1);a.rotation.z=-sg*.35;
  const b=put(hd,new THREE.ConeGeometry(1.5,6,10),0x2e2420,sg*10.8,28,6,1,1,1);b.rotation.z=-sg*.8;
 }
}
