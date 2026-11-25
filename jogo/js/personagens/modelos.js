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

// ===== roupa do Xbot: peças presas aos OSSOS (seguem as animações). Medidas em cm (unidade local dos ossos), tiradas do corpo do modelo =====
function xbClothes(root,M){
 const B=n=>root.getObjectByName('mixamorig'+n),V=new THREE.Vector3(0,1,0),Q=new THREE.Quaternion();
 root.traverse(o=>{if(o.isSkinnedMesh&&o.material){o.material.color.setHex(/Joints/.test(o.name)?0x7a4f33:0xc9966b);if(o.material.roughness!==undefined)o.material.roughness=.7}});
 const mt=c=>{const m=new THREE.MeshStandardMaterial({color:c,roughness:.88,metalness:0});M.push(m);return m},cache={};
 const put=(bone,geo,c,x,y,z,sx,sy,sz)=>{const o=new THREE.Mesh(geo,mt(c));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.frustumCulled=false;bone.add(o);return o};
 // tubo do osso até o filho (r0 perto do osso, r1 perto do filho), de f0 a f1 do comprimento; ex/ez = achatamento (tronco é elíptico)
 const limb=(bone,child,r0,r1,c,f0,f1,ex,ez)=>{const d=child.position.clone(),L=d.length();Q.setFromUnitVectors(V,d.clone().normalize());
  const o=put(bone,new THREE.CylinderGeometry(r1,r0,L*(f1-f0),18),c,d.x*(f0+f1)/2,d.y*(f0+f1)/2,d.z*(f0+f1)/2,ex||1,1,ez||1);o.quaternion.copy(Q);return o};
 const ball=(bone,c,x,y,z,rx,ry,rz)=>put(bone,new THREE.SphereGeometry(1,14,10),c,x,y,z,rx,ry,rz);
 const SH=0x2f3640,VE=0x474f36,PA=0x3b4132,BO=0x1d1915,GL=0x17171a,CAP=0x2d3826,BLK=0x141518;
 // quadril/cinto, barriga, peito, colete
 limb(B('Hips'),B('Spine'),22,20.5,PA,-1.5,1.02,1,.86);limb(B('Hips'),B('Spine'),20.6,20.2,BLK,.55,.9,1,.7);
 limb(B('Spine'),B('Spine1'),17.8,17.2,SH,0,1.03,1,.76);limb(B('Spine1'),B('Spine2'),17.2,17.8,SH,0,1.03,1,.8);
 limb(B('Spine2'),B('Neck'),20.2,17.2,VE,0,1.0,1,.73);
 const S2=B('Spine2');for(const x of[-9,0,9])put(S2,new THREE.BoxGeometry(7,8,3.2),0x3a4130,x,6,14.6,1,1,1);put(S2,new THREE.BoxGeometry(24,9,2.4),0x3a4130,0,12,-14.6,1,1,1);
 // mochila nas costas
 put(S2,new THREE.BoxGeometry(24,26,11),0x39402f,0,7,-20.5,1,1,1);put(S2,new THREE.BoxGeometry(19,10,3),0x2d3326,0,-1,-27,1,1,1);
 for(const sd of['Left','Right']){
  const up=B(sd+'UpLeg'),kn=B(sd+'Leg'),ft=B(sd+'Foot'),to=B(sd+'ToeBase'),sg=sd==='Left'?1:-1;
  limb(up,kn,13,10.4,PA,-.1,1.03,1.05,1.15).position.x+=sg*1.2;ball(kn,PA,0,0,0,10.4,10.4,10.4);
  limb(kn,ft,10,8,PA,0,.58,1.05,1.12);limb(kn,ft,8.6,7.2,BO,.56,1.02);       // calça + cano da bota
  limb(ft,to,6.6,5.8,BO,-.1,1.05,1.02,1);ball(to,BO,0,0,5,5.8,4.4,6.8);   // pé da bota
  // braço: manga, ombro, punho, luva
  const sh=B(sd+'Shoulder'),ar=B(sd+'Arm'),fo=B(sd+'ForeArm'),ha=B(sd+'Hand'),mi=B(sd+'HandMiddle1');
  limb(sh,ar,6.3,6,SH,0,1);ball(ar,SH,0,0,0,6.6,6.6,6.6);limb(ar,fo,5.9,5,SH,0,1.02);limb(fo,ha,4.5,4.2,SH,0,.28);
  limb(ha,mi,4.5,4.1,GL,-.25,1.4);ball(ha,GL,mi.position.x*.5,mi.position.y*.5,mi.position.z*.5,4.8,4.8,4.8);
 }
 // cabeça: boné com aba + óculos/viseira
 const hd=B('Head');
 put(hd,new THREE.SphereGeometry(1,18,10,0,6.2832,0,1.5708),CAP,0,17.2,.5,10.4,12.4,13.6);   // calota do boné
 put(hd,new THREE.BoxGeometry(17,1.2,9),CAP,0,18.8,12.6,1,1,1);                              // aba
 ball(hd,BLK,0,17.4,.3,9.4,2.6,12.9);ball(hd,0x4aa8ff,0,17.4,3.4,7.6,1.9,10.2);               // faixa dos óculos + lentes
}
