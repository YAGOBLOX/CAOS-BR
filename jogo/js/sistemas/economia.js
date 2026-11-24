/* CAOS BR FPS · moedas, menu de ARMAS (comprar/equipar), arma equipada e slots da partida
   - own = armas compradas (posição em WP) · eq = arma EQUIPADA (a única que o jogador puxa na partida, além do punho)
   - tudo é salvo em localStorage 'sv' = {c:moedas, o:armas compradas, e:arma equipada} */
const START=WP.map((w,i)=>w.st?i:-1).filter(i=>i>=0),DEFEQ=WP.findIndex(w=>w.id==='m4a1');
let coins=21130,own=START.slice(),eq=DEFEQ;
try{const s=JSON.parse(localStorage.getItem('sv')||'{}');if(s.c!=null)coins=s.c;if(Array.isArray(s.o))own=s.o;if(Number.isInteger(s.e))eq=s.e}catch(e){}
own=own.filter(i=>Number.isInteger(i)&&WP[i]&&!WP[i].fist&&!WP[i].hide);START.forEach(i=>{if(!own.includes(i))own.push(i)});own.sort((a,b)=>a-b);
if(!own.includes(eq))eq=DEFEQ;
$('#coins').textContent=coins;
const saveSv=()=>{try{localStorage.setItem('sv',JSON.stringify({c:coins,o:own,e:eq}))}catch(e){}};
const wdesc=w=>w.d||(w.dm+(w.pel>1?' x'+w.pel:'')+' de dano · '+w.mag+' balas');
// lista de armas que o jogador pode puxar: só a EQUIPADA + PUNHO (no ESTANDE, todas)
function lst(){return G&&G.mode&&G.mode.allWeapons?WP.map((w,i)=>i).filter(i=>!WP[i].fist&&!WP[i].hide).concat(FIST):[eq,FIST]}
function slotTap(i){
 if(!G||G.over)return;
 if(G.p.w===i){if(!WP[i].fist)rel()}   // arma já na mão: tocar recarrega
 else{G.p.w=i;G.p.rl=0}                // arma guardada: tocar puxa a arma
}
function buildSlots(){
 const s=$('#slots');s.innerHTML='';const L=lst();s.classList.toggle('many',L.length>4);
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
 open('<h2>ARMAS · 🪙 '+coins+'</h2><div class="cs">'+(msg||('Equipada: '+WP[eq].n))+'</div>'+WP.map((w,i)=>{
  if(w.fist||w.hide)return'';
  const have=own.includes(i),on=have&&eq===i;
  const btn=on?'<button class="btn wb on" disabled>✓ EQUIPADA</button>':have?`<button class="btn wb" data-e="${i}">EQUIPAR</button>`:`<button class="btn wb" data-b="${i}">🪙 ${w.pr}</button>`;
  return `<div class="cr${on?' eqp':''}">${w.ic?`<img class="wi" src="${w.ic}" alt="">`:'<div class="wi no">🔫</div>'}<span>${w.n}<br><small>${wdesc(w)}</small></span>${btn}</div>`;
 }).join(''));
 card.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>buy(+b.dataset.b));
 card.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>equip(+b.dataset.e));
 card.scrollTop=y;
}
// puxa a arma equipada na partida (se estiver jogando)
function applyEq(){if(G&&!G.over){G.p.w=eq;G.p.rl=0}buildSlots()}
function equip(i){eq=i;saveSv();applyEq();openShop('Equipada: '+WP[i].n)}
function buy(i){
 const w=WP[i];
 if(coins<w.pr)return openShop('Moedas insuficientes!');
 coins-=w.pr;own.push(i);own.sort((a,b)=>a-b);eq=i;
 saveSv();$('#coins').textContent=coins;applyEq();openShop('Comprada e equipada: '+w.n);
}
tap('#shopb',()=>openShop());
