/* CAOS BR FPS · dados das armas (WP)
   Cada linha = uma arma. Campos:
     n  nome mostrado        cd tempo entre tiros (s)   dm dano   mag balas no pente
     pel projéteis por tiro  sp espalhamento            rl tempo de recarga (s)
     bv velocidade da bala  rg alcance  bn comprimento do traço  bt espessura do traço
     pr PREÇO na loja (0 = já vem liberada)             d  descrição (opcional; se faltar, é gerada)
     ic ícone (img/armas/<id>.png)                      m  modelo 3D (chave em GUNMESH, js/personagens/armas-3d.js)
   hide:1 = não aparece no menu nem na partida (as 6 primeiras são antigas; ficam só porque os bots usam o FUZIL e os saves usam a posição)
   (o jogador pode EQUIPAR até 3 armas no menu ARMAS; cada uma vira um slot na partida)
   st:1 = arma inicial (o jogador já começa com ela)
   IMPORTANTE: só ADICIONE armas no fim da lista (antes do PUNHO não importa, ele é achado por fist:true).
   O jogador salva as armas pelo NÚMERO da posição aqui, então não reordene nem apague as existentes.
   Para trocar preço, é só mudar o "pr" da arma. */
const WP=[
 {hide:1,n:'PISTOLA',cd:.3,dm:30,mag:12,pel:1,sp:.02,rl:1,pr:0,d:'Equilibrada · 12 balas'},
 {hide:1,n:'FUZIL',cd:.12,dm:22,mag:30,pel:1,sp:.06,rl:1.6,pr:0,d:'Automático · 30 balas'},
 {hide:1,n:'SHOTGUN',cd:.7,dm:20,mag:6,pel:6,sp:.3,rl:1.8,pr:0,d:'6 projéteis por tiro · 6 balas'},
 {hide:1,n:'SMG',cd:.07,dm:15,mag:40,pel:1,sp:.09,rl:1.4,pr:1500,d:'Rápida · 40 balas'},
 {hide:1,n:'SNIPER',cd:1.1,dm:120,mag:5,pel:1,sp:.005,rl:2.2,pr:3500,d:'120 de dano · 5 balas'},
 {hide:1,n:'REVÓLVER',cd:.5,dm:65,mag:6,pel:1,sp:.015,rl:1.5,pr:1200,d:'65 de dano · 6 balas'},
 // ===== armas novas (mesmos números da classe: fuzil/SMG/shotgun/sniper/pistola/revólver) =====
 {id:'m1911',st:1,n:'M1911',cd:0.25,bv:850,rg:600,bn:10,bt:1.2,dm:30,mag:12,pel:1,sp:.02,rl:1,pr:800,ic:'img/armas/m1911.png',m:'m1911'},
 {id:'peacemaker',n:'PEACEMAKER',cd:0.45,bv:950,rg:700,bn:12,bt:1.4,dm:65,mag:6,pel:1,sp:.015,rl:1.5,pr:1200,ic:'img/armas/peacemaker.png',m:'peacemaker'},
 {id:'mp5',n:'MP5',cd:0.075,bv:900,rg:600,bn:10,bt:1.1,dm:15,mag:40,pel:1,sp:.09,rl:1.4,pr:1500,ic:'img/armas/mp5.png',m:'mp5'},
 {id:'remington870',st:1,n:'REMINGTON 870',cd:0.8,bv:700,rg:420,bn:6,bt:1.0,dm:20,mag:6,pel:6,sp:.3,rl:1.8,pr:2000,ic:'img/armas/remington870.png',m:'remington870'},
 {id:'espingarda',n:'ESPINGARDA CLÁSSICA',cd:0.9,bv:680,rg:420,bn:6,bt:1.0,dm:20,mag:6,pel:6,sp:.3,rl:1.8,pr:2000,ic:'img/armas/espingarda.png',m:'espingarda'},
 {id:'m4a1',st:1,n:'M4A1',cd:0.09,bv:1200,rg:900,bn:15,bt:1.2,dm:22,mag:30,pel:1,sp:.06,rl:1.6,pr:2500,ic:'img/armas/m4a1.png',m:'m4a1'},
 {id:'ak47',n:'AK-47',cd:0.11,bv:1100,rg:850,bn:15,bt:1.3,dm:22,mag:30,pel:1,sp:.06,rl:1.6,pr:2500,ic:'img/armas/ak47.png',m:'ak47'},
 {id:'scar',n:'SCAR',cd:0.1,bv:1250,rg:950,bn:16,bt:1.3,dm:22,mag:30,pel:1,sp:.06,rl:1.6,pr:2800,ic:'img/armas/scar.png',m:'scar'},
 {id:'m249',n:'M249',cd:0.075,bv:1150,rg:900,bn:16,bt:1.4,dm:22,mag:30,pel:1,sp:.06,rl:1.6,pr:4000,ic:'img/armas/m249.png',m:'m249'},
 {id:'awm',n:'AWM',cd:1.3,bv:2400,rg:1800,bn:36,bt:1.5,dm:120,mag:5,pel:1,sp:.005,rl:2.2,pr:3500,ic:'img/armas/awm.png',m:'awm'},
 {id:'dragunov',n:'DRAGUNOV',cd:0.9,bv:2000,rg:1500,bn:30,bt:1.4,dm:120,mag:5,pel:1,sp:.005,rl:2.2,pr:3500,ic:'img/armas/dragunov.png',m:'dragunov'},
 {id:'rpg7',n:'RPG-7',cd:1.6,bv:650,rg:1400,bn:26,bt:4,dm:120,mag:1,pel:1,sp:.005,rl:2.2,pr:6000,ic:'img/armas/rpg7.png',m:'rpg7',d:'120 de dano · 1 foguete (sem explosão ainda)'},
 // ===== punho: sempre disponível, sem munição =====
 {id:'punho',n:'PUNHO',em:'✊',fist:1,cd:.45,dm:20,mag:999,pel:1,sp:0,rl:0,life:.07,pr:0,d:'Corpo a corpo'}
];

