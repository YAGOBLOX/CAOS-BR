/* CAOS BR FPS · mapa ILHA DE TREINO (2400x1600): paredes, estruturas, spawns, kits, céu, chão e cenário
   Cenário (árvores, pedras, arbustos, caixotes, barris, troncos) é gerado em decorate() com semente fixa:
   o mapa fica igual toda vez. Tudo é desenhado em "lotes" (InstancedMesh) para ficar leve no celular. */
CAOS.registerMap({
 id:'ilha', name:'ILHA DE TREINO', size:[2400,1600],
 playerSpawn:[320,690], enemySpawn:[2080,930],
 kits:[[1200,267],[1200,1267],[533,1333],[2000,400],[2067,1200],[267,467],[1013,800],[1667,693],[1800,350],[750,1250]],
 sky:0xa9d3ee, fogNear:700, fogFar:2300, boundaryHeight:22, wallHeight:84,
 walls(){
  const K=4/3,Z=1.15;   // posições x1.33 (mapa maior) e paredes 15% maiores
  const base=[[733,467,100,100],[1533,1000,100,100],[1133,707,100,140],[667,1013,160,40],[1520,533,160,40],[533,720,40,120],[1813,720,40,120],[1120,400,120,40],[1120,1147,120,40],[907,827,40,120],[1440,613,40,120],[960,613,120,30],[1280,947,120,30]]
   .map(([a,b,w,h])=>[a,b,Math.round(w*Z),Math.round(h*Z)]);
  const edge=[[60,150,140,100],[80,480,40,140],[120,900,160,40],[60,1020,100,100],[220,700,120,40],[1500,150,120,100],[1660,420,40,160],[1560,800,160,40],[1500,1000,140,100],[1420,640,100,40],[800,60,200,40],[1100,40,40,100],[700,1100,200,40],[1100,1060,40,100]]
   .map(([a,b,w,h])=>[Math.round(a*K),Math.round(b*K),Math.round(w*Z),Math.round(h*Z)]);
  // estruturas novas: ruína em L, bunker em U, acampamento, canto sudeste, linha de sacos de areia
  const novas=[[560,180,200,44],[560,180,44,140],[640,1320,44,140],[640,1320,200,44],[796,1320,44,140],[1560,160,170,44],[1560,160,44,120],[1680,1230,190,44],[1680,1230,44,120],[450,360,150,36]];
  return [[0,-20,W,20],[0,H,W,20],[-20,0,20,H],[W,0,20,H],...base,...edge,...novas];
 },
 drawFloor(g){
  g.fillStyle='#4b8f3c';g.fillRect(0,0,256,256);
  for(let i=0;i<2800;i++){g.fillStyle=['#3d7a31','#58a047','#447f35','#6aa84f','#5a8f3a'][i%5];g.fillRect(Math.random()*256,Math.random()*256,2+Math.random()*3,2+Math.random()*3)}
  for(let i=0;i<26;i++){g.fillStyle=i%3?'#a8905a55':'#7d9a4a44';g.beginPath();g.arc(Math.random()*256,Math.random()*256,6+Math.random()*12,0,6.28);g.fill()}
 },
 decorate(sc){
  let sd=7;const R=()=>(sd=(sd*1664525+1013904223)>>>0)/4294967296,rr=(a,b)=>a+R()*(b-a);
  const L=c=>new THREE.MeshLambertMaterial({color:c});
  const keep=[G.map.playerSpawn,G.map.enemySpawn,...G.kits.map(k=>[k.x,k.y])],put=[],base=walls.slice(4);
  // livre(x,z,r): longe de paredes, spawns, kits, borda e de outros objetos
  const ok=(x,z,r)=>x>r+30&&z>r+30&&x<W-r-30&&z<H-r-30&&!walls.some(([a,b,w,h])=>x>a-r-8&&x<a+w+r+8&&z>b-r-8&&z<b+h+r+8)&&!keep.some(([a,b])=>Math.hypot(x-a,z-b)<r+70)&&!put.some(([a,b,q])=>Math.hypot(x-a,z-b)<r+q+6);
  const add=(x,z,r)=>put.push([x,z,r]);
  // listas de instâncias [x,y,z,escX,escY,escZ,giroY,giroZ]
  const mk=()=>({t:[],a:[],b:[],c:[]}),PN=[mk(),mk()],RT=[mk(),mk()],BU=[[],[]],RB=[[],[]],RS=[],CR=[],BA=[[],[]],LG=[],ST=[];
  const pine=(x,z,v)=>{const k=rr(.95,1.25),o=PN[v];o.t.push([x,13*k,z,k,k,k]);o.a.push([x,37*k,z,k,k,k,rr(0,6)]);o.b.push([x,55*k,z,k,k,k]);o.c.push([x,73*k,z,k,k,k]);walls.push([x-7,z-7,14,14]);add(x,z,17*k)};
  const round=(x,z,v)=>{const k=rr(.95,1.25),o=RT[v];o.t.push([x,11*k,z,k,k,k]);o.a.push([x,36*k,z,k,.92*k,k]);o.b.push([x+7*k,45*k,z-4*k,k,k,k]);o.c.push([x-8*k,41*k,z+5*k,k,k,k]);walls.push([x-7,z-7,14,14]);add(x,z,20*k)};
  const bush=(x,z)=>{const k=rr(.8,1.5);BU[R()<.5?0:1].push([x,5*k,z,k,.7*k,k]);add(x,z,9*k)};
  const rock=(x,z)=>{const r=rr(15,26);RB[R()<.5?0:1].push([x,r*.4,z,r,r*.75,r*rr(.8,1.1),rr(0,6)]);walls.push([x-r*.8,z-r*.8,r*1.6,r*1.6]);add(x,z,r)};
  const pebbles=(x,z)=>{for(let i=0;i<3;i++){const s=rr(2.5,5.5);RS.push([x+rr(-14,14),s*.4,z+rr(-14,14),s,s*.8,s,rr(0,6)])}add(x,z,16)};
  // 1) cenário espalhado em grade com desvio (cobre o mapa todo de forma uniforme)
  for(let gx=80;gx<W-60;gx+=125)for(let gz=80;gz<H-60;gz+=125){
   if(R()<.2)continue;const x=gx+rr(-48,48),z=gz+rr(-48,48),t=R(),v=R()<.5?0:1;
   if(t<.30){if(ok(x,z,17))pine(x,z,v)}
   else if(t<.54){if(ok(x,z,20))round(x,z,v)}
   else if(t<.70){if(ok(x,z,10))bush(x,z)}
   else if(t<.82){if(ok(x,z,26))rock(x,z)}
   else if(ok(x,z,16))pebbles(x,z);
  }
  // 2) caixotes e barris encostados nas paredes (em duplas) e troncos/tocos soltos
  for(let n=0,tr=0;n<12&&tr<300;tr++){const w=base[(R()*base.length)|0],s=R()<.5?-1:1,x=R()<.5?w[0]+rr(0,w[2]):w[0]+(s<0?-14:w[2]+14),z=x<w[0]||x>w[0]+w[2]?w[1]+rr(0,w[3]):w[1]+(s<0?-14:w[3]+14);
   if(!ok(x,z,9))continue;n++;
   if(n%3===0){BA[n%2].push([x,8,z,1,1,1]);walls.push([x-7,z-7,14,14]);add(x,z,8)}
   else{const y=rr(0,6);CR.push([x,8,z,1,1,1,y]);walls.push([x-8,z-8,16,16]);add(x,z,9);if(R()<.4){CR.push([x,24,z,.85,.85,.85,y+.5])}}}
  for(let n=0,tr=0;n<16&&tr<300;tr++){const x=rr(60,W-60),z=rr(60,H-60);if(!ok(x,z,16))continue;n++;
   if(n%2)LG.push([x,3.6,z,1,1,1,rr(0,6),1.5708]);else ST.push([x,4.5,z,1,1,1]);add(x,z,16)}
  // 3) desenha tudo em lotes (poucos desenhos = leve no celular)
  const dm=new THREE.Object3D();
  const batch=(geo,mat,list,sombra)=>{if(!list.length)return;const m=new THREE.InstancedMesh(geo,mat,list.length);
   list.forEach((q,i)=>{dm.position.set(q[0],q[1],q[2]);dm.scale.set(q[3],q[4],q[5]);dm.rotation.set(0,q[6]||0,q[7]||0);dm.updateMatrix();m.setMatrixAt(i,dm.matrix)});
   m.instanceMatrix.needsUpdate=true;m.frustumCulled=false;m.castShadow=!!sombra;sc.add(m)};
  const tk=L(0x5a3d22),pg=[L(0x2c6b2a),L(0x24602a)],lf=[L(0x4f9a35),L(0x62a83a)];
  const gT=new THREE.CylinderGeometry(3,4.5,26,7),gC1=new THREE.ConeGeometry(18,46,8),gC2=new THREE.ConeGeometry(13,34,8),gC3=new THREE.ConeGeometry(8,22,8);
  PN.forEach((o,v)=>{batch(gT,tk,o.t,1);batch(gC1,pg[v],o.a,1);batch(gC2,pg[v],o.b,1);batch(gC3,pg[v],o.c,1)});
  const gR=new THREE.CylinderGeometry(3.5,5,22,7),gA=new THREE.SphereGeometry(17,8,6),gB=new THREE.SphereGeometry(12,8,6),gD=new THREE.SphereGeometry(11,8,6);
  RT.forEach((o,v)=>{batch(gR,tk,o.t,1);batch(gA,lf[v],o.a,1);batch(gB,lf[v],o.b,1);batch(gD,lf[v],o.c,1)});
  const gBu=new THREE.SphereGeometry(9,7,5);batch(gBu,L(0x3f8a30),BU[0]);batch(gBu,L(0x56a03a),BU[1]);
  const gRk=new THREE.DodecahedronGeometry(1);batch(gRk,L(0x77766f),RB[0],1);batch(gRk,L(0x8d8a7f),RB[1],1);batch(gRk,L(0x6b6a64),RS);
  batch(new THREE.BoxGeometry(16,16,16),L(0x9a6b34),CR,1);
  const gBa=new THREE.CylinderGeometry(7,7,16,10);batch(gBa,L(0xb23a2e),BA[0],1);batch(gBa,L(0x2f5f9e),BA[1],1);
  batch(new THREE.CylinderGeometry(3.6,3.6,34,8),L(0x7a5428),LG,1);batch(new THREE.CylinderGeometry(6,7,9,8),L(0x6b4a2a),ST,1);
 }
});
