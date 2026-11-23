/* CAOS BR FPS · modo SOLO 1v1: um bot, vence quem cair primeiro */
CAOS.registerMode({
 id:'solo1v1', name:'SOLO 1v1', flags:{}, endOnKill:true,
 createBots(G,map){
  const q=newBot();q.x=map.enemySpawn[0];q.y=map.enemySpawn[1];return [q];
 }
});
