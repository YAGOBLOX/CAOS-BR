/* CAOS BR FPS · moedas, menu de ARMAS (comprar/equipar), arma equipada e slots da partida
   - own = armas compradas (posição em WP) · eqs = armas EQUIPADAS (até 3; na partida cada uma é um slot, além do punho)
   - tudo é salvo em localStorage 'sv' = {c:moedas, o:armas compradas, q:armas equipadas} */
const START=WP.map((w,i)=>w.st?i:-1).filter(i=>i>=0),MAXEQ=3,IDX=id=>WP.findIndex(w=>w.id===id),DEFEQ=[IDX('m4a1'),IDX('m1911')];
let coins=21130,own=START.slice(),eqs=DEFEQ.slice();   // eqs = armas EQUIPADAS (até MAXEQ); na partida cada uma vira um slot
try{const s=JSON.parse(localStorage.getItem('sv')||'{}');if(s.c!=null)coins=s.c;if(Array.isArray(s.o))own=s.o;
 if(Array.isArray(s.q))eqs=s.q;else if(Number.isInteger(s.e))eqs=[s.e]}catch(e){}
own=own.filter(i=>Number.isInteger(i)&&WP[i]&&!WP[i].fist&&!WP[i].hide);START.forEach(i=>{if(!own.includes(i))own.push(i)});own.sort((a,b)=>a-b);
eqs=eqs.filter((i,k)=>own.includes(i)&&eqs.indexOf(i)===k).slice(0,MAXEQ);if(!eqs.length)eqs=DEFEQ.slice();
$('#coins').textContent=coins;
const saveSv=()=>{try{localStorage.setItem('sv',JSON.stringify({c:coins,o:own,q:eqs}))}catch(e){}};
const wdesc=w=>w.d||(w.dm+(w.pel>1?' x'+w.pel:'')+' de dano · '+w.mag+' balas');
// armas que o jogador pode puxar: as EQUIPADAS + PUNHO (no ESTANDE, todas)
function lst(){return G&&G.mode&&G.mode.allWeapons?WP.map((w,i)=>i).filter(i=>!WP[i].fist&&!WP[i].hide).concat(FIST):eqs.concat(FIST)}
function slotTap(i){
 if(!G||G.over)return;
 if(G.p.w===i){if(!WP[i].fist)rel()}   // tocou na arma que já está na mão: recarrega
 else{G.p.w=i;G.p.rl=0}                // tocou em outra arma: troca
}
function buildSlots(){
 const s=$('#slots');s.innerHTML='';const L=lst();s.classList.toggle('many',L.length>5);
 L.forEach(i=>{
  const w=WP[i],b=document.createElement('button');b.className='btn sl';b.dataset.w=i;b.title=w.n;
  b.innerHTML=(w.ic?'<img src="'+w.ic+'" alt="'+w.n+'">':'<span class="sn">'+(w.em||w.n)+'</span>')+'<small class="am"></small>';
  b.addEventListener('pointerdown',ev=>{ev.preventDefault();slotTap(i)});
  s.appendChild(b);
 });
}
// ===== menu ARMAS: comprar e equipar =====
function openShop(msg){
 const y=card.scrollTop;
 open('<h2>ARMAS · 🪙 '+coins+'</h2><div class="cs">'+(msg||('Equipadas ('+eqs.length+'/'+MAXEQ+'): '+eqs.map(i=>WP[i].n).join(' · ')))+'</div>'+WP.map((w,i)=>{
  if(w.fist||w.hide)return'';
  const have=own.includes(i),on=eqs.includes(i);
  const btn=on?`<button class="btn wb on" data-u="${i}">✓ EQUIPADA</button>`:have?`<button class="btn wb" data-e="${i}">EQUIPAR</button>`:`<button class="btn wb" data-b="${i}">🪙 ${w.pr}</button>`;
  return `<div class="cr${on?' eqp':''}">${w.ic?`<img class="wi" src="${w.ic}" alt="">`:`<div class="wi no">${w.n[0]}</div>`}<span>${w.n}<br><small>${wdesc(w)}</small></span>${btn}</div>`;
 }).join(''));
 card.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>buy(+b.dataset.b));
 card.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>equip(+b.dataset.e));
 card.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>unequip(+b.dataset.u));
 card.scrollTop=y;
}
// mantém a partida em dia com o que está equipado: slots novos e arma na mão válida
function applyEq(pull){
 if(G&&!G.over){const w=G.p.w;if(pull!=null)G.p.w=pull;else if(!eqs.includes(w)&&!WP[w].fist&&!(G.mode&&G.mode.allWeapons))G.p.w=eqs[0];G.p.rl=0}
 buildSlots();
}
function equip(i){
 if(eqs.includes(i))return;
 if(eqs.length>=MAXEQ)return openShop('Limite de '+MAXEQ+' armas equipadas. Toque em ✓ EQUIPADA para tirar uma.');
 eqs.push(i);saveSv();applyEq(i);openShop('Equipada: '+WP[i].n);
}
function unequip(i){
 if(eqs.length<=1)return openShop('Deixe pelo menos 1 arma equipada.');
 eqs=eqs.filter(x=>x!==i);saveSv();applyEq();openShop('Removida: '+WP[i].n);
}
function buy(i){
 const w=WP[i];
 if(coins<w.pr)return openShop('Moedas insuficientes!');
 coins-=w.pr;own.push(i);own.sort((a,b)=>a-b);
 const room=eqs.length<MAXEQ;if(room)eqs.push(i);
 saveSv();$('#coins').textContent=coins;applyEq(room?i:null);
 openShop(room?'Comprada e equipada: '+w.n:'Comprada: '+w.n+'. Limite de '+MAXEQ+' equipadas: tire uma para usar.');
}
tap('#shopb',()=>openShop());
