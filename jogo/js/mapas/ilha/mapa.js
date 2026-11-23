/* CAOS BR FPS · mapa ILHA DE TREINO (paredes, spawns, kits, céu, chão e árvores) */
CAOS.registerMap({
 id:'ilha', name:'ILHA DE TREINO', size:[1800,1200],
 playerSpawn:[240,520], enemySpawn:[1560,700],
 kits:[[900,200],[900,950],[400,1000],[1500,300],[1550,900],[200,350],[760,600],[1250,520]],
 sky:0xa9d3ee, fogNear:600, fogFar:2000, boundaryHeight:22,
 walls(){ return [[0,-20,W,20],[0,H,W,20],[-20,0,20,H],[W,0,20,H],...[[250,150,100,100],[850,550,100,100],[550,330,100,140],[200,560,160,40],[840,200,160,40],[100,340,40,120],[1060,340,40,120],[540,100,120,40],[540,660,120,40],[380,420,40,120],[780,260,40,120],[420,260,120,30],[660,510,120,30]].map(([a,b,w,h])=>[a+300,b+200,w,h]),[60,150,140,100],[80,480,40,140],[120,900,160,40],[60,1020,100,100],[220,700,120,40],[1500,150,120,100],[1660,420,40,160],[1560,800,160,40],[1500,1000,140,100],[1420,640,100,40],[800,60,200,40],[1100,40,40,100],[700,1100,200,40],[1100,1060,40,100]]; },
 drawFloor(g){
 g.fillStyle='#4b8f3c';g.fillRect(0,0,256,256);for(let i=0;i<2600;i++){g.fillStyle=['#3d7a31','#58a047','#447f35','#6aa84f','#5a8f3a'][i%5];g.fillRect(Math.random()*256,Math.random()*256,2+Math.random()*3,2+Math.random()*3)}for(let i=0;i<14;i++){g.fillStyle='#a8905a55';g.beginPath();g.arc(Math.random()*256,Math.random()*256,6+Math.random()*10,0,6.28);g.fill()}
 },
 decorate(sc){
 const gm=new THREE.MeshLambertMaterial({color:0x6b6b66}),bm=new THREE.MeshLambertMaterial({color:0x2f6b2a}),tm=new THREE.MeshLambertMaterial({color:0x5a3d22}),keep=[[240,520],[1560,700],...G.kits.map(k=>[k.x,k.y])];
 for(let n=0,tr=0;n<110&&tr<1200;tr++){const x=30+Math.random()*(W-60),z=30+Math.random()*(H-60);
  if(walls.some(([a,b,w,h])=>x>a-26&&x<a+w+26&&z>b-26&&z<b+h+26)||keep.some(([a,b])=>Math.hypot(x-a,z-b)<70))continue;
  const t=n%3;let o;
  if(t===0){o=new THREE.Mesh(new THREE.DodecahedronGeometry(5+Math.random()*5),gm);o.position.set(x,3,z)}
  else if(t===1){o=new THREE.Mesh(new THREE.SphereGeometry(7+Math.random()*4,8,6),bm);o.scale.y=.7;o.position.set(x,5,z)}
  else{o=new THREE.Group();const k=new THREE.Mesh(new THREE.CylinderGeometry(2.5,3.5,20,7),tm);k.position.y=10;const f=new THREE.Mesh(new THREE.ConeGeometry(14,38,8),bm);f.position.y=36;const f2=new THREE.Mesh(new THREE.ConeGeometry(10,28,8),bm);f2.position.y=52;o.add(k,f,f2);o.position.set(x,0,z);walls.push([x-6,z-6,12,12])}
  o.traverse(q=>{q.castShadow=true});sc.add(o);n++}
 }
});
