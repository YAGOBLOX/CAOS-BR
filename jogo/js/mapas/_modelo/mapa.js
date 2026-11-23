/* CAOS BR FPS · [MODELO] copie esta pasta para criar um novo mapa. Veja o README.md */
// 1) Copie a pasta mapas/_modelo para mapas/<seu-id>/  2) Renomeie o id  3) Adicione no manifesto (carregamento/manifesto.js)
CAOS.registerMap({
 id:'meu-mapa', name:'MEU MAPA', size:[1800,1200],
 playerSpawn:[200,200],            // onde o jogador nasce
 enemySpawn:[1600,1000],           // onde o inimigo nasce (1v1 / spawn de bots)
 // dummies:[[x,y],...],           // só se algum modo usar alvos fixos
 kits:[[900,600]],                 // kits de vida
 sky:0xa9d3ee, fogNear:600, fogFar:2000, boundaryHeight:22,
 walls(){ const W_=W,H_=H; return [[0,-20,W_,20],[0,H_,W_,20],[-20,0,20,H_],[W_,0,20,H_],[600,400,100,100]]; }, // [x,y,largura,altura]
 drawFloor(g){ g.fillStyle='#4b8f3c'; g.fillRect(0,0,256,256); },   // textura do chão (canvas 256x256)
 decorate(sc){ /* opcional: adicionar objetos THREE na cena */ }
});
