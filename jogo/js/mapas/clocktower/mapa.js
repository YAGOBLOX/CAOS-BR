/* CAOS BR FPS · mapa TORRE DO RELÓGIO (1416x2400): modelo 3D em GLB (modelos/mapas/clocktower.glb, carregado só ao escolher este mapa) + colisão simplificada.
   - O GLB tem vários andares; o jogo é plano, então só o nível principal (o "anel" ao redor do platô central) é andável. Platô, casas e bordas viram paredes INVISÍVEIS (hideWalls).
   - COLISÃO (rects) foi GERADA do próprio modelo (script de "bake" fora do projeto): retângulos [x,y,larg,alt] em unidades do jogo; spawns e kits foram escolhidos em áreas livres.
   - Escala: 1 unidade do modelo = 24 do jogo; o nível do chão do modelo (y=22.4) vira y=0. */
(function(){
 const SC=34,OX=-25.0,OZ=-44.5,G0=22.4;
 const RECTS=[[0,0,2006,17],[0,17,1751,17],[1938,17,68,17],[0,34,1734,17],[1955,34,51,17],[0,51,1717,17],[1972,51,34,17],[0,68,1700,170],[1989,68,17,170],[0,238,1717,17],[1972,238,34,17],[0,255,1071,17],[1173,255,561,17],[0,272,1054,17],[0,289,748,17],[765,289,272,17],[1190,272,544,34],[1955,255,51,51],[969,306,17,17],[1972,306,34,17],[986,357,17,17],[0,306,731,255],[1989,323,17,238],[0,561,748,17],[1972,561,34,17],[1955,578,51,34],[1938,612,68,17],[0,578,782,68],[1802,629,204,17],[0,646,731,17],[748,646,34,17],[969,374,680,289],[0,663,357,17],[1122,663,527,17],[1156,680,306,17],[1785,646,221,68],[1173,697,272,51],[425,782,34,17],[561,782,17,17],[765,663,17,136],[1802,714,204,85],[765,799,34,17],[1819,799,187,17],[1105,816,34,17],[1360,816,17,17],[1598,816,34,17],[1802,816,204,17],[748,816,272,34],[1105,833,527,17],[1717,833,289,17],[0,680,340,187],[1972,850,34,17],[0,867,357,17],[408,799,204,85],[0,884,374,34],[391,884,221,34],[1989,867,17,153],[1972,1020,34,17],[1955,1037,51,51],[408,918,204,187],[1972,1088,34,17],[0,918,357,204],[0,1122,374,34],[0,1156,357,17],[1989,1105,17,170],[1972,1275,34,17],[0,1173,340,170],[1955,1292,51,51],[0,1343,357,17],[1972,1343,34,17],[0,1360,374,17],[408,1190,323,187],[1003,1411,34,17],[1275,1411,34,17],[1003,1428,51,17],[1258,1428,51,17],[0,1377,357,221],[1445,1547,136,68],[0,1598,374,34],[1003,1445,306,187],[1428,1615,153,17],[0,1632,357,17],[595,1632,34,17],[986,1632,340,17],[1411,1632,187,17],[595,1649,1003,51],[595,1700,986,17],[595,1717,884,17],[0,1649,340,170],[0,1819,357,17],[0,1836,85,17],[306,1836,51,17],[1649,1836,34,17],[1819,1836,34,17],[0,1853,68,17],[323,1853,34,17],[1649,1853,51,17],[1802,1853,51,17],[0,1870,51,17],[0,1887,34,17],[1649,1870,204,136],[595,1734,867,374],[1666,2006,187,102],[1989,1360,17,748],[595,2108,884,17],[1649,2108,221,17],[1972,2108,34,17],[578,2125,1428,17],[391,2142,1615,34],[408,2176,1598,238],[391,2414,1615,34],[578,2448,1428,17],[0,1904,17,646],[0,2550,34,17],[0,2567,51,17],[323,2567,51,17],[0,2584,68,17],[306,2584,68,17],[0,2601,374,17],[0,2618,357,17],[595,2465,1411,221],[595,2686,1241,17],[1972,2686,34,17],[595,2703,1224,17],[714,2720,357,17],[1377,2720,442,17],[731,2737,323,170],[731,2907,51,17],[986,2907,68,17],[731,2924,34,17],[1003,2924,51,17],[1394,2737,425,204],[1394,2941,187,17],[1989,2703,17,340],[1394,2958,170,102],[1972,3043,34,17],[1394,3060,34,17],[1530,3060,34,17],[1700,3060,34,17],[1955,3060,51,17],[1700,3077,51,17],[1938,3077,68,17],[1700,3094,306,17],[1717,3111,289,17],[1173,3196,85,17],[0,2635,340,663],[0,3298,357,17],[1734,3128,272,187],[1717,3315,289,17],[0,3315,374,34],[646,3315,51,34],[1088,3213,187,136],[1700,3332,306,17],[0,3349,391,17],[629,3349,85,17],[1071,3349,221,17],[1581,3349,425,17],[0,3366,2006,17]];
 let grp=null,pend=null;
 CAOS.registerMap({
  id:'clocktower', name:'TORRE DO RELÓGIO', size:[2006,3383],
  playerSpawn:[807, 382], enemySpawn:[1657, 3272],
  kits:[[93, 2167], [1912, 1623], [467, 3289], [1912, 110], [858, 1436], [1487, 926], [1130, 2796], [518, 2643], [1912, 2762]],
  sky:0x9ec9e8, fogNear:1800, fogFar:5200, boundaryHeight:0, wallHeight:420,
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
