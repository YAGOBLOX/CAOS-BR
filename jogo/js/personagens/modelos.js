/* CAOS BR FPS · modelo 3D do humanoide (jogador e bots): articulações encaixadas (quadril, joelho, ombro, cotovelo) */
function humanoid(pl,shc){
 if(pl){const sk=CAOS.skinCur&&CAOS.skinCur();if(sk&&sk.tipo==='mc'&&CAOS.skinTex&&CAOS.skinTex[sk.id])return mcBody(sk)}   // skin escolhida (blocos tipo Minecraft)
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
 const sk=CAOS.skinCur&&CAOS.skinCur(),glbOk=sk&&sk.glb&&CAOS.skinGlb&&CAOS.skinGlb[sk.id];
 if(glbOk){try{xbGlbSkin(root,M,sk)}catch(e){console.warn('[skin glb]',e);xbClothes(root,M)}}else xbClothes(root,M);
 const mx=new THREE.AnimationMixer(root),act={};
 X.animations.forEach(c=>{act[c.name]=mx.clipAction(c)});
 for(const n of['idle','walk','run','sneak_pose']){if(act[n]){act[n].play();act[n].setEffectiveWeight(n==='idle'?1:0)}}
 // o three r128 mede a malha pelo bind pose (errado p/ este modelo); a altura real do Xbot é 1,8 m com os pés em y=0 (medido pelos ossos)
 hold.scale.setScalar(XB_H/1.8);hold.rotation.y=Math.PI/2;hold.add(root);g.add(hold);
 const B=n=>root.getObjectByName('mixamorig'+n);
 const gn=new THREE.Group();gn.gs=gunModels(null);gn.gs.forEach(x=>{if(x)gn.add(x)});gn.scale.setScalar(.8);g.add(gn);
 return{xb:1,nw:glbOk?1:0,g,hold,root,mx,act,gn,M,lx:0,ly:0,
  bn:{rU:B('RightArm'),rF:B('RightForeArm'),rH:B('RightHand'),lU:B('LeftArm'),lF:B('LeftForeArm'),lH:B('LeftHand')}};
}

