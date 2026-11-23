/* CAOS BR FPS · mapa ESTANDE DE TIRO (alvos fixos, teto e chão de terra) */
CAOS.registerMap({
 id:'estande', name:'ESTANDE DE TIRO', size:[1800,1200],
 playerSpawn:[150,600], dummies:[[400,520],[400,680],[700,600],[900,520],[900,680],[1200,600],[1400,520],[1400,680],[1650,600],[700,300]],
 kits:[[300,420],[1500,600]],
 sky:0x8d949c, fogNear:1400, fogFar:3200, boundaryHeight:150,
 walls(){ return [[0,-20,W,20],[0,H,W,20],[-20,0,20,H],[W,0,20,H],[500,380,80,80],[500,740,80,80],[1000,420,100,60],[1000,720,100,60],[1500,380,80,80],[1500,740,80,80]]; },
 drawFloor(g){
 g.fillStyle='#b66f35';g.fillRect(0,0,256,256);for(let i=0;i<8;i++){g.fillStyle=i%2?'#c27c40':'#aa6530';g.fillRect(0,i*32,256,31);g.fillStyle='#7a4420';g.fillRect(0,i*32,256,2)}for(let i=0;i<500;i++){g.fillStyle='#00000012';g.fillRect(Math.random()*256,Math.random()*256,10,1)}
 },
 decorate(sc){
 const cg=new THREE.Mesh(new THREE.PlaneGeometry(W,H),new THREE.MeshLambertMaterial({color:0xcfd2d6}));cg.rotation.x=Math.PI/2;cg.position.set(W/2,150,H/2);sc.add(cg)
 }
});
