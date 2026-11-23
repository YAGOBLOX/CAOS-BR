/* CAOS BR FPS · modo ESTANDE: alvos fixos, todas as armas liberadas, painel de dano */
CAOS.registerMode({
 id:'estande', name:'ESTANDE', flags:{range:true}, allWeapons:true, hudTitle:'ESTANDE',
 createBots(G,map){
  const a=[];
  for(let i=0;i<10;i++){const q=newBot(),s=map.dummies[i%map.dummies.length];q.x=q.hx=s[0];q.y=q.hy=s[1];a.push(q)}
  return a;
 }
});
