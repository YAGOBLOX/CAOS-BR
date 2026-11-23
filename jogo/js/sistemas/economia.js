/* CAOS BR FPS · moedas, itens da loja, compra e lista de armas disponíveis */
let coins=21130,own=[0,1,2];
try{const s=JSON.parse(localStorage.getItem('sv')||'{}');if(s.c!=null)coins=s.c;if(Array.isArray(s.o))own=s.o}catch(e){}
$('#coins').textContent=coins;
const saveSv=()=>{try{localStorage.setItem('sv',JSON.stringify({c:coins,o:own}))}catch(e){}};
const SHOP=[{id:'w3',n:'SMG',d:'Rápida · 40 balas',pr:1500},{id:'w4',n:'SNIPER',d:'120 de dano · 5 balas',pr:3500},{id:'w5',n:'REVÓLVER',d:'65 de dano · 6 balas',pr:1200}];
function lst(){return G&&G.mode&&G.mode.allWeapons?WP.map((w,i)=>i):own}
function buildSlots(){const s=$('#slots');s.innerHTML='';lst().forEach(i=>{const b=document.createElement('button');b.className='btn sl';b.dataset.w=i;b.textContent=WP[i].n;b.addEventListener('pointerdown',ev=>{ev.preventDefault();if(G&&!G.over){G.p.w=i;G.p.rl=0}});s.appendChild(b)})}
function openShop(msg){
 open('<h2>LOJA DE ARMAS · 🪙 '+coins+'</h2>'+(msg?'<div class="cs">'+msg+'</div>':'')+SHOP.map(it=>{const have=it.id[0]==='w'&&own.includes(+it.id.slice(1));return `<div class="cr"><span>${it.n}<br><small>${it.d}</small></span>${have?'<b style="width:auto">✓</b>':`<button class="btn" data-b="${it.id}" style="width:100px;margin:0;padding:6px">🪙 ${it.pr}</button>`}</div>`}).join(''));
 card.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>buy(b.dataset.b));
}
function buy(id){
 const it=SHOP.find(s=>s.id===id),w=id[0]==='w';
 if(coins<it.pr)return openShop('Moedas insuficientes!');
 coins-=it.pr;
 if(w){const i=+id.slice(1);own.push(i);own.sort((a,b)=>a-b);buildSlots();if(G){G.p.w=i;G.p.rl=0}}
 saveSv();$('#coins').textContent=coins;openShop('Comprado: '+it.n);
}
tap('#shopb',()=>openShop());