// ===== roupa do Xbot (samurai/oni, ref. do dono) =====
// Roupa = cópia "inflada" da própria malha do corpo, ligada ao MESMO esqueleto (skinning): dobra lisa nas articulações, sem peças atravessando.
// Cada vértice recebe cor/folga por região (altura y e abertura x do corpo em T-pose). Medidas em metros (corpo = 1,806 de altura). Cabeça: peças rígidas no osso Head.
function xbClothes(root,M){
 const B=n=>root.getObjectByName('mixamorig'+n);
 const AZ=0x4a69ab,AZ2=0x2e3a66,RO=0xe24f9c,BR=0xf0f0f4,PA=0x4a4070,PA2=0x352c55,MG=0x8c3a74,MG2=0xb04a8a,SAN=0xdcdae4,DK=0x2a2a30,COR=0xe9b9a0,SKIN=0xd9a87c,SKJ=0xb98560,BL=0xb02030;
 const srcs=[];root.traverse(o=>{if(o.isSkinnedMesh&&o.material){o.material.color.setHex(/Joints/.test(o.name)?SKJ:SKIN);if(o.material.roughness!==undefined)o.material.roughness=.7;srcs.push(o)}});
 srcs.sort((a,b)=>/Surface/.test(a.name)?-1:1);let Y0=0,SC=1;   // altura/escala vêm da malha Surface; a Joints (juntas pretas do Xbot: cintura, joelhos...) também ganha roupa
 const mt=c=>{const m=new THREE.MeshStandardMaterial({color:c,roughness:.88,metalness:0});M.push(m);return m};
 const put=(bone,geo,c,x,y,z,sx,sy,sz)=>{const o=new THREE.Mesh(geo,mt(c));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.frustumCulled=false;bone.add(o);return o};
 const ball=(bone,c,x,y,z,rx,ry,rz)=>put(bone,new THREE.SphereGeometry(1,16,12),c,x,y,z,rx,ry,rz);
 const box=(bone,c,x,y,z,w,h,d)=>put(bone,new THREE.BoxGeometry(w,h,d),c,x,y,z,1,1,1);
 const hd=B('Head');
 const mix=(a,b,k)=>{const ca=new THREE.Color(a),cb=new THREE.Color(b);return ca.lerp(cb,Math.max(0,Math.min(1,k))).getHex()};
 srcs.forEach(sm=>{
  const g=sm.geometry.clone(),P=g.attributes.position,N=g.attributes.normal,n=P.count;
  if(/Surface/.test(sm.name)){let a=1e9,b=-1e9;for(let i=0;i<n;i++){const y=P.getY(i);if(y<a)a=y;if(y>b)b=y}Y0=a;SC=(b-a)/1.806}
  const y0=Y0,s=SC,cm=.01*s;
  // normais suavizadas (vértices na mesma posição somam) para a roupa inflar sem abrir buracos
  const key=i=>Math.round(P.getX(i)*1e4)+','+Math.round(P.getY(i)*1e4)+','+Math.round(P.getZ(i)*1e4),mp=new Map();
  for(let i=0;i<n;i++){const k=key(i);let a=mp.get(k);if(!a){a=[0,0,0];mp.set(k,a)}a[0]+=N.getX(i);a[1]+=N.getY(i);a[2]+=N.getZ(i)}
  const col=new Float32Array(n*3),inf=new Float32Array(n),c=new THREE.Color();
  for(let i=0;i<n;i++){
   const x=P.getX(i)/s,y=(P.getY(i)-y0)/s,z=P.getZ(i)/s,ax=Math.abs(x);let hex=SKIN,f=0;
   if(y<.1){hex=y<.03?DK:SAN;f=.7}                                                   // meia branca + sola da sandália
   else if(y<.13){hex=SAN;f=.4}
   else if(y<.31){hex=y>.27?COR:(Math.floor(y*55)%2?MG:MG2);f=y>.27?1.9:1.3}           // faixa magenta com corda
   else if(y<.97&&ax<.3){f=y<.37?4.2-(y-.31)*20:(y<.5?3:(y<.8?3-(y-.5)*6.7:1));if(y>.78&&z<0)f=.4;hex=mix(PA,PA2,.5+.5*Math.sin(y*170+ax*30))}  // calça larga (hakama) com dobras
   else if(y<1.12&&ax<.3){hex=MG;f=1.2;if(z>0&&ax<.03&&y<1.06){hex=AZ2;f=2.2}}          // faixa da cintura + ponta do laço
   else if(ax<.17&&y<1.47){f=1.7;hex=AZ;                                           // jaqueta
    if(z>.02){if(ax>.05&&ax<.095)hex=RO;else if(ax<=.05)hex=y>1.4?BR:AZ2}else if(z<-.02&&ax<.01)hex=AZ2;
    if(y<1.16)hex=mix(AZ,RO,1)}
   else if(ax>=.17&&y>1.2&&y<1.56){                                                 // braço
    if(ax<.45){hex=AZ;f=1.8+(ax-.17)*3.4}else if(ax<.48){hex=AZ2;f=2.8}
    else if(ax<.72){hex=BR;f=.9;if(x<0&&ax>.52&&ax<.66&&z>-.02&&(Math.floor(ax*70)+Math.floor(y*40))%3===0)hex=BL}}
   const k=key(i),a=mp.get(k),L=Math.hypot(a[0],a[1],a[2])||1;
   P.setXYZ(i,P.getX(i)+a[0]/L*f*cm,P.getY(i)+a[1]/L*f*cm,P.getZ(i)+a[2]/L*f*cm);
   c.setHex(hex);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;inf[i]=f;
  }
  // só mantém triângulos que têm roupa (o resto é pele que já existe)
  const idx=g.index?Array.from(g.index.array):Array.from({length:n},(_,i)=>i),keep=[];
  for(let t=0;t<idx.length;t+=3)if(inf[idx[t]]>0||inf[idx[t+1]]>0||inf[idx[t+2]]>0)keep.push(idx[t],idx[t+1],idx[t+2]);
  g.setIndex(keep);g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.MeshStandardMaterial({vertexColors:true,skinning:true,roughness:.9,metalness:0,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});M.push(mat);
  const cl=new THREE.SkinnedMesh(g,mat);cl.position.copy(sm.position);cl.quaternion.copy(sm.quaternion);cl.scale.copy(sm.scale);
  sm.parent.add(cl);cl.bind(sm.skeleton,sm.bindMatrix);cl.frustumCulled=false;cl.castShadow=true;
 });
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


// ===== skin em GLB SEM esqueleto (ex.: GOJO): a malha é ligada ao esqueleto do Xbot por TRANSFERÊNCIA DE PESOS (vértice mais próximo do corpo do Xbot) =====
// 1) a malha (pose A, braços caídos) é escalada para a altura do Xbot e os braços são girados até a horizontal (T-pose, igual ao Xbot) e esticados até o comprimento do braço do Xbot;
// 2) cada vértice copia índice/peso dos ossos do vértice do Xbot mais perto; 3) vira SkinnedMesh no mesmo esqueleto (anda, corre, agacha, deita e segura arma como o Xbot).
function xbGlbSkin(root,M,sk){
 const src=CAOS.skinGlb[sk.id];root.updateMatrixWorld(true);
 const srcs=[];root.traverse(o=>{if(o.isSkinnedMesh)srcs.push(o)});
 const sm=srcs.find(o=>/Surface/.test(o.name))||srcs[0],SP=sm.geometry.attributes.position,SI=sm.geometry.attributes.skinIndex,SW=sm.geometry.attributes.skinWeight,n=SP.count;
 let y0=1e9,y1=-1e9,tip=0;for(let i=0;i<n;i++){const y=SP.getY(i);if(y<y0)y0=y;if(y>y1)y1=y;tip=Math.max(tip,Math.abs(SP.getX(i)))}
 const H=y1-y0,inv=new THREE.Matrix4().copy(sm.matrixWorld).invert(),bp=nm=>{const b=root.getObjectByName('mixamorig'+nm);return b.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv)};
 const ku=Math.abs(bp('LeftArm').y)>H*5?.01:1,shX=Math.abs(bp('LeftArm').x)*ku,shY=bp('LeftArm').y*ku;   // (osso pode vir em cm e a malha em m)
 // grade espacial do corpo do Xbot
 const cs=H/45,gr=new Map(),key=(x,y,z)=>Math.floor(x/cs)+','+Math.floor(y/cs)+','+Math.floor(z/cs);
 for(let i=0;i<n;i++){const k=key(SP.getX(i),SP.getY(i),SP.getZ(i));let a=gr.get(k);if(!a)gr.set(k,a=[]);a.push(i)}
 const near=(x,y,z)=>{const cx=Math.floor(x/cs),cy=Math.floor(y/cs),cz=Math.floor(z/cs);
  for(let r=1;r<=8;r++){let b=-1,bd=1e18;for(let a=-r;a<=r;a++)for(let c=-r;c<=r;c++)for(let d=-r;d<=r;d++){if(Math.max(Math.abs(a),Math.abs(c),Math.abs(d))!==r&&r>1)continue;const l=gr.get((cx+a)+','+(cy+c)+','+(cz+d));if(!l)continue;for(const i of l){const q=(SP.getX(i)-x)**2+(SP.getY(i)-y)**2+(SP.getZ(i)-z)**2;if(q<bd){bd=q;b=i}}}
   if(b>=0)return b}return 0};
 src.updateMatrixWorld(true);
 const GH=6.74,f=H/GH,PX=.78,PY=5.45,AL=3.52-PX,ANG=0.974,cA=Math.cos(ANG),sA=Math.sin(ANG),r=(tip-shX)/(AL*f),dyS=shY-(y0+(PY+.015)*f);
 const sst=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
 src.traverse(o=>{if(!o.isMesh)return;
  const g=o.geometry.clone();g.applyMatrix4(o.matrixWorld);const P=g.attributes.position,m=P.count,idx=new Uint16Array(m*4),wt=new Float32Array(m*4),arm=/0034/.test(o.name);
  for(let i=0;i<m;i++){
   let x=P.getX(i),y=P.getY(i),z=P.getZ(i);
   if(arm){const sg=x<0?-1:1,ax=Math.abs(x),w=sst(.55,1.05,ax)*(y<5.8?1:0);
    if(w>0){const dx=ax-PX,dy=y-PY,a=ANG*w,ca=Math.cos(a),sa=Math.sin(a);let nx=dx*ca-dy*sa,ny=dx*sa+dy*ca;if(nx>0)nx=nx*(1+(r*f/f-1)*w*1);x=sg*(PX+nx);y=PY+ny}}   // gira (e depois estica) o braço
   const X=x*f,Y=y0+(y+.015)*f+0,Z=(z+.06)*f;
   P.setXYZ(i,X,Y,Z);
   const j=near(X,Y,Z);for(let k=0;k<4;k++){idx[i*4+k]=SI.getComponent?SI.getComponent(j,k):SI.array[j*4+k];wt[i*4+k]=SW.array[j*4+k]}
  }
  g.setAttribute('skinIndex',new THREE.BufferAttribute(idx,4));g.setAttribute('skinWeight',new THREE.BufferAttribute(wt,4));
  const mm=o.material,tx=mm.map;if(tx)tx.encoding=THREE.LinearEncoding;
  const mat=new THREE.MeshLambertMaterial({map:tx||null,color:mm.color,skinning:true,side:mm.side,transparent:mm.transparent,opacity:mm.opacity,alphaTest:mm.alphaTest||0});M.push(mat);
  const cl=new THREE.SkinnedMesh(g,mat);cl.position.copy(sm.position);cl.quaternion.copy(sm.quaternion);cl.scale.copy(sm.scale);
  sm.parent.add(cl);cl.bind(sm.skeleton,sm.bindMatrix);cl.frustumCulled=false;cl.castShadow=true});
 srcs.forEach(o=>{o.visible=false});
}
