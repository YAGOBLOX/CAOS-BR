/* CAOS BR FPS · criação de entidades (jogador/bot) e ponto de nascimento */
const mk=(x,y)=>({x,y,hp:200,mx:200,cd:0,fl:0,w:1,am:WP.map(w=>w.mag),rl:0,z:0,vz:0,st:0});
function spawnPt(){for(let i=0;i<40;i++){const x=80+Math.random()*(W-160),y=80+Math.random()*(H-160);if(!hitW(x,y,24)&&Math.hypot(x-G.p.x,y-G.p.y)>320)return[x,y]}return CAOS.map.enemySpawn||[W/2,H/2]}
// bot base: os modos (modos/<id>/modo.js) montam seus bots a partir disto
const newBot=()=>Object.assign(mk(0,0),{bst:0,bsd:1,blk:0,wa:0,a:0});
