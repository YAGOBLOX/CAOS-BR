/* CAOS BR FPS · TELA DE CARREGAMENTO (v44): lobby → partida. Não é enfeite de tempo fixo: acompanha o carregamento de verdade.
   Um canvas 2D por cima do lobby (800x450 lógicos, desenhado em 1,5x). Cena em LOOP: dois soldados atrás de barreiras trocando tiros
   (mais dois duelistas ao fundo), rastros se cruzando, clarão no cano, cápsulas, fumaça, faíscas, marcas nas barreiras, céu/skyline com
   paralaxe, brasas, título "CAOS BR FPS" com glitch, RACHADURAS de vidro que surgem conforme o progresso e barra inclinada embaixo.
   Só sai quando: pronto() é verdadeiro E passou o tempo mínimo E a barra chegou a 100%. Nunca antes; tempo máximo → fim(false).
   Uso: CAOS.transicao({progresso:()=>0..1, pronto:()=>bool, texto:()=>'o que está carregando', fim:ok=>{}, minimo, maximo, abertura:true, pausar:true}) → {cancelar()}.
   abertura:false = começa direto na cena (sem as faixas de neon); pausar:false = não pausa o lobby 3D por baixo (precisa desenhar o 1º quadro).
   Quem decide o que é "carregar" é js/lobby/partida.js. Sem imagens, sem áudio, sem bibliotecas. */
