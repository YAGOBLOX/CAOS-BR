/* CAOS BR FPS · modelos 3D das armas */
const BOTW=WP.findIndex(w=>w.id==='m4a1');   // arma que os bots seguram
function gunModels(only){
 const mt=c=>new THREE.MeshLambertMaterial({color:c}),dk=mt(0x23252b),md=mt(0x3b3f48),wd=mt(0x6b4a2a),ac=mt(0x9aa0aa),gl=new THREE.MeshLambertMaterial({color:0x4aa8ff,emissive:0x0a2a50});
 const bg=new THREE.BoxGeometry(1,1,1),cg=new THREE.CylinderGeometry(.5,.5,1,14);
 const P=(g,geo,m,x,y,z,sx,sy,sz,rz)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);if(rz)o.rotation.z=rz;o.castShadow=true;g.add(o);return o};
 const B=(g,m,x,y,z,sx,sy,sz,rz)=>P(g,bg,m,x,y,z,sx,sy,sz,rz),T=(g,m,x,y,len,d)=>P(g,cg,m,x+len/2,y,0,d,len,d,1.5708);
 const defs=[
  g=>{B(g,md,6,1.2,0,15,3.6,3.2);B(g,dk,12,-.2,0,3,.6,2.6);B(g,dk,1,-3.6,0,4,8.5,3,.25);B(g,ac,13.5,1.2,0,1.5,2,2.4)},
  g=>{B(g,dk,8,0,0,15,4.4,3.6);T(g,dk,16,.4,13,1.8);B(g,wd,20,-.4,0,10,3.8,3.6);B(g,wd,-5,-.8,0,11,4.6,3,-.1);B(g,md,9,-6.5,0,4,11,3,.22);B(g,ac,13,2.6,0,2,1.6,1.6);B(g,ac,26,1.4,0,.8,2.2,.8)},
  g=>{B(g,dk,8,0,0,14,4.4,3.6);T(g,dk,15,1.2,26,2.2);T(g,md,15,-1,22,2.4);B(g,wd,22,-2.2,0,10,3.8,4);B(g,wd,-6,-1,0,13,4.6,3.2,-.12)},
  g=>{B(g,dk,8,0,0,16,4.6,3.6);T(g,dk,16,.8,8,2);B(g,md,9,-8,0,3.4,13,3,.05);B(g,md,-4,.6,0,9,1.6,1.6);B(g,ac,12,3,0,6,1.4,1.4)},
  g=>{B(g,dk,8,0,0,18,4.2,3.4);T(g,dk,17,.6,28,2.2);B(g,wd,-6,-1,0,15,5,3.6,-.1);T(g,dk,6,4.6,13,3.2);B(g,gl,5.5,4.6,0,.6,2.6,2.6);B(g,gl,18.4,4.6,0,.6,2.6,2.6);B(g,md,9,-5,0,3,7,2.8,.15)},
  g=>{T(g,dk,6,.8,12,2.2);P(g,cg,md,4,.4,0,6.4,3.4,6.4,1.5708);B(g,dk,2,-.2,0,8,4,3);B(g,wd,0,-4.6,0,3.6,8,3,.35)}
 ];
 // armas novas: malha vinda do OBJ (GUNMESH em armas-3d.js) com 3 cores por vértice: escuro, madeira e metal claro; o PUNHO fica sem modelo (mãos vazias)
 const gm=new THREE.MeshPhongMaterial({color:0xffffff,vertexColors:true,side:THREE.DoubleSide,specular:0x2a2a2a,shininess:35});
 // cores por região (x = cano, y = altura; coordenadas do OBJ x20). cls: 0 escuro, 1 madeira, 2 metal claro
 const H=h=>[(h>>16&255)/255,(h>>8&255)/255,(h&255)/255];
 const C={poly:H(0x1d1f23),gun:H(0x3b414c),blue:H(0x2c3340),steel:H(0xaab2bb),nick:H(0xd2d6da),wood:H(0x7b4a22),wood2:H(0x9a6232),dwood:H(0x4e2f16),tan:H(0xa68b5b),olive:H(0x4d5a37),brass:H(0xc9a24a),lens:H(0x4aa8ff),rust:H(0x5b3a22),ivory:H(0xd9cfb0)};
 const colr=(m,c,x,y,z)=>{
  switch(m){
   case 'm249':return c===2?C.steel:(y<-45||x<-60?C.olive:C.gun);
   case 'awm':return c===2?(y>35?C.blue:C.steel):(x<60?C.olive:(y<-30?C.olive:C.gun));
   case 'dragunov':return c===1?(x>150?C.wood2:C.wood):(c===2?C.steel:C.blue);
   case 'rpg7':return c===1?C.wood:(c===2?(x>380?C.olive:C.olive):(x<-130?C.gun:C.blue));
   case 'espingarda':return c===1?C.wood:(c===2?C.steel:C.blue);
   case 'peacemaker':return c===1?C.ivory:(c===2?C.nick:C.gun);
  }
  return [C.poly,C.wood,C.steel][c||0];
 };
 const meshGun=(g,d,mn)=>{const p=new Float32Array(d.v.length),c=new Float32Array(d.v.length);for(let k=0;k<p.length;k++)p[k]=d.v[k]/20;
  for(let k=0;k<d.v.length/3;k++){const x=d.v[k*3],y=d.v[k*3+1],z=d.v[k*3+2],q=colr(mn,d.c?d.c[k]:0,x,y,z),sh=1+((x*7+y*13)%9-4)*.012;c[k*3]=q[0]*sh;c[k*3+1]=q[1]*sh;c[k*3+2]=q[2]*sh}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(p,3));geo.setAttribute('color',new THREE.BufferAttribute(c,3));geo.setIndex(d.i);
  const fl=geo.toNonIndexed();fl.computeVertexNormals();const o=new THREE.Mesh(fl,gm);o.castShadow=true;g.add(o)};
 // armas em GLB: o arquivo só é baixado/montado quando a arma aparece na mão (g.userData.need() é chamado por animacoes.js/skin-mc.js)
 const glb=(g,id)=>{let on=0;g.userData.need=()=>{if(on)return;on=1;CAOS.gunGlb(id).then(h=>{if(h)g.add(h)})}};
 return WP.map((w,i)=>{if(only&&!only.includes(i))return null;if(w.hide&&i!==1)return null;const g=new THREE.Group();
  if(defs[i])defs[i](g);else if(w.m&&GUNGLB[w.m])glb(g,w.m);else if(w.m&&typeof GUNMESH!=='undefined'&&GUNMESH[w.m])meshGun(g,GUNMESH[w.m],w.m);
  g.visible=false;return g});
}
