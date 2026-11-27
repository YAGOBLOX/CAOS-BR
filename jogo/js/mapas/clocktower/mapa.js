/* CAOS BR FPS · mapa TORRE DO RELÓGIO (1416x2400): modelo 3D em GLB (modelos/mapas/clocktower.glb, carregado só ao escolher este mapa) + colisão simplificada.
   - O GLB tem vários andares; o jogo é plano, então só o nível principal (o "anel" ao redor do platô central) é andável. Platô, casas e bordas viram paredes INVISÍVEIS (hideWalls).
   - COLISÃO (rects) foi GERADA do próprio modelo (script de "bake" fora do projeto): retângulos [x,y,larg,alt] em unidades do jogo; spawns e kits foram escolhidos em áreas livres.
   - Escala: 1 unidade do modelo = 24 do jogo; o nível do chão do modelo (y=22.4) vira y=0. */
(function(){
 const SC=24,OX=-25.0,OZ=-45.0,G0=22.4;
 const RECTS=[[0,0,1416,24],[0,24,1248,24],[1368,24,48,24],[0,48,1224,24],[0,72,1200,96],[1392,48,24,144],[0,168,1224,72],[1368,192,48,48],[0,240,552,24],[648,240,552,24],[0,264,528,144],[1392,240,24,168],[1368,408,48,24],[1344,432,72,24],[0,408,552,72],[672,264,504,216],[0,480,264,24],[504,480,48,24],[792,480,384,24],[816,504,240,24],[1248,456,168,72],[0,504,240,48],[528,504,24,48],[816,528,216,24],[0,552,264,24],[288,552,48,24],[384,552,24,24],[528,552,48,24],[792,552,216,24],[1272,528,144,48],[768,576,264,24],[1128,576,24,24],[1248,576,168,24],[528,576,192,48],[768,600,384,24],[1200,600,216,24],[1368,624,48,24],[1392,648,24,96],[0,576,432,216],[1368,744,48,48],[0,792,408,24],[0,816,432,24],[1392,792,24,120],[1368,912,48,48],[0,840,528,144],[0,984,288,24],[696,1008,48,24],[888,1008,48,24],[696,1032,240,120],[1008,1104,120,48],[0,1008,264,168],[408,1152,48,24],[672,1152,288,24],[984,1152,144,24],[408,1176,720,48],[408,1224,648,24],[0,1176,240,120],[0,1296,264,24],[1152,1296,48,24],[1272,1296,48,24],[0,1320,48,24],[216,1320,48,24],[1152,1320,168,120],[408,1248,624,240],[1176,1440,144,48],[1392,960,24,528],[384,1488,672,24],[1152,1488,192,24],[1368,1488,48,24],[264,1512,1152,48],[288,1560,1128,144],[264,1704,1152,48],[384,1752,1032,24],[0,1344,24,480],[0,1824,48,24],[216,1824,48,24],[0,1848,264,24],[408,1776,1008,144],[408,1920,912,24],[1368,1920,48,24],[480,1944,288,24],[960,1944,336,24],[504,1968,240,96],[504,2064,48,24],[696,2064,48,24],[984,1968,312,120],[984,2088,144,24],[1392,1944,24,216],[984,2112,120,72],[1200,2160,24,24],[1368,2160,48,24],[1200,2184,216,48],[816,2256,72,24],[0,1872,240,456],[0,2328,264,24],[768,2280,144,72],[1224,2232,192,120],[0,2352,288,24],[456,2352,48,24],[744,2352,192,24],[1200,2352,216,24],[0,2376,1416,24]];
 let grp=null,pend=null;
 CAOS.registerMap({
  id:'clocktower', name:'TORRE DO RELÓGIO', size:[1416,2400],
  playerSpawn:[588, 324], enemySpawn:[1140, 2316],
  kits:[[84,1548],[1332,1188],[348,2316],[1332,108],[612,1044],[1068,684],[804,2028],[348,1884],[492,684]],
  sky:0x9ec9e8, fogNear:1400, fogFar:4200, boundaryHeight:0, wallHeight:420,
  hideWalls:true, noFloor:true, waterY:-560, waterColor:0x2b7fc4,
  walls(){ const W_=W,H_=H; return [[0,-20,W_,20],[0,H_,W_,20],[-20,0,20,H_],[W_,0,20,H_],...RECTS]; },
  drawFloor(g){ g.fillStyle='#6b7a55'; g.fillRect(0,0,256,256); },   // não usado (noFloor), mas o registro exige
  // baixa o GLB (uma vez) antes da partida começar; o carregador espera esta promessa (CAOS.load)
  preload(){
   if(grp)return Promise.resolve();
   return pend||(pend=new Promise((ok,fail)=>{
    const t=setTimeout(()=>{pend=null;fail(new Error('O mapa demorou demais para carregar. Verifique a internet e tente de novo.'))},60000);
    new THREE.GLTFLoader().load('modelos/mapas/clocktower.glb?v='+CAOS.ver,g=>{
     clearTimeout(t);const s=g.scene;
     s.traverse(o=>{if(!o.isMesh)return;const m=o.material;if(m.map)m.map.encoding=THREE.LinearEncoding;   // textura sem conversão (igual ao resto do jogo)
      o.material=new THREE.MeshLambertMaterial({map:m.map||null,color:m.color,side:m.side,transparent:m.transparent,opacity:m.opacity,alphaTest:m.alphaTest||0});
      o.castShadow=false;o.receiveShadow=true;o.matrixAutoUpdate=false;o.updateMatrix()});
     const r=new THREE.Group();r.add(s);r.scale.setScalar(SC);r.position.set(-OX*SC,-G0*SC,-OZ*SC);r.updateMatrixWorld(true);grp=r;ok()},
     undefined,()=>{clearTimeout(t);pend=null;fail(new Error('Não consegui baixar o mapa (modelos/mapas/clocktower.glb).'))});
   }));
  },
  decorate(sc){ if(grp)sc.add(grp); }
 });
})();