CAOS.transicao=function(o){
 o=o||{};const st=document.getElementById('stage');
 const MIN=o.minimo||3.8,MAX=o.maximo||25,prog=o.progresso||(()=>1),pronto=o.pronto||(()=>true),texto=o.texto||(()=>'');
 let fim0=false;const acabou=ok=>{if(fim0)return;fim0=true;o.fim&&o.fim(ok)};
 if(!st||document.getElementById('trans')){acabou(true);return{cancelar(){}}}
 const W=800,H=450,RES=1.5,PI2=6.2832;
 const cv=document.createElement('canvas');cv.id='trans';cv.width=W*RES;cv.height=H*RES;st.appendChild(cv);
 const x=cv.getContext('2d');
 const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w*RES;c.height=h*RES;const g=c.getContext('2d');g.scale(RES,RES);return[c,g]};
 let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
 const ease=v=>v<0?0:v>1?1:v*v*(3-2*v),lin=(v,a,b)=>Math.max(0,Math.min(1,(v-a)/(b-a)));
 const FONT='"Barlow Condensed",Impact,"Arial Narrow",sans-serif';

 // ---------- cenário parado (pré-desenhado uma vez) ----------
 const HZ=268;   // linha do horizonte
 const [bgC,bg]=mk(W,H);
 (function(){
  let g=bg.createLinearGradient(0,0,0,HZ);g.addColorStop(0,'#07040f');g.addColorStop(.45,'#23103e');g.addColorStop(.8,'#7b2a5c');g.addColorStop(1,'#ff8a30');
  bg.fillStyle=g;bg.fillRect(0,0,W,HZ);
  g=bg.createRadialGradient(W/2,HZ,10,W/2,HZ,300);g.addColorStop(0,'rgba(255,190,90,.75)');g.addColorStop(.4,'rgba(255,120,50,.28)');g.addColorStop(1,'rgba(255,90,40,0)');
  bg.fillStyle=g;bg.fillRect(0,0,W,H);
  bg.fillStyle='rgba(255,236,190,.9)';bg.beginPath();bg.arc(W/2,HZ-6,26,0,PI2);bg.fill();   // sol baixo atrás da névoa
  for(let i=0;i<46;i++){bg.fillStyle='rgba(255,255,255,'+(.15+rnd()*.5)+')';bg.fillRect(rnd()*W,rnd()*HZ*.7,1.2,1.2)}   // estrelas
  g=bg.createLinearGradient(0,HZ,0,H);g.addColorStop(0,'#2a1230');g.addColorStop(.25,'#150a22');g.addColorStop(1,'#05030a');
  bg.fillStyle=g;bg.fillRect(0,HZ,W,H-HZ);
  // chão em perspectiva (grade)
  bg.lineWidth=1;
  for(let k=1;k<14;k++){const yy=HZ+Math.pow(k/13,2.1)*(H-HZ);bg.strokeStyle='rgba(120,220,255,'+(.04+.13*k/13)+')';bg.beginPath();bg.moveTo(0,yy);bg.lineTo(W,yy);bg.stroke()}
  for(let k=-14;k<=14;k++){bg.strokeStyle='rgba(120,220,255,.09)';bg.beginPath();bg.moveTo(W/2+k*14,HZ);bg.lineTo(W/2+k*95,H);bg.stroke()}
  g=bg.createLinearGradient(0,HZ-18,0,HZ+34);g.addColorStop(0,'rgba(255,150,70,0)');g.addColorStop(.5,'rgba(255,150,70,.35)');g.addColorStop(1,'rgba(255,150,70,0)');
  bg.fillStyle=g;bg.fillRect(0,HZ-18,W,52);
 })();
 // skyline em duas camadas (cada uma é uma "tira" de 800 px que se repete sem emenda)
 function skyline(n,hmin,hmax,col,win,wcol){
  const [c,g]=mk(W,HZ+4);g.fillStyle=col;const R=[];
  for(let i=0;i<n;i++){const w=18+rnd()*38,h=hmin+rnd()*(hmax-hmin),px=rnd()*W;R.push([px,w,h])}
  for(const[px,w,h]of R)for(const d of[0,-W,W]){g.fillRect(px+d,HZ-h,w,h+4);
   if(rnd()<.5){g.fillRect(px+d+w*.4,HZ-h-9,2,9)}}
  for(const[px,w,h]of R)for(let k=0;k<win;k++){const wx=px+3+rnd()*(w-7),wy=HZ-h+4+rnd()*(h-10);g.fillStyle=wcol[rnd()*wcol.length|0];g.fillRect(wx,wy,2,2.4)}
  return c;
 }
 const sky1=skyline(26,26,70,'#3a1a4a',20,['rgba(255,190,100,.55)','rgba(140,220,255,.4)']);
 const sky2=skyline(20,44,118,'#170b26',34,['rgba(255,170,70,.7)','rgba(255,90,130,.5)','rgba(120,230,255,.55)']);
 // primeiro plano parado: pilares escuros nas bordas, vinheta, faixas de scanline e painel escuro da barra
 const [fgC,fg]=mk(W,H);
 (function(){
  for(const[sd,x0]of[[1,0],[-1,W]]){
   let g=fg.createLinearGradient(x0,0,x0+sd*70,0);g.addColorStop(0,'rgba(4,2,8,.97)');g.addColorStop(1,'rgba(4,2,8,0)');fg.fillStyle=g;fg.fillRect(Math.min(x0,x0+sd*70),0,70,H);
   fg.fillStyle='#06030c';fg.beginPath();fg.moveTo(x0,0);fg.lineTo(x0+sd*26,0);fg.lineTo(x0+sd*20,H);fg.lineTo(x0,H);fg.fill();
   fg.strokeStyle='rgba(255,150,60,.55)';fg.lineWidth=1.4;fg.beginPath();fg.moveTo(x0+sd*26,0);fg.lineTo(x0+sd*20,H);fg.stroke();
   fg.strokeStyle='rgba(0,0,0,.9)';fg.lineWidth=2;fg.beginPath();fg.moveTo(x0+sd*26,0);fg.bezierCurveTo(x0+sd*70,60,x0+sd*100,40,x0+sd*140,100);fg.stroke();   // cabo pendurado
  }
  let g=fg.createRadialGradient(W/2,H*.46,H*.3,W/2,H*.5,W*.66);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.62)');fg.fillStyle=g;fg.fillRect(0,0,W,H);
  g=fg.createLinearGradient(0,352,0,H);g.addColorStop(0,'rgba(5,3,10,0)');g.addColorStop(.35,'rgba(5,3,10,.82)');g.addColorStop(1,'rgba(5,3,10,.96)');fg.fillStyle=g;fg.fillRect(0,352,W,H-352);
  fg.fillStyle='rgba(0,0,0,.07)';for(let y=0;y<H;y+=3)fg.fillRect(0,y,W,1);
 })();

 // ---------- título (pré-desenhado; refeito quando a fonte carregar) ----------
 let ttl=null;
 function buildTitle(){
  const[c,g]=mk(W,200);
  g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
  g.font='800 98px '+FONT;try{g.letterSpacing='3px'}catch(e){}
  g.save();g.translate(400,84);g.transform(1,0,-.16,1,0,0);
  g.shadowColor='rgba(255,120,20,.95)';g.shadowBlur=28;g.lineWidth=15;g.strokeStyle='#1b0a02';g.strokeText('CAOS BR',0,0);
  g.shadowBlur=0;g.strokeText('CAOS BR',0,0);
  const gr=g.createLinearGradient(0,-50,0,50);gr.addColorStop(0,'#ffffff');gr.addColorStop(.42,'#ffe58a');gr.addColorStop(.52,'#ff9a1a');gr.addColorStop(1,'#ff4d0a');
  g.fillStyle=gr;g.fillText('CAOS BR',0,0);
  g.lineWidth=1.6;g.strokeStyle='rgba(255,255,255,.9)';g.strokeText('CAOS BR',0,0);
  g.restore();
  g.save();g.translate(400,148);g.transform(1,0,-.16,1,0,0);
  g.fillStyle='rgba(255,194,26,.75)';g.fillRect(-230,-1.5,150,3);g.fillRect(90,-1.5,150,3);
  g.shadowColor='rgba(255,140,20,.8)';g.shadowBlur=12;g.fillStyle='#ffc21a';g.beginPath();g.moveTo(-58,-18);g.lineTo(64,-18);g.lineTo(54,18);g.lineTo(-68,18);g.closePath();g.fill();
  g.shadowBlur=0;g.fillStyle='#1b0a02';g.font='800 31px '+FONT;try{g.letterSpacing='6px'}catch(e){}g.fillText('FPS',0,2);
  g.restore();
  const tint=col=>{const[c2,g2]=mk(W,200);g2.drawImage(c,0,0,W,200);g2.globalCompositeOperation='source-in';g2.fillStyle=col;g2.fillRect(0,0,W,200);return c2};
  ttl={c,cy:tint('#00e5ff'),mg:tint('#ff2a8a')};
 }
 buildTitle();
 try{document.fonts&&document.fonts.load('800 98px "Barlow Condensed"').then(()=>{if(!fim0)buildTitle()},()=>{})}catch(e){}

 // ---------- rachaduras de vidro (cada uma é desenhada uma vez e "cresce" ao aparecer) ----------
 function crack(cx,cy,R,sd){
  const[c,g]=mk(W,H);let s=sd;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  const n=10+(r()*5|0),A=[],rays=[];
  for(let i=0;i<n;i++){let a=i/n*PI2+(r()-.5)*.35,len=R*(.45+r()*.55),px=cx,py=cy,L=0;const pts=[[cx,cy]];
   while(L<len){const stp=10+r()*16;a+=(r()-.5)*.28;px+=Math.cos(a)*stp;py+=Math.sin(a)*stp;L+=stp;pts.push([px,py]);
    if(r()<.16&&L>20){let ba=a+(r()<.5?-1:1)*(.5+r()*.5),bx=px,by=py,bl=0;const bm=len*(.15+r()*.25),bp=[[bx,by]];
     while(bl<bm){const s2=8+r()*10;ba+=(r()-.5)*.35;bx+=Math.cos(ba)*s2;by+=Math.sin(ba)*s2;bl+=s2;bp.push([bx,by])}A.push(bp)}}
   A.push(pts);rays.push(pts)}
  const ring=[];for(const k of[2,4,6])for(let i=0;i<n;i++){const p=rays[i][k],q=rays[(i+1)%n][k];if(p&&q&&r()<.8)ring.push([p,q])}
  g.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<n;i++){if(r()<.5)continue;const p=rays[i],q=rays[(i+1)%n];const m=Math.min(4,p.length-1,q.length-1);g.beginPath();g.moveTo(cx,cy);for(let k=1;k<=m;k++)g.lineTo(p[k][0],p[k][1]);for(let k=m;k>=1;k--)g.lineTo(q[k][0],q[k][1]);g.fill()}
  const st=(col,lw,dx)=>{g.strokeStyle=col;g.lineWidth=lw;g.lineCap=g.lineJoin='round';g.beginPath();
   for(const p of A){g.moveTo(p[0][0]+dx,p[0][1]+dx);for(let k=1;k<p.length;k++)g.lineTo(p[k][0]+dx,p[k][1]+dx)}
   for(const[p,q]of ring){g.moveTo(p[0]+dx,p[1]+dx);g.lineTo(q[0]+dx,q[1]+dx)}g.stroke()};
  st('rgba(0,0,0,.55)',2.4,1.2);g.shadowColor='#8fd8ff';g.shadowBlur=5;st('rgba(220,244,255,.9)',1,0);g.shadowBlur=0;
  g.fillStyle='rgba(0,0,0,.75)';g.beginPath();g.arc(cx,cy,4,0,PI2);g.fill();g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=1.2;g.beginPath();g.arc(cx,cy,5.5,0,PI2);g.stroke();
  return{c,cx,cy,R,t:0};
 }
 const CR=[crack(400,120,200,3),crack(112,150,150,5),crack(702,130,170,9),crack(560,262,120,13),crack(236,246,130,17)],TH=[-1,.18,.42,.66,.88];
 let nCr=0;

 // ---------- soldados, tiros e partículas ----------
 const E={bul:[],spk:[],cas:[],smk:[],emb:[]};
 for(let i=0;i<34;i++)E.emb.push({x:rnd()*W,y:rnd()*H,v:8+rnd()*22,s:.8+rnd()*1.6,p:rnd()*6,d:.4+rnd()*.9});
 // near=1: dupla da frente (grande); near=0: duelistas ao fundo (pequenos e mais escuros)
 const mkS=(px,py,s,dir,near,rim,acc,t0)=>({px,py,s,dir,near,rim,acc,rec:0,fl:0,nb:t0,left:0,ns:0,dec:[],bx:px+dir*s*52,hw:s*34,yt:py-s*34});
 const S=[mkS(150,352,1.15,1,1,'#ff9a3c','#ff7a1a',.7),mkS(650,352,1.15,-1,1,'#52d8ff','#27c6ff',1.25),
          mkS(318,277,.42,1,0,'#a8587a','#ff7a1a',.9),mkS(482,277,.42,-1,0,'#4b7f96','#27c6ff',1.6)];
 function soldier(g,q,pass){
  const col=pass?(q.near?'#150c20':'#201233'):q.rim,rx=-q.rec;
  g.save();g.translate(q.px,q.py);g.scale(q.dir*q.s,q.s);if(!pass)g.translate(1.8,-1.5);
  g.fillStyle=g.strokeStyle=col;g.lineCap=g.lineJoin='round';
  g.lineWidth=9;g.beginPath();g.moveTo(-8,-30);g.lineTo(8,-17);g.lineTo(-2,-1);g.stroke();
  g.beginPath();g.moveTo(-6,-30);g.lineTo(15,-22);g.lineTo(15,-1);g.stroke();
  g.lineWidth=17;g.beginPath();g.moveTo(-8,-30);g.lineTo(-3+rx*.5,-56);g.stroke();
  g.fillRect(-18+rx*.3,-59,9,25);
  g.beginPath();g.arc(2+rx*.4,-68,6.5,0,PI2);g.fill();
  g.beginPath();g.arc(2+rx*.4,-69.5,8.3,Math.PI*1.02,Math.PI*2.04);g.fill();
  g.lineWidth=5.5;g.beginPath();g.moveTo(-2+rx*.5,-54);g.lineTo(10+rx,-45);g.lineTo(27+rx,-50);g.stroke();
  g.lineWidth=4.4;g.beginPath();g.moveTo(-14+rx,-45);g.lineTo(44+rx,-51);g.stroke();
  g.lineWidth=2.4;g.beginPath();g.moveTo(44+rx,-51);g.lineTo(58+rx,-52);g.stroke();
  if(pass){g.fillStyle=q.acc;g.fillRect(5+rx*.4,-70.4,5,2.6);g.fillRect(-9+rx*.4,-62,6,3)}
  g.restore();
 }
 function barrier(g,q){
  const x0=q.bx-q.hw,x1=q.bx+q.hw,yt=q.yt,yb=q.py+5,k=q.s;
  g.save();g.beginPath();g.moveTo(x0-4*k,yb);g.lineTo(x0+3*k,yt);g.lineTo(x1-3*k,yt);g.lineTo(x1+4*k,yb);g.closePath();
  const gr=g.createLinearGradient(0,yt,0,yb);gr.addColorStop(0,q.near?'#4a3b58':'#3a2d48');gr.addColorStop(1,'#171022');g.fillStyle=gr;g.fill();g.clip();
  g.fillStyle='rgba(255,194,26,.8)';for(let i=-2;i<9;i++){const sx=x0+i*10*k;g.beginPath();g.moveTo(sx,yt+9*k);g.lineTo(sx+5*k,yt+9*k);g.lineTo(sx-1*k,yt+15*k);g.lineTo(sx-6*k,yt+15*k);g.fill()}
  g.restore();
  g.strokeStyle=q.rim;g.globalAlpha=.8;g.lineWidth=1.3;g.beginPath();g.moveTo(x0+3*k,yt);g.lineTo(x1-3*k,yt);g.stroke();g.globalAlpha=1;
 }
 function fire(q,t){
  const o=S[q.dir>0?(q.near?1:3):(q.near?0:2)];   // oponente
  const mx=q.px+q.dir*q.s*58,my=q.py-q.s*52,hit=rnd()<.68;
  let tx,ty;if(hit){tx=o.bx+o.dir*o.hw;ty=o.yt+3+rnd()*o.s*26}else{tx=q.dir>0?860:-60;ty=o.yt-12-rnd()*70*o.s}
  const dx=tx-mx,dy=ty-my,L=Math.hypot(dx,dy),v=(q.near?1250:800)/L;
  E.bul.push({x:mx,y:my,vx:dx*v,vy:dy*v,tx,hit,o,q,w:q.near?2.3:1.2,len:q.near?34:16,c:q.dir>0?'255,214,120':'150,235,255'});
  q.rec=3.6;q.fl=1;
  if(q.near){E.cas.push({x:q.px+q.dir*q.s*14,y:my-6,vx:-q.dir*(20+rnd()*40),vy:-70-rnd()*50,a:0,va:(rnd()-.5)*20,t});
   if(rnd()<.35)E.smk.push({x:mx+q.dir*6,y:my,r:3,t,v:q.dir*14})}
  q.mx=mx;q.my=my;
 }
 function impact(b,t){
  const o=b.o;if(o.dec.length>12)o.dec.shift();o.dec.push({x:b.tx,y:b.y,t});
  for(let n=0;n<(o.near?9:4);n++){const a=(b.vx>0?Math.PI:0)+(rnd()-.5)*2.4,v=50+rnd()*150;E.spk.push({x:b.tx,y:b.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,t,c:b.c})}
  if(E.smk.length<26&&o.near)E.smk.push({x:b.tx,y:b.y,r:2,t,v:0});
 }

 // ---------- laço principal ----------
 const OFF=o.abertura===false?.38:0;   // pula a abertura (as faixas) quando a tela abre sozinha ao iniciar o jogo
 let t0=null,tp=0,disp=0,te=null,cancel=false,tLento=0,gt=-9,shk=-9,flh=-9,tipI=-1;
 const TIPS=['USE A COBERTURA: PAREDE BOA VALE MAIS QUE VIDA EXTRA','RECARREGUE ANTES DE AVANÇAR, NÃO NO MEIO DO TIROTEO','MIRE NA CABEÇA, MAS NUNCA PARE DE SE MOVER','QUEM ATIRA SEM MIRAR REVELA ONDE ESTÁ','NÃO FIQUE PARADO: O CAOS NÃO ESPERA'];
 function frame(ts){
  if(cancel)return;
  if(t0===null){t0=ts;tp=ts}
  const t=(ts-t0)/1000+OFF,dt=Math.min(.1,(ts-tp)/1000);tp=ts;
  // ---- estado do carregamento ----
  const ok=!!pronto(),real=Math.max(0,Math.min(1,+prog()||0));
  const alvo=ok?1:Math.min(.96,Math.max(real*.94,disp))+(disp<.94?dt*.015:0);
  disp+=(alvo-disp)*Math.min(1,dt*(ok?7:3));
  if(!ok&&disp>.96)disp=.96;
  if(te===null&&ok&&t>=MIN&&disp>.985)te=t;
  if(te===null&&t>=MAX){te=t;tLento=1}
  if(t>.45&&o.pausar!==false&&CAOS.lobby)CAOS.lobby.paused=true;   // a tela já está coberta: poupa a GPU para o carregamento
  x.setTransform(RES,0,0,RES,0,0);x.clearRect(0,0,W,H);

  // ---- abertura: faixas de neon fecham a tela (0 → .38 s) ----
  if(t<.4&&!OFF){
   const c=ease(lin(t,0,.38)),SL=140,xe=W/2+70,xl=-260+(xe+260)*c,xr=W+260+(xe-W-260)*c;
   x.fillStyle='rgba(8,5,16,'+(.98*Math.min(1,c*1.5))+')';
   x.beginPath();x.moveTo(-80,0);x.lineTo(xl,0);x.lineTo(xl-SL,H);x.lineTo(-80,H);x.fill();
   x.beginPath();x.moveTo(W+80,0);x.lineTo(xr,0);x.lineTo(xr-SL,H);x.lineTo(W+80,H);x.fill();
   if(c<1){x.strokeStyle='#ffc21a';x.lineWidth=4;x.shadowColor='#ff9a1a';x.shadowBlur=12;
    x.beginPath();x.moveTo(xl,0);x.lineTo(xl-SL,H);x.moveTo(xr,0);x.lineTo(xr-SL,H);x.stroke();x.shadowBlur=0}
   requestAnimationFrame(frame);return;
  }
  const ti=t-.38;   // tempo da cena
  // gatilhos das rachaduras (cada uma surge com um impacto na tela)
  while(nCr<CR.length&&(nCr===0?ti>.55:disp>=TH[nCr])){CR[nCr].t=t;nCr++;shk=t;gt=t;flh=t}
  // ---- agenda dos tiros ----
  for(const q of S){
   if(q.left===0&&t>=q.nb){q.left=q.near?5+(rnd()*4|0):3+(rnd()*3|0);q.ns=t}
   if(q.left>0&&t>=q.ns){fire(q,t);q.left--;q.ns=t+(q.near?.075:.14)+rnd()*.03;if(q.left===0)q.nb=t+(q.near?1.0:1.4)+rnd()*1.0}
   q.rec*=Math.exp(-dt*26);q.fl=Math.max(0,q.fl-dt*13);
  }
  // ---- cena (com tremor e "zoom" de entrada) ----
  const zi=1+.06*(1-ease(lin(ti,0,.6)));
  let sx=0,sy=0;const sk=t-shk;if(sk<.3){const a=(1-sk/.3)*5;sx=(rnd()-.5)*a;sy=(rnd()-.5)*a}
  for(const b of E.bul)if(t-b.q.ns<.05){sx+=(rnd()-.5)*.8;sy+=(rnd()-.5)*.8}
  x.save();x.translate(W/2+sx,H/2+sy);x.scale(zi,zi);x.translate(-W/2,-H/2);
  x.drawImage(bgC,0,0,W,H);
  // feixes de luz (aditivo, bem suaves)
  x.globalCompositeOperation='lighter';
  for(let i=0;i<2;i++){const a=.05+.025*Math.sin(t*.6+i*2),bx=240+i*320+Math.sin(t*.3+i)*30;
   const g=x.createLinearGradient(bx,0,bx+90,H*.8);g.addColorStop(0,'rgba(255,170,90,'+a+')');g.addColorStop(1,'rgba(255,170,90,0)');
   x.fillStyle=g;x.beginPath();x.moveTo(bx,0);x.lineTo(bx+70,0);x.lineTo(bx+250,H*.8);x.lineTo(bx+80,H*.8);x.fill()}
  x.globalCompositeOperation='source-over';
  const o1=-((t*5)%W),o2=-((t*11)%W);
  x.drawImage(sky1,o1,HZ-HZ-0,W,HZ+4);x.drawImage(sky1,o1+W,0,W,HZ+4);
  x.drawImage(sky2,o2,0,W,HZ+4);x.drawImage(sky2,o2+W,0,W,HZ+4);
  // duelistas do fundo (pequenos, esfumaçados)
  for(const q of S)if(!q.near){x.globalAlpha=.85;soldier(x,q,0);soldier(x,q,1);barrier(x,q);x.globalAlpha=1}
  // névoa entre os planos
  let g=x.createLinearGradient(0,HZ-8,0,HZ+90);g.addColorStop(0,'rgba(255,140,70,0)');g.addColorStop(.35,'rgba(160,70,110,.28)');g.addColorStop(1,'rgba(20,8,30,0)');x.fillStyle=g;x.fillRect(0,HZ-8,W,98);
  // dupla da frente
  for(const q of S)if(q.near){soldier(x,q,0);soldier(x,q,1);barrier(x,q)}
  // marcas de bala nas barreiras
  for(const q of S){for(let i=q.dec.length-1;i>=0;i--){const d=q.dec[i],a=1-lin(t-d.t,3,5);if(a<=0){q.dec.splice(i,1);continue}
   x.globalAlpha=a;x.fillStyle='rgba(0,0,0,.85)';x.beginPath();x.ellipse(d.x,d.y,2.6*q.s+.6,2*q.s+.5,0,0,PI2);x.fill();
   x.strokeStyle='rgba(255,200,120,.55)';x.lineWidth=.8;x.beginPath();x.ellipse(d.x,d.y,4.2*q.s+.6,3.4*q.s+.5,0,0,PI2);x.stroke();x.globalAlpha=1}}
  // tiros: rastro com cauda
  x.globalCompositeOperation='lighter';x.lineCap='round';
  for(let i=E.bul.length-1;i>=0;i--){const b=E.bul[i];b.x+=b.vx*dt;b.y+=b.vy*dt;
   const done=b.vx>0?b.x>=b.tx:b.x<=b.tx;
   if(done){if(b.hit)impact(b,t);E.bul.splice(i,1);continue}
   const m=Math.hypot(b.vx,b.vy),ux=b.vx/m,uy=b.vy/m,gr=x.createLinearGradient(b.x-ux*b.len,b.y-uy*b.len,b.x,b.y);
   gr.addColorStop(0,'rgba('+b.c+',0)');gr.addColorStop(1,'rgba('+b.c+',1)');x.strokeStyle=gr;x.lineWidth=b.w;x.beginPath();x.moveTo(b.x-ux*b.len,b.y-uy*b.len);x.lineTo(b.x,b.y);x.stroke();
   x.fillStyle='#fff';x.beginPath();x.arc(b.x,b.y,b.w*.6,0,PI2);x.fill()}
  // clarão no cano
  for(const q of S)if(q.fl>0&&q.mx!==undefined){const a=q.fl,r=(q.near?36:15)*(.6+a*.5);
   const f=x.createRadialGradient(q.mx,q.my,1,q.mx,q.my,r);f.addColorStop(0,'rgba(255,252,225,'+a+')');f.addColorStop(.35,'rgba('+(q.dir>0?'255,170,40':'110,210,255')+','+a*.75+')');f.addColorStop(1,'rgba(255,90,0,0)');
   x.fillStyle=f;x.fillRect(q.mx-r,q.my-r,r*2,r*2);
   x.strokeStyle='rgba(255,228,160,'+a+')';x.lineWidth=q.near?1.8:1;for(let n=0;n<5;n++){const an=(q.dir>0?-.55:Math.PI+.55)+(n-2)*.28;x.beginPath();x.moveTo(q.mx,q.my);x.lineTo(q.mx+Math.cos(an)*r*1.5,q.my+Math.sin(an)*r*1.5);x.stroke()}
   if(q.near){const lg=x.createRadialGradient(q.px,q.py-30,5,q.px,q.py-30,150);lg.addColorStop(0,'rgba(255,170,70,'+a*.16+')');lg.addColorStop(1,'rgba(255,170,70,0)');x.fillStyle=lg;x.fillRect(q.px-150,q.py-180,300,300)}}
  // faíscas
  for(let i=E.spk.length-1;i>=0;i--){const p=E.spk[i],k=t-p.t;if(k>.4){E.spk.splice(i,1);continue}const a=1-k/.4;
   x.fillStyle='rgba(255,'+(170+70*a|0)+',70,'+a+')';x.fillRect(p.x+p.vx*k,p.y+p.vy*k+420*k*k,2.2,2.2)}
  // brasas subindo
  for(const e of E.emb){e.y-=e.v*dt;e.x+=Math.sin(t*.7+e.p)*6*dt;if(e.y<-4){e.y=H+4;e.x=rnd()*W}
   x.fillStyle='rgba(255,'+(140+60*Math.sin(t*3+e.p)|0)+',60,'+(.25+.3*Math.sin(t*2+e.p))*e.d+')';x.fillRect(e.x,e.y,e.s,e.s)}
  x.globalCompositeOperation='source-over';
  // cápsulas e fumaça
  for(let i=E.cas.length-1;i>=0;i--){const c=E.cas[i],k=t-c.t;if(k>.7){E.cas.splice(i,1);continue}
   c.vy+=520*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;c.a+=c.va*dt;x.save();x.translate(c.x,c.y);x.rotate(c.a);x.fillStyle='#e0a83a';x.fillRect(-2,-.9,4,1.8);x.restore()}
  for(let i=E.smk.length-1;i>=0;i--){const s=E.smk[i],k=t-s.t;if(k>1.3){E.smk.splice(i,1);continue}
   s.r+=dt*22;s.y-=dt*14;s.x+=s.v*dt;x.fillStyle='rgba(190,170,190,'+.2*(1-k/1.3)+')';x.beginPath();x.arc(s.x,s.y,s.r,0,PI2);x.fill()}
  x.drawImage(fgC,0,0,W,H);
  // título: entra "batendo" (escala) e dá glitch a cada impacto de vidro
  {const a=ease(lin(ti,.05,.45)),s=1+.35*(1-ease(lin(ti,.05,.5)));
   x.save();x.translate(W/2,108);x.scale(s,s);x.translate(-W/2,-108);x.globalAlpha=a;
   const gl=t-gt<.22,bob=Math.sin(t*1.3)*1.5;
   if(gl){const k=(1-(t-gt)/.22)*7;x.globalCompositeOperation='lighter';x.drawImage(ttl.cy,-k,18+bob,W,200);x.drawImage(ttl.mg,k,18+bob,W,200);x.globalCompositeOperation='source-over';
    for(let n=0;n<4;n++){const sy2=20+rnd()*170,hh=8+rnd()*18;x.drawImage(ttl.c,0,sy2*RES,W*RES,hh*RES,(rnd()-.5)*26,18+bob+sy2,W,hh)}}
   x.drawImage(ttl.c,0,18+bob,W,200);x.restore();x.globalAlpha=1}
  // rachaduras
  for(let i=0;i<nCr;i++){const c=CR[i],k=ease(lin(t-c.t,0,.32));x.save();x.beginPath();x.arc(c.cx,c.cy,c.R*1.2*k+1,0,PI2);x.clip();x.drawImage(c.c,0,0,W,H);x.restore();
   const fa=1-lin(t-c.t,0,.3);if(fa>0){const rg=x.createRadialGradient(c.cx,c.cy,2,c.cx,c.cy,c.R*.8);rg.addColorStop(0,'rgba(255,255,255,'+.6*fa+')');rg.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=rg;x.fillRect(c.cx-c.R,c.cy-c.R,c.R*2,c.R*2)}}
  x.restore();

  // ---- indicador de carregamento (embaixo) ----
  {const a=ease(lin(ti,.3,.7)),X0=56,BW=688,BY=402,BH=12,SL=9;x.globalAlpha=a;
   const par=(w)=>{x.beginPath();x.moveTo(X0+SL,BY);x.lineTo(X0+w+SL,BY);x.lineTo(X0+w,BY+BH);x.lineTo(X0,BY+BH);x.closePath()};
   // nome do que carrega + porcentagem
   const pc=Math.round(disp*100);
   x.textBaseline='alphabetic';x.textAlign='left';
   x.fillStyle='rgba(255,194,26,'+(.6+.4*Math.sin(t*5))+')';x.fillRect(X0,380,7,7);
   x.font='700 14px '+FONT;try{x.letterSpacing='2px'}catch(e){}
   x.fillStyle='#f1e6cc';x.fillText(ok?(disp>.985?'TUDO PRONTO':'FINALIZANDO…'):('CARREGANDO · '+String(texto()||'RECURSOS').toUpperCase()),X0+14,388);
   x.textAlign='right';try{x.letterSpacing='0px'}catch(e){}
   x.shadowColor='rgba(255,140,20,.9)';x.shadowBlur=14;x.fillStyle='#fff';x.font='800 34px '+FONT;x.fillText(pc,X0+BW-22,392);
   x.shadowBlur=0;x.fillStyle='#ffc21a';x.font='800 18px '+FONT;x.fillText('%',X0+BW,392);
   // trilho
   par(BW);x.fillStyle='rgba(255,255,255,.09)';x.fill();x.strokeStyle='rgba(255,194,26,.55)';x.lineWidth=1.2;x.stroke();
   // preenchimento com listras andando
   const fw=BW*disp;
   if(fw>1){x.save();par(BW);x.clip();
    const gr=x.createLinearGradient(X0,0,X0+BW,0);gr.addColorStop(0,'#ff5a10');gr.addColorStop(.6,'#ff9a1a');gr.addColorStop(1,'#ffe04a');x.fillStyle=gr;x.fillRect(X0,BY,fw,BH);
    x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=4;const off=(t*34)%18;x.beginPath();for(let sx2=X0-18+off;sx2<X0+fw;sx2+=18){x.moveTo(sx2+BH,BY);x.lineTo(sx2,BY+BH)}x.stroke();
    x.fillStyle='rgba(255,255,255,.28)';x.fillRect(X0,BY,fw,3);
    x.fillStyle='rgba(0,0,0,.55)';for(let i=1;i<20;i++)x.fillRect(X0+BW*i/20,BY,1.4,BH);   // divisões de 5%
    x.restore();
    // ponta: "bala" brilhante com rastro de faíscas
    const hx=X0+fw+SL*.4;x.globalCompositeOperation='lighter';
    const hg=x.createRadialGradient(hx,BY+BH/2,1,hx,BY+BH/2,20);hg.addColorStop(0,'rgba(255,245,200,.95)');hg.addColorStop(1,'rgba(255,150,30,0)');x.fillStyle=hg;x.fillRect(hx-20,BY-14,40,BH+28);
    for(let i=0;i<6;i++){const k=((t*2.2+i/6)%1);x.fillStyle='rgba(255,210,100,'+(1-k)*.8+')';x.fillRect(hx-6-k*34,BY+2+((i*7)%8),2.2,1.6)}
    x.globalCompositeOperation='source-over';x.fillStyle='#fff';x.fillRect(hx-1.5,BY-2,3,BH+4)}
   // dica
   const ix=Math.floor(t/4.2),ph=(t/4.2)%1;if(ix!==tipI)tipI=ix;
   x.textAlign='center';x.font='600 12px '+FONT;try{x.letterSpacing='2px'}catch(e){}x.globalAlpha=a*Math.min(1,ph/.12,(1-ph)/.12)*.8;x.fillStyle='#d9c8a8';x.fillText('DICA · '+TIPS[ix%TIPS.length],W/2,438);
   try{x.letterSpacing='0px'}catch(e){}x.globalAlpha=1}
  // clarão de entrada
  {const f=1-lin(ti,0,.45);if(f>0){x.fillStyle=OFF?'rgba(7,4,15,'+f+')':'rgba(255,226,170,'+f*.9+')';x.fillRect(0,0,W,H)}
   const fk=1-lin(t-flh,0,.14);if(fk>0&&nCr>0){x.fillStyle='rgba(255,255,255,'+fk*.25+')';x.fillRect(0,0,W,H)}}
  // ---- saída: clarão e some ----
  if(te!==null){
   const k=t-te,f=lin(k,0,.2);
   x.fillStyle='rgba(255,236,190,'+f*.92+')';x.fillRect(0,0,W,H);
   cv.style.opacity=1-lin(k,.22,.5);
   if(k>=.5){cv.remove();if(CAOS.lobby)CAOS.lobby.paused=false;acabou(!tLento);return}
  }
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
 return{cancelar(){cancel=true;cv.remove();if(CAOS.lobby)CAOS.lobby.paused=false;acabou(false)}};
};
