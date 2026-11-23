/* CAOS BR FPS · modo TREINO: 10 bots fracos que renascem, loja liberada */
CAOS.registerMode({
 id:'treino', name:'TREINO', flags:{train:true}, shop:true, hudTitle:'ILHA DE TREINO',
 createBots(G,map){
  const a=[];
  for(let i=0;i<10;i++){const q=newBot(),s=spawnPt();q.x=s[0];q.y=s[1];q.spd=70;q.dmg=4;q.rate=.9;q.acc=2;a.push(q)}
  return a;
 }
});
