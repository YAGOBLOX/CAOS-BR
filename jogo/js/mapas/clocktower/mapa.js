/* CAOS BR FPS · mapa TORRE DO RELÓGIO (1416x2400): modelo 3D em GLB (modelos/mapas/clocktower.glb, carregado só ao escolher este mapa) + colisão simplificada.
   - O GLB tem vários andares; o jogo é plano, então só o nível principal (o "anel" ao redor do platô central) é andável. Platô, casas e bordas viram paredes INVISÍVEIS (hideWalls).
   - COLISÃO (rects) foi GERADA do próprio modelo (script de "bake" fora do projeto): retângulos [x,y,larg,alt] em unidades do jogo; spawns e kits foram escolhidos em áreas livres.
   - Escala: 1 unidade do modelo = 24 do jogo; o nível do chão do modelo (y=22.4) vira y=0. */
(function(){
 const SC=48,K=SC/34,OX=-25.0,OZ=-44.5,G0=22.4;
  let grp=null,pend=null;
 const M={
  id:'clocktower', name:'TORRE DO RELÓGIO', size:[Math.round(2006*K),Math.round(3383*K)],
  playerSpawn:[1139, 539], enemySpawn:[2339, 4619],
  kits:[[131, 3059], [2699, 2291], [659, 4643], [2699, 155], [1211, 2027], [2099, 1307], [1595, 3947], [731, 3731], [2699, 3899]],
  sky:0x9ec9e8, fogNear:2500, fogFar:7200, boundaryHeight:0, wallHeight:600,
  hideWalls:true, noFloor:true, waterY:-560, waterColor:0x2b7fc4,
  walls(){ const W_=W,H_=H; return [[0,-20,W_,20],[0,H_,W_,20],[-20,0,20,H_],[W_,0,20,H_]]; },
  drawFloor(g){ g.fillStyle='#6b7a55'; g.fillRect(0,0,256,256); },   // não usado (noFloor), mas o registro exige
  // baixa o GLB (uma vez) antes da partida começar; o carregador espera esta promessa (CAOS.load)
  preload(){
   if(grp&&M.lv)return Promise.resolve();
   // chão por camadas (escadas/andares): arquivo binário gerado do modelo (ver CLAUDE.md v34)
   const lvP=M.lv?Promise.resolve():fetch('modelos/mapas/clocktower.bin?v='+CAOS.ver).then(r=>r.arrayBuffer()).then(b=>{const u=new Uint32Array(b,0,3),nx=u[0],nz=u[1],n=u[2],o=12+4*(nx*nz+1);
    const sc=a=>a.map(v=>Math.round(v*K));M.lv={nx,nz,cs:8.5*K,k:K,idx:new Uint32Array(b,12,nx*nz+1),lh:sc(new Int16Array(b,o,n)),lc:sc(new Int16Array(b,o+2*n,n)),lt:sc(new Int16Array(b,o+4*n,n))}});
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
