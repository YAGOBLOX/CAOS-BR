/* CAOS BR FPS · boneco estilo Minecraft (blocos) para as skins do tipo 'mc'
   - A skin é UMA imagem PNG 64x64 (ou 64x32 antiga) no layout padrão do Minecraft. Braço fino (slim) é detectado sozinho.
   - mcBody(skin) monta o boneco; poseM() anima (andar, agachar, deitar, mirar). Usa a mesma arma/IK simples dos outros modelos.
   - Unidade do modelo = 1 pixel da skin; a altura total é 32 px => escala 61/32 (mesma altura do Xbot). */
function mcBody(sk){
 const tex=CAOS.skinTex[sk.id],TW=64,TH=tex.image.height||64,slim=!!sk.slim,k=XB_H/32;
 const mat=new THREE.MeshLambertMaterial({map:tex,alphaTest:.5,transparent:false}),M=[mat];
 // caixa w×h×d com UV do layout do Minecraft: (ox,oy) = canto da região da peça na imagem; infl = tamanho extra da camada de cima
 const box=(w,h,d,ox,oy,infl)=>{
  const g=new THREE.BoxGeometry(w+2*infl,h+2*infl,d+2*infl),uv=g.attributes.uv;
  const R=[[ox+d+w,oy+d,d,h],[ox,oy+d,d,h],[ox+d,oy,w,d],[ox+d+w,oy,w,d],[ox+d,oy+d,w,h],[ox+2*d+w,oy+d,w,h]];   // +x(esq. do boneco), -x(dir.), topo, base, frente, costas
  R.forEach((r,f)=>{const u0=r[0]/TW,u1=(r[0]+r[2])/TW,v0=1-(r[1]+r[3])/TH,v1=1-r[1]/TH,i=f*4;
   uv.setXY(i,u0,v1);uv.setXY(i+1,u1,v1);uv.setXY(i+2,u0,v0);uv.setXY(i+3,u1,v0)});
  const m=new THREE.Mesh(g,mat);m.castShadow=true;m.frustumCulled=false;return m};
 const G=(p,x,y,z)=>{const q=new THREE.Group();q.position.set(x,y,z);p.add(q);return q};
 const g=new THREE.Group(),hold=new THREE.Group();hold.scale.setScalar(k);hold.rotation.y=Math.PI/2;g.add(hold);
 const old=TH>=64,aw=slim?3:4;
 const part=(p,w,h,d,o1,o2,cy,inf1,inf2)=>{const a=box(w,h,d,o1[0],o1[1],0);a.position.y=cy;p.add(a);
  if(o2){const b=box(w,h,d,o2[0],o2[1],inf2||.25);b.position.y=cy;p.add(b)}};
 const legR=G(hold,-2,12,0),legL=G(hold,2,12,0),up=G(hold,0,12,0);
 part(legR,4,12,4,[0,16],old?[0,32]:null,-6);part(legL,4,12,4,old?[16,48]:[0,16],old?[0,48]:null,-6);
 part(up,8,12,4,[16,16],old?[16,32]:null,6);
 const head=G(up,0,12,0);part(head,8,8,8,[0,0],[32,0],4,0,.5);
 const armR=G(up,-(4+aw/2),10,0),armL=G(up,4+aw/2,10,0);
 part(armR,aw,12,4,[40,16],old?[40,32]:null,-4);part(armL,aw,12,4,old?[32,48]:[40,16],old?[48,48]:null,-4);
 const gn=new THREE.Group();gn.gs=gunModels(null);gn.gs.forEach(x=>{if(x)gn.add(x)});gn.scale.setScalar(.8);g.add(gn);
 return{mc:1,g,hold,up,legR,legL,armR,armL,head,gn,M,lx:0,ly:0,k};
}
function poseM(e,m,a,t){
 const d=Math.min(6,Math.hypot(e.x-m.lx,e.y-m.ly));m.lx=e.x;m.ly=e.y;
 const dt=Math.max(0,Math.min(.05,t-(m.pt===undefined?t:m.pt)));m.pt=t;const kk=1-Math.exp(-dt*11);
 m.amp=(m.amp||0)+((e.z>(e.gz||0)+.5?0:Math.min(1,d/2.2))-(m.amp||0))*.25;m.ph=(m.ph||0)+d*.09;
 const dead=e.hp<=0;m.cs=(m.cs||0)+(((e.st===1&&!dead)?1:0)-(m.cs||0))*kk;m.ps=(m.ps||0)+(((e.st===2&&!dead)?1:0)-(m.ps||0))*kk;
 const am=m.amp,cs=m.cs,ps=m.ps,L=(x,y,k)=>x+(y-x)*k,k=m.k,g=m.g,Th=.4*cs;
 // pernas: balançam ao andar; agachado ficam dobradas para frente e o corpo abaixa e inclina
 const sw=Math.sin(m.ph*3.2)*.85*am*(1-ps)*(1-.5*cs);
 m.legR.rotation.x=-Th+sw;m.legL.rotation.x=-Th-sw;
 const hipY=12*Math.cos(Th)-(dead?0:0);
 m.legR.position.y=m.legL.position.y=hipY;m.up.position.y=hipY+Math.abs(Math.sin(m.ph*3.2))*.3*am;m.up.rotation.x=.3*cs;
 m.head.rotation.x=-.25*cs;
 const lie=dead?1:ps;g.position.set(e.x,e.z+4*lie,e.y);g.rotation.set(0,-a,-1.5*lie);g.scale.setScalar(1);
 const wi=e.w===undefined?BOTW:e.w,has=!!m.gn.gs[wi];m.gn.gs.forEach((x,i)=>{if(x){x.visible=i===wi;if(i===wi&&x.userData.need)x.userData.need()}});
 if(!dead){
  const hy=(hipY+10*Math.cos(.3*cs))*k-1;
  const rx=m.relax||0;m.gn.position.set(L(20+3*cs-3*rx,-2,ps),L(hy-14*rx,62,ps),3+2*rx);m.gn.rotation.z=ps*1.5708-.6*rx;m.gn.visible=true;
  g.updateMatrixWorld(true);m.gn.updateMatrixWorld(true);
  const fg=has?Math.min(foreOf(wi),5):5,T1=m.gn.localToWorld(new THREE.Vector3(0,-.4,.4)),T2=m.gn.localToWorld(new THREE.Vector3(fg,-1.4,-3.2));
  const aim=(arm,T)=>{const p=m.up.worldToLocal(T.clone()).sub(arm.position),len=p.length()||1;   // braço aponta para a mão-alvo (comprimento levemente ajustado)
   arm.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),p.multiplyScalar(1/len));arm.scale.y=Math.max(.85,Math.min(1.2,len/12))};
  aim(m.armR,T1);aim(m.armL,T2);
 }else{m.gn.visible=false;m.armR.rotation.set(0,0,.12);m.armL.rotation.set(0,0,-.12);m.armR.scale.y=m.armL.scale.y=1}
 for(const mt of m.M)if(mt.emissive)mt.emissive.setHex(e.fl>0?0xffffff:0);
}
