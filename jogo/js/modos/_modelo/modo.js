/* CAOS BR FPS · [MODELO] copie esta pasta para criar um novo modo. Veja o README.md */
CAOS.registerMode({
 id:'meu-modo', name:'MEU MODO',
 flags:{},              // {train:true} / {range:true} ativam trechos legados do HUD
 shop:false,            // mostra o botão de loja na partida
 allWeapons:false,      // libera todas as armas
 endOnKill:false,       // true = partida acaba ao abater o bot
 hudTitle:'MEU MODO',
 createBots(G,map){ const q=newBot(); q.x=map.enemySpawn[0]; q.y=map.enemySpawn[1]; return [q]; }
});
