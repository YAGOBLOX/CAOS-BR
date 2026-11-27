/* CAOS BR FPS · moedas e arma equipada (só leitura; a loja e os slots da partida foram removidos na limpeza v41)
   - own = armas compradas (posição em WP) · eqs = armas EQUIPADAS (a 1ª é a que o boneco segura no lobby)
   - lê de localStorage 'sv' = {c:moedas, o:armas compradas, q:armas equipadas} */
const START=WP.map((w,i)=>w.st?i:-1).filter(i=>i>=0),MAXEQ=3,IDX=id=>WP.findIndex(w=>w.id===id),DEFEQ=[IDX('m4a1'),IDX('m1911')];
let coins=21130,own=START.slice(),eqs=DEFEQ.slice();
try{const s=JSON.parse(localStorage.getItem('sv')||'{}');if(s.c!=null)coins=s.c;if(Array.isArray(s.o))own=s.o;
 if(Array.isArray(s.q))eqs=s.q;else if(Number.isInteger(s.e))eqs=[s.e]}catch(e){}
own=own.filter(i=>Number.isInteger(i)&&WP[i]&&!WP[i].fist&&!WP[i].hide);START.forEach(i=>{if(!own.includes(i))own.push(i)});own.sort((a,b)=>a-b);
eqs=eqs.filter((i,k)=>own.includes(i)&&eqs.indexOf(i)===k).slice(0,MAXEQ);if(!eqs.length)eqs=DEFEQ.slice();
$('#coins').textContent=coins;
