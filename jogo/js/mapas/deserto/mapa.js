/* CAOS BR FPS · mapa DESERTO DE AREIA (2400x1600): casas de adobe, montanhas de areia, cactos grandes, árvores secas, mesas de pedra e trilhas.
   Cenário gerado em decorate() com semente fixa (mapa igual toda vez), tudo em lotes (InstancedMesh) para ficar leve no celular. */
CAOS.registerMap({
 id:'deserto', name:'DESERTO DE AREIA', size:[2400,1600],
 playerSpawn:[300,800], enemySpawn:[2100,800],
 kits:[[1200,800],[700,500],[1700,1100],[640,1120],[1760,480],[1200,330],[1200,1290],[2060,300],[330,360],[2200,1400]],
 sky:0xefd6a4, fogNear:650, fogFar:2200, boundaryHeight:22, wallHeight:84, waterColor:0xd4b273,
 walls(){
  const T=22,g=54;
  // casa de adobe: 4 paredes, uma delas com porta (door: 'N','S','W','E')
  const house=(x,y,w,h,door)=>{const r=[],sd=(a,b,ww,hh,hor,dr)=>{if(!dr)r.push([a,b,ww,hh]);else if(hor){r.push([a,b,(ww-g)/2,hh],[a+(ww+g)/2,b,(ww-g)/2,hh])}else{r.push([a,b,ww,(hh-g)/2],[a,b+(hh+g)/2,ww,(hh-g)/2])}};
   sd(x,y,w,T,1,door==='N');sd(x,y+h-T,w,T,1,door==='S');sd(x,y+T,T,h-2*T,0,door==='W');sd(x+w-T,y+T,T,h-2*T,0,door==='E');return r};
  const casas=[...house(480,260,210,150,'S'),...house(1640,220,200,140,'W'),...house(1080,1190,230,150,'N'),...house(1880,1160,190,150,'W'),...house(400,1180,180,130,'E'),];
  const cover=[[880,560,70,24],[1480,880,24,70],[690,800,24,80],[1660,800,24,80],[1130,680,110,24],[1130,900,110,24],[900,200,190,24],[900,200,24,110],[1300,1390,190,24],[1466,1300,24,114]];
  return [[0,-20,W,20],[0,H,W,20],[-20,0,20,H],[W,0,20,H],...casas,...cover];
 },
 drawFloor(g){
  g.fillStyle='#dcbc7c';g.fillRect(0,0,256,256);
  for(let i=0;i<3200;i++){g.fillStyle=['#cfa964','#e6cb92','#c39d5a','#d8b673','#eed7a0'][i%5];g.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*3,1+Math.random()*2)}
  g.strokeStyle='#c6a362';g.lineWidth=1.2;for(let i=0;i<7;i++){g.beginPath();const y=20+i*36+Math.random()*8;g.moveTo(0,y);for(let x=0;x<=256;x+=32)g.lineTo(x,y+Math.sin(x*.05+i)*5);g.stroke()}
 },
 decorate(sc){
  let sd=11;const R=()=>(sd=(sd*1664525+1013904223)>>>0)/4294967296,rr=(a,b)=>a+R()*(b-a);
  const L=c=>new THREE.MeshLambertMaterial({color:c});
  const keep=[G.map.playerSpawn,G.map.enemySpawn,...G.kits.map(k=>[k.x,k.y])],put=[],base=walls.slice(4);
  const ok=(x,z,r)=>x>r+30&&z>r+30&&x<W-r-30&&z<H-r-30&&!walls.some(([a,b,w,h])=>x>a-r-8&&x<a+w+r+8&&z>b-r-8&&z<b+h+r+8)&&!keep.some(([a,b])=>Math.hypot(x-a,z-b)<r+80)&&!put.some(([a,b,q])=>Math.hypot(x-a,z-b)<r+q+34);
  const add=(x,z,r)=>put.push([x,z,r]);
  const MD=[[],[]],FM=[[],[],[]],TR=[],AR=[],DT=[],DB=[],BS=[[],[]],RK=[[],[]],MS=[],CR=[],BA=[[],[]],PT=[],BC=[],FL=[];
  const place=(n,r,fn)=>{for(let c=0,t=0;c<n&&t<n*60;t++){const x=rr(60,W-60),z=rr(60,H-60);if(ok(x,z,r)){fn(x,z);c++}}};
  // trilhas de terra batida (por baixo de tudo): leste-oeste e norte-sul, curvando
  const trail=(x0,z0,x1,z1,amp)=>{const n=22;let px=x0,pz=z0;for(let i=1;i<=n;i++){const u=i/n,x=x0+(x1-x0)*u+Math.sin(u*6.28)*amp*.3,z=z0+(z1-z0)*u+Math.sin(u*9.4)*amp;const dx=x-px,dz=z-pz;PT.push([(x+px)/2,.4,(z+pz)/2,Math.hypot(dx,dz)+6,1,rr(40,52),-Math.atan2(dz,dx)]);px=x;pz=z}};
  trail(60,820,W-60,780,90);trail(1200,60,1160,H-60,120);trail(300,820,700,500,40);
  // montanhas de areia GRANDES (colidem: o colisor cobre quase toda a base)
  place(8,190,(x,z)=>{const r=rr(120,190),h=rr(170,260),v=R()<.5?0:1;MD[v].push([x,h/2,z,r,h,r,rr(0,6)]);MD[v].push([x+r*.3,h*.3,z+r*.15,r*.55,h*.6,r*.55,rr(0,6)]);walls.push([x-r*.85,z-r*.85,r*1.7,r*1.7]);add(x,z,r)});
  // mesas de pedra vermelha
  place(4,70,(x,z)=>{const r=rr(40,60),h=rr(60,100);MS.push([x,h/2,z,r,h,r,rr(0,6)]);walls.push([x-r*.95,z-r*.95,r*1.9,r*1.9]);add(x,z,r)});
  // cactos grandes (saguaro): tronco + 1 ou 2 braços
  place(22,34,(x,z)=>{const k=R()<.3?rr(1.2,1.7):rr(1.8,2.8),H0=58*k;TR.push([x,H0/2,z,1,H0,1]);
   for(let a=0,na=R()<.5?1:2;a<na;a++){const ry=rr(0,6.28),yy=H0*rr(.3,.55),ex=x+Math.cos(ry)*15,ez=z-Math.sin(ry)*15,vh=H0*rr(.22,.38);
    AR.push([x+Math.cos(ry)*8.5,yy,z-Math.sin(ry)*8.5,.72,13,.72,ry,1.5708]);AR.push([ex,yy+vh/2,ez,.72,vh,.72])}
   walls.push([x-7,z-7,14,14]);add(x,z,18)});
  // cactos redondos
  place(12,26,(x,z)=>{const k=rr(1,1.8);BC.push([x,6*k,z,k,k*.85,k]);if(R()<.5)FL.push([x,12*k,z,.7,.7,.7]);walls.push([x-6*k,z-6*k,12*k,12*k]);add(x,z,10*k)});
  // árvores secas grandes (tronco retorcido + galhos)
  place(11,44,(x,z)=>{const Ht=rr(70,125);DT.push([x,Ht/2,z,1,Ht,1]);for(let b=0,nb=3+((R()*2)|0);b<nb;b++){const ry=rr(0,6.28),tl=rr(.6,1.1),lb=Ht*rr(.3,.5),yb=Ht*rr(.55,.9);
    DB.push([x+Math.sin(tl)*Math.cos(ry)*lb/2,yb+Math.cos(tl)*lb/2,z-Math.sin(tl)*Math.sin(ry)*lb/2,.55,lb,.55,ry,-tl])}
   walls.push([x-5,z-5,10,10]);add(x,z,24)});
  // arbustos secos / bolas de mato
  place(22,30,(x,z)=>{const k=rr(1.2,2.2);BS[R()<.5?0:1].push([x,4*k,z,k,.6*k,k]);add(x,z,9*k)});
  // pedras de arenito
  place(12,44,(x,z)=>{const r=rr(24,42);RK[R()<.5?0:1].push([x,r*.4,z,r,r*.75,r,rr(0,6)]);walls.push([x-r*.95,z-r*.95,r*1.9,r*1.9]);add(x,z,r)});
  // caixotes e barris encostados nas casas/muros
  for(let n=0,tr=0;n<8&&tr<400;tr++){const w=base[(R()*base.length)|0],s=R()<.5?-1:1,x=R()<.5?w[0]+rr(0,w[2]):w[0]+(s<0?-14:w[2]+14),z=x<w[0]||x>w[0]+w[2]?w[1]+rr(0,w[3]):w[1]+(s<0?-14:w[3]+14);
   if(!ok(x,z,9))continue;n++;
   if(n%3===0){BA[n%2].push([x,8,z,1,1,1]);walls.push([x-7,z-7,14,14]);add(x,z,14)}
   else{const y=rr(0,6);CR.push([x,8,z,1,1,1,y]);walls.push([x-8,z-8,16,16]);add(x,z,16);if(R()<.4)CR.push([x,24,z,.85,.85,.85,y+.5])}}
  // montanhas ao longe (fora do mapa, só cenário)
  for(let i=0;i<30;i++){const a=i/30*6.283+rr(-.1,.1),x=W/2+Math.cos(a)*(W/2+rr(300,800)),z=H/2+Math.sin(a)*(H/2+rr(300,800)),r=rr(220,400),h=rr(160,420);FM[i%3].push([x,h/2-3,z,r,h,r,rr(0,6)])}
  // desenho em lotes
  const dm=new THREE.Object3D();
  const batch=(geo,mat,list,sombra)=>{if(!list.length)return;const m=new THREE.InstancedMesh(geo,mat,list.length);
   list.forEach((q,i)=>{dm.position.set(q[0],q[1],q[2]);dm.scale.set(q[3],q[4],q[5]);dm.rotation.set(0,q[6]||0,q[7]||0);dm.updateMatrix();m.setMatrixAt(i,dm.matrix)});
   m.instanceMatrix.needsUpdate=true;m.frustumCulled=false;m.castShadow=!!sombra;m.receiveShadow=true;sc.add(m)};
  const cyl=new THREE.CylinderGeometry(.5,.5,1,10),cone=new THREE.ConeGeometry(1,1,12),cone9=new THREE.ConeGeometry(1,1,9),dod=new THREE.DodecahedronGeometry(1),sph=new THREE.SphereGeometry(9,8,6);
  batch(new THREE.BoxGeometry(1,1,1),L(0xc2a064),PT);
  batch(cone9,L(0xb87a52),FM[0]);batch(cone9,L(0xc99b6a),FM[1]);batch(cone9,L(0xa86a46),FM[2]);
  batch(cone,L(0xdcb86f),MD[0],1);batch(cone,L(0xd0a95e),MD[1],1);
  batch(new THREE.CylinderGeometry(.8,1,1,8),L(0xb5654a),MS,1);
  batch(new THREE.CylinderGeometry(4,4.6,1,10),L(0x3f8a45),TR,1);batch(new THREE.CylinderGeometry(4,4,1,10),L(0x3f8a45),AR,1);
  batch(new THREE.SphereGeometry(7,10,8),L(0x4a9a50),BC,1);batch(new THREE.SphereGeometry(2.4,6,5),L(0xe8607a),FL);
  batch(new THREE.CylinderGeometry(2.2,3.8,1,7),L(0x6e5a42),DT,1);batch(new THREE.CylinderGeometry(.9,1.8,1,6),L(0x7a6548),DB,1);
  batch(sph,L(0x9a8450),BS[0]);batch(sph,L(0x7d6a3c),BS[1]);
  batch(dod,L(0xb98a5e),RK[0],1);batch(dod,L(0xa8784f),RK[1],1);
  batch(new THREE.BoxGeometry(16,16,16),L(0x9a6b34),CR,1);
  const gBa=new THREE.CylinderGeometry(7,7,16,10);batch(gBa,L(0xb23a2e),BA[0],1);batch(gBa,L(0x2f5f9e),BA[1],1);
 }
});
