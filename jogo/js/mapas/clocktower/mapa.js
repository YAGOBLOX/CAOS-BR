/* CAOS BR FPS · mapa TORRE DO RELÓGIO (1416x2400): modelo 3D em GLB (modelos/mapas/clocktower.glb, carregado só ao escolher este mapa) + colisão simplificada.
   - O GLB tem vários andares; o jogo é plano, então só o nível principal (o "anel" ao redor do platô central) é andável. Platô, casas e bordas viram paredes INVISÍVEIS (hideWalls).
   - COLISÃO (rects) foi GERADA do próprio modelo (script de "bake" fora do projeto): retângulos [x,y,larg,alt] em unidades do jogo; spawns e kits foram escolhidos em áreas livres.
   - Escala: 1 unidade do modelo = 24 do jogo; o nível do chão do modelo (y=22.4) vira y=0. */
(function(){
 const SC=34,OX=-25.0,OZ=-44.5,G0=22.4;
  let grp=null,pend=null;
 const M={
  id:'clocktower', name:'TORRE DO RELÓGIO', size:[2006,3383],
  playerSpawn:[807, 382], enemySpawn:[1657, 3272],
  kits:[[93, 2167], [1912, 1623], [467, 3289], [1912, 110], [858, 1436], [1487, 926], [1130, 2796], [518, 2643], [1912, 2762]],
  sky:0x9ec9e8, fogNear:1800, fogFar:5200, boundaryHeight:0, wallHeight:420,
  hideWalls:true, noFloor:true, waterY:-560, waterColor:0x2b7fc4,
  walls(){ const W_=W,H_=H; return [[0,-20,W_,20],[0,H_,W_,20],[-20,0,20,H_],[W_,0,20,H_]]; },
  drawFloor(g){ g.fillStyle='#6b7a55'; g.fillRect(0,0,256,256); },   // não usado (noFloor), mas o registro exige
  // baixa o GLB (uma vez) antes da partida começar; o carregador espera esta promessa (CAOS.load)
  preload(){
   if(grp&&M.lv)return Promise.resolve();
   // chão por camadas (escadas/andares): arquivo binário gerado do modelo (ver CLAUDE.md v34)
   const lvP=M.lv?Promise.resolve():fetch('modelos/mapas/clocktower.bin?v='+CAOS.ver).then(r=>r.arrayBuffer()).then(b=>{const u=new Uint32Array(b,0,3),nx=u[0],nz=u[1],n=u[2],o=12+4*(nx*nz+1);
    M.lv={nx,nz,idx:new Uint32Array(b,12,nx*nz+1),lh:new Int16Array(b,o,n),lc:new Int16Array(b,o+2*n,n),lt:new Int16Array(b,o+4*n,n)}});
   if(grp)return lvP;
   return pend||(pend=lvP.then(()=>new Promise((ok,fail)=>{
    const t=setTimeout(()=>{pend=null;fail(new Error('O mapa demorou demais para carregar. Verifique a internet e tente de novo.'))},60000);
    new THREE.GLTFLoader().load('modelos/mapas/clocktower.glb?v='+CAOS.ver,g=>{
     clearTimeout(t);const s=g.scene;
     s.traverse(o=>{if(!o.isMesh)return;const m=o.material;if(m.map)m.map.encoding=THREE.LinearEncoding;   // textura sem conversão (igual ao resto do jogo)
      o.material=new THREE.MeshLambertMaterial({map:m.map||null,color:m.color,side:m.side,transparent:m.transparent,opacity:m.opacity,alphaTest:m.alphaTest||0});
      o.castShadow=false;o.receiveShadow=true;o.matrixAutoUpdate=false;o.updateMatrix()});
     const r=new THREE.Group();r.add(s);r.scale.setScalar(SC);r.position.set(-OX*SC,-G0*SC,-OZ*SC);r.updateMatrixWorld(true);grp=r;ok()},
     undefined,()=>{clearTimeout(t);pend=null;fail(new Error('Não consegui baixar o mapa (modelos/mapas/clocktower.glb).'))});
   })));
  },
  decorate(sc){ if(grp)sc.add(grp); }
 };CAOS.registerMap(M);
})();
