/* CAOS BR FPS · LOBBY 3D (three.js carrega em segundo plano; se falhar, fica só o degradê escuro de #lbg)
   Cena real: hangar com paredes/piso/teto com textura e relevo, luzes de verdade (spot do teto com SOMBRA, luzes de neon coloridas,
   luz laranja da janela), névoa, feixes de luz, poeira, parede de armas, bloco da PATENTE e o boneco no pedestal (arraste para girar). Nada aqui é clicável além do giro. */
(function(){
 const hero=document.getElementById('hero'),lbg=document.getElementById('lbg');if(!hero||!lbg)return;
 CAOS.loadChars().then(()=>{
  const GX=CAOS.gfx;if(GX.lb===0)return;   // Lobby 3D desligado: fica só o degradê
  const LEVE=GX.lb===1,W=GX.lobW(),H=Math.round(W*9/16),R=THREE,cvs=document.createElement('canvas');cvs.id='lbg3d';
  const r=new R.WebGLRenderer({canvas:cvs,antialias:!!GX.aa,powerPreference:'high-performance'});r.setPixelRatio(1);r.setSize(W,H,false);const SH=LEVE?0:GX.sh;r.shadowMap.enabled=SH>0;r.shadowMap.type=[0,R.PCFShadowMap,R.PCFShadowMap,R.PCFSoftShadowMap][SH]||R.PCFShadowMap;
  const sc=new R.Scene();sc.background=new R.Color(0x0b1020);sc.fog=new R.FogExp2(0x1b2342,.0012);
  const cam=new R.PerspectiveCamera(26,16/9,1,1200);const CY=31.6;
  // ---------- texturas feitas no código (painéis de metal, piso, cidade da janela, parede de armas) ----------
  let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
  const tx=(c,rx,ry,rep)=>{const t=new R.CanvasTexture(c);if(rep){t.wrapS=t.wrapT=R.RepeatWrapping;t.repeat.set(rx,ry)}t.anisotropy=4;return t};
  function panels(base,seam,cols,rows,accent){   // devolve {map,bump}: painéis com emendas, rebites, riscos e sujeira
   const w=512,h=512,c=mk(w,h),b=mk(w,h),x=c.getContext('2d'),y=b.getContext('2d');
   x.fillStyle=base;x.fillRect(0,0,w,h);y.fillStyle='#888';y.fillRect(0,0,w,h);
   const pw=w/cols,ph=h/rows;
   for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const l=(rnd()-.5)*22;x.fillStyle=`rgba(${l>0?255:0},${l>0?255:0},${l>0?255:0},${Math.abs(l)/255})`;x.fillRect(i*pw,j*ph,pw,ph)}
   for(let i=0;i<=cols;i++){x.fillStyle=seam;x.fillRect(i*pw-1.5,0,3,h);x.fillStyle='rgba(255,255,255,.12)';x.fillRect(i*pw+1.5,0,1,h);y.fillStyle='#000';y.fillRect(i*pw-2,0,4,h)}
   for(let j=0;j<=rows;j++){x.fillStyle=seam;x.fillRect(0,j*ph-1.5,w,3);x.fillStyle='rgba(255,255,255,.12)';x.fillRect(0,j*ph+1.5,w,1);y.fillStyle='#000';y.fillRect(0,j*ph-2,w,4)}
   for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)for(const [dx,dy] of[[8,8],[pw-8,8],[8,ph-8],[pw-8,ph-8]]){x.fillStyle='rgba(255,255,255,.28)';x.beginPath();x.arc(i*pw+dx,j*ph+dy,2.2,0,6.3);x.fill();y.fillStyle='#fff';y.beginPath();y.arc(i*pw+dx,j*ph+dy,2.4,0,6.3);y.fill()}
   if(accent){x.fillStyle=accent;x.globalAlpha=.55;x.fillRect(0,h*.62,w,6);x.globalAlpha=1}
   for(let k=0;k<70;k++){x.strokeStyle=`rgba(255,255,255,${rnd()*.07})`;x.lineWidth=1;x.beginPath();const sx=rnd()*w,sy=rnd()*h;x.moveTo(sx,sy);x.lineTo(sx+rnd()*50-25,sy+rnd()*8-4);x.stroke()}
   for(let k=0;k<1400;k++){x.fillStyle=`rgba(0,0,0,${rnd()*.12})`;x.fillRect(rnd()*w,rnd()*h,1+rnd()*2,1+rnd()*2);y.fillStyle=`rgba(${rnd()<.5?0:255},${rnd()<.5?0:255},${rnd()<.5?0:255},.06)`;y.fillRect(rnd()*w,rnd()*h,2,2)}
   const g=x.createLinearGradient(0,h*.7,0,h);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=g;x.fillRect(0,h*.7,w,h*.3);
   CAOS.texLite(c);CAOS.texLite(b);return{c,b}}
  function mat(P,rx,ry,o){const m=new R.MeshStandardMaterial(Object.assign({map:tx(P.c,rx,ry,1),bumpMap:tx(P.b,rx,ry,1),bumpScale:1.2,roughness:.62,metalness:.35},o||{}));return m}
  const WL=panels('#3a4668','#0d1224',4,1,'#ff9a2e'),WR=panels('#36425f','#0d1224',4,1,'#4fd8ff'),FL=panels('#2c3552','#0a0e1c',2,2),CE=panels('#252d49','#070a14',4,4),BK=panels('#303c5c','#0c1122',6,3);
  // janela: cidade ao pôr do sol (desenhada com céu, sol, prédios em camadas e janelas acesas)
  const WIN=mk(1024,400),wx=WIN.getContext('2d');
  {let g=wx.createLinearGradient(0,0,0,400);g.addColorStop(0,'#2a2470');g.addColorStop(.45,'#c4506f');g.addColorStop(.8,'#ffa860');g.addColorStop(1,'#ffd9a0');wx.fillStyle=g;wx.fillRect(0,0,1024,400);
   g=wx.createRadialGradient(700,300,4,700,300,160);g.addColorStop(0,'rgba(255,245,200,1)');g.addColorStop(.15,'rgba(255,220,140,.8)');g.addColorStop(1,'rgba(255,150,90,0)');wx.fillStyle=g;wx.fillRect(0,0,1024,400);
   for(let L=0;L<3;L++){const col=['#6a5aa8','#403a86','#1a1c42'][L],ba=[120,170,230][L];let xx=-10;while(xx<1024){const w=30+rnd()*60,h=40+rnd()*(90+L*60);wx.fillStyle=col;wx.fillRect(xx,400-h-(L<2?ba*.1:0),w,h+30);
     if(L>0)for(let yy=400-h+8;yy<390;yy+=11)for(let x2=xx+5;x2<xx+w-5;x2+=9)if(rnd()<(.25+L*.15)){wx.fillStyle=rnd()<.8?'#ffd36a':'#9fe6ff';wx.fillRect(x2,yy,4,6)}xx+=w+rnd()*8}}
   g=wx.createLinearGradient(0,250,0,400);g.addColorStop(0,'rgba(255,170,110,0)');g.addColorStop(1,'rgba(255,170,110,.35)');wx.fillStyle=g;wx.fillRect(0,250,1024,150)}
  const RK=mk(512,576),rk=RK.getContext('2d'),IMG={};
  function drawRack(){let g=rk.createLinearGradient(0,0,0,576);g.addColorStop(0,'#1d2a4f');g.addColorStop(1,'#0b1128');rk.fillStyle=g;rk.fillRect(0,0,512,576);
   rk.strokeStyle='#ff9a2e';rk.lineWidth=10;rk.strokeRect(5,5,502,566);rk.fillStyle='#ffd27a';rk.font='bold 30px monospace';rk.textAlign='center';rk.fillText('A R S E N A L',256,50);
   [['ak47','AK-47','#ff5a5a'],['mp5','MP5','#ffd84a'],['scar','SCAR','#4fd8ff']].forEach((w,i)=>{const y=76+i*164;let q=rk.createLinearGradient(0,y,512,y);q.addColorStop(0,'#27407a');q.addColorStop(1,'#101836');rk.fillStyle=q;rk.fillRect(24,y,464,146);rk.strokeStyle='rgba(120,200,255,.5)';rk.lineWidth=2;rk.strokeRect(24,y,464,146);
    const im=IMG[w[0]];if(im){rk.save();rk.shadowColor=w[2];rk.shadowBlur=26;rk.drawImage(im,70,y+10,372,126);rk.restore()}
    rk.fillStyle='#ffe08a';rk.font='bold 22px monospace';rk.textAlign='right';rk.fillText(w[1],476,y+138)});
   const q=rk.createLinearGradient(0,0,512,576);q.addColorStop(.35,'rgba(255,255,255,0)');q.addColorStop(.5,'rgba(255,255,255,.12)');q.addColorStop(.65,'rgba(255,255,255,0)');rk.fillStyle=q;rk.fillRect(0,0,512,576)}   // reflexo do vidro
  drawRack();const RKT=tx(RK);
  ['ak47','mp5','scar'].forEach(n=>{const i=new Image();i.onload=()=>{IMG[n]=i;drawRack();RKT.needsUpdate=true};i.src='img/armas/'+n+'.png'});
  const dot=mk(64,64),dx=dot.getContext('2d'),dg=dx.createRadialGradient(32,32,0,32,32,32);dg.addColorStop(0,'rgba(255,255,255,1)');dg.addColorStop(.3,'rgba(255,255,255,.5)');dg.addColorStop(1,'rgba(255,255,255,0)');dx.fillStyle=dg;dx.fillRect(0,0,64,64);const DOT=tx(dot);
  const beamC=mk(8,128),bx=beamC.getContext('2d'),bgd=bx.createLinearGradient(0,0,0,128);bgd.addColorStop(0,'rgba(255,255,255,.55)');bgd.addColorStop(1,'rgba(255,255,255,0)');bx.fillStyle=bgd;bx.fillRect(0,0,8,128);const BEAM=tx(beamC);
  // ---------- sala ----------
  const Z0=-20,LEN=560,RW=120,RH=100,ZB=-300;
  const add=(m,p,rx,ry,rz)=>{if(p)m.position.set(p[0],p[1],p[2]);if(rx)m.rotation.x=rx;if(ry)m.rotation.y=ry;if(rz)m.rotation.z=rz;sc.add(m);return m};
  const fl=add(new R.Mesh(new R.PlaneGeometry(2*RW,LEN),mat(FL,2*RW/64,LEN/64,{roughness:.38,metalness:.55})),[0,0,Z0],-Math.PI/2);fl.receiveShadow=true;
  add(new R.Mesh(new R.PlaneGeometry(2*RW,LEN),mat(CE,2*RW/64,LEN/64,{roughness:.8})),[0,RH,Z0],Math.PI/2);
  const wl=add(new R.Mesh(new R.PlaneGeometry(LEN,RH),mat(WL,LEN/128,RH/128)),[-RW,RH/2,Z0],0,Math.PI/2),wr=add(new R.Mesh(new R.PlaneGeometry(LEN,RH),mat(WR,LEN/128,RH/128)),[RW,RH/2,Z0],0,-Math.PI/2);wl.receiveShadow=wr.receiveShadow=true;
  const bk=add(new R.Mesh(new R.PlaneGeometry(2*RW,RH),mat(BK,2*RW/128,RH/128)),[0,RH/2,ZB]);bk.receiveShadow=true;
  const M=(c,o)=>new R.MeshStandardMaterial(Object.assign({color:c,roughness:.5,metalness:.6},o||{})),B=(c)=>new R.MeshBasicMaterial({color:c});
  const box=(w,h,d,m,p)=>{const o=new R.Mesh(new R.BoxGeometry(w,h,d),m);o.position.set(p[0],p[1],p[2]);o.castShadow=o.receiveShadow=true;sc.add(o);return o};
  // janela panorâmica na parede do fundo (autoiluminada) com moldura e travessas
  add(new R.Mesh(new R.PlaneGeometry(150,50),new R.MeshBasicMaterial({map:tx(WIN)})),[0,48,ZB+.6]);
  box(156,3,3,M('#6c7799'),[0,73.5,ZB+1.5]);box(156,3,3,M('#6c7799'),[0,22.5,ZB+1.5]);box(3,54,3,M('#6c7799'),[-77.5,48,ZB+1.5]);box(3,54,3,M('#6c7799'),[77.5,48,ZB+1.5]);
  for(const x of[-50,0,50])box(2,50,2,M('#141a33'),[x,48,ZB+1.8]);box(150,2,2,M('#141a33'),[0,52,ZB+1.8]);
  const neon=(w,h,d,c,p)=>{const o=new R.Mesh(new R.BoxGeometry(w,h,d),B(c));o.position.set(p[0],p[1],p[2]);sc.add(o);return o};
  // nervuras da parede + faixa de luz vertical (dão profundidade e ritmo)
  const rc=[0x4fd8ff,0xff9a2e,0xff4fd8,0xf2e04a];let k=0;
  for(let z=-270;z<=200;z+=70,k++){for(const s of[-1,1]){box(5,RH,10,M('#1c2440',{roughness:.45}),[s*(RW-2.5),RH/2,z]);if(k%2)neon(.8,RH-30,.8,s<0?0x4fd8ff:0xff9a2e,[s*(RW-5.4),RH/2,z]);}
   box(2*RW,5,10,M('#1a2240'),[0,RH-2.5,z]);}
  // faixas de neon contínuas nas paredes + cano grosso
  neon(LEN,.9,.8,0x4fd8ff,[-RW+.6,92,Z0]).rotation.y=Math.PI/2;neon(LEN,.9,.8,0xff9a2e,[RW-.6,92,Z0]).rotation.y=Math.PI/2;
  
  for(const s of[-1,1]){const p=new R.Mesh(new R.CylinderGeometry(2.2,2.2,LEN,14),M(s<0?'#5a2a38':'#26505a',{roughness:.45}));p.rotation.x=Math.PI/2;p.position.set(s*(RW-3),16,Z0);p.castShadow=true;sc.add(p);
   for(let z=-280;z<200;z+=46){const bd=new R.Mesh(new R.CylinderGeometry(3,3,5,14),M('#f2b300'));bd.rotation.x=Math.PI/2;bd.position.set(s*(RW-3),16,z);sc.add(bd)}}
  // piso: faixas de neon, setas, círculos marcados em volta do pedestal
  for(const [x,c] of[[-60,0x4fd8ff],[60,0x4fd8ff],[-90,0xff9a2e],[90,0xff9a2e]])neon(1,.25,LEN,c,[x,.15,Z0]);
  const chev=new R.Shape();chev.moveTo(-18,0);chev.lineTo(0,13);chev.lineTo(18,0);chev.lineTo(18,-5);chev.lineTo(0,8);chev.lineTo(-18,-5);
  for(const z of[-95,-135,-175,-215]){const c=new R.Mesh(new R.ShapeGeometry(chev),new R.MeshBasicMaterial({color:0xffcf5a,transparent:true,opacity:.7}));c.rotation.x=-Math.PI/2;c.position.set(0,.2,z);sc.add(c)}
  for(const [a,b,c] of[[60,62.2,0xff5a3c],[48,49.4,0xff9a2e]]){const rg=new R.Mesh(new R.RingGeometry(a,b,64),new R.MeshBasicMaterial({color:c,transparent:true,opacity:.85}));rg.rotation.x=-Math.PI/2;rg.position.y=.2;sc.add(rg)}
  // caixas e containers (laranja/verde-água) no fundo e nas laterais
  const crate=(x,z,w,h,d,c)=>{box(w,h,d,M(c,{roughness:.55,metalness:.35}),[x,h/2,z]);box(w+.6,1.2,d+.6,M('#10162b'),[x,h*.35,z]);box(w+.6,1.2,d+.6,M('#10162b'),[x,h*.8,z])};
  crate(-95,-270,26,18,20,'#d9792a');crate(-66,-278,16,12,14,'#2aa6a0');crate(88,-268,30,22,22,'#2aa6a0');crate(60,-280,16,14,16,'#d9792a');crate(-100,-190,34,26,28,'#7a2a40');crate(100,-150,30,30,30,'#2a4a8a');
  // fixturas do teto: tubos de luz (autoiluminados) + vigas
  const fix=[[0,-80],[0,-150],[0,-220],[-62,-120],[62,-120],[-62,-190],[62,-190]];
  fix.forEach(f=>{neon(34,1.4,6,0xfff4dc,[f[0],RH-1.6,f[1]]);box(40,1.6,10,M('#10162b'),[f[0],RH-.8,f[1]])});
  // ---------- luzes de verdade ----------
  sc.add(new R.HemisphereLight(0x8fa6ff,0x2a1f40,.3));
  const key=new R.SpotLight(0xfff0dc,2.1,420,.62,.55,1.2);key.position.set(0,RH-3,-80);key.target.position.set(0,6,0);key.castShadow=SH>0;key.shadow.mapSize.set(GX.smap()||512,GX.smap()||512);key.shadow.bias=-.0004;key.shadow.camera.near=20;key.shadow.camera.far=200;sc.add(key,key.target);
  const fill=new R.DirectionalLight(0xffe2c0,.45);fill.position.set(30,70,210);sc.add(fill);        // luz suave da frente (fora de cena) para o rosto
  const cyan=new R.PointLight(0x4fd8ff,1.1,240,1.7);cyan.position.set(-100,86,-60);if(!LEVE)sc.add(cyan);   // vem da faixa de neon ciano
  const orange=new R.PointLight(0xff9a2e,1.1,240,1.7);orange.position.set(100,86,-60);if(!LEVE)sc.add(orange); // vem da faixa laranja
  const sun=new R.PointLight(0xffa660,1.7,380,1.3);sun.position.set(0,46,ZB+30);sc.add(sun);        // luz do pôr do sol da janela (contraluz)
  const pink=new R.PointLight(0xff4fd8,.9,120,1.8);pink.position.set(0,6,12);sc.add(pink);           // brilho do anel do pedestal
  const rackL=new R.SpotLight(0xffe0b0,1.6,200,.7,.6,1.4);rackL.position.set(92,98,-130);rackL.target.position.set(114,64,-150);sc.add(rackL,rackL.target);
  // brilhos (halos) nas lâmpadas e faixas + feixe de luz do spot (volumétrico falso)
  const glow=(c,s,p)=>{const m=new R.Sprite(new R.SpriteMaterial({map:DOT,color:c,blending:R.AdditiveBlending,depthWrite:false,transparent:true,opacity:.9,fog:false}));m.scale.set(s,s,1);m.position.set(p[0],p[1],p[2]);sc.add(m)};
  fix.forEach(f=>glow(0xfff0d0,30,[f[0],RH-4,f[1]]));glow(0xffa660,110,[0,48,ZB+8]);
  {const h=100,cone=new R.Mesh(new R.ConeGeometry(30,h,28,1,true),new R.MeshBasicMaterial({map:BEAM,color:0xfff0d0,transparent:true,opacity:.22,blending:R.AdditiveBlending,depthWrite:false,side:R.DoubleSide,fog:false}));
   const a=new R.Vector3(0,RH-3,-80),b=new R.Vector3(0,3,0),d=b.clone().sub(a).normalize();cone.quaternion.setFromUnitVectors(new R.Vector3(0,-1,0),d);cone.position.copy(a).addScaledVector(d,h/2);sc.add(cone)}
  // ---------- pedestal ----------
  const ped=new R.Group();sc.add(ped);
  const base=new R.Mesh(new R.CylinderGeometry(33,35,4,56),M('#1a2038',{roughness:.3,metalness:.85}));base.position.y=2;base.castShadow=base.receiveShadow=true;ped.add(base);
  const top=new R.Mesh(new R.CylinderGeometry(30,30,.4,56),M('#0e1428',{roughness:.25,metalness:.9}));top.position.y=4.1;top.receiveShadow=true;ped.add(top);
  const ring=(rr,t,c,y)=>{const m=new R.Mesh(new R.TorusGeometry(rr,t,8,72),B(c));m.rotation.x=Math.PI/2;m.position.y=y;ped.add(m)};ring(33.6,.9,0x4fd8ff,4.2);ring(27,.5,0xff6ad0,4.4);
  const gl=new R.Mesh(new R.PlaneGeometry(130,130),new R.MeshBasicMaterial({map:DOT,color:0x4fd8ff,blending:R.AdditiveBlending,depthWrite:false,transparent:true,opacity:.45,fog:false}));gl.rotation.x=-Math.PI/2;gl.position.y=.3;sc.add(gl);
  // ---------- parede de armas (decoração) ----------
  {const g=new R.Group();g.position.set(RW-6,64,-150);g.rotation.y=-Math.PI/2+.5;g.scale.setScalar(1.1);sc.add(g);box(3,80,3,M('#10162b'),[RW-2,40,-176]);
   const pl=new R.Mesh(new R.PlaneGeometry(63,71),new R.MeshStandardMaterial({map:RKT,emissiveMap:RKT,emissive:0xffffff,emissiveIntensity:.75,roughness:.3,metalness:.3}));pl.position.z=1.6;g.add(pl);
   const fr=new R.Mesh(new R.BoxGeometry(67,75,2.4),M('#10162b'));fr.position.z=.2;g.add(fr);
   for(const [w,h,x,y] of[[67,1,0,37.5],[67,1,0,-37.5],[1,75,33.5,0],[1,75,-33.5,0]]){const e=new R.Mesh(new R.BoxGeometry(w,h,1),B(0xff9a2e));e.position.set(x,y,1.7);g.add(e)}
   glow(0xff9a2e,40,[RW-10,64,-152])}
  // ---------- bloco da PATENTE (flutuando; troque por modelo/imagem da patente depois) ----------
  const rank=new R.Mesh(new R.CylinderGeometry(5.5,5.5,3,6),new R.MeshStandardMaterial({color:0xffb42b,emissive:0xff9a1a,emissiveIntensity:.8,roughness:.25,metalness:.7}));rank.rotation.x=Math.PI/2;
  const rg=new R.Group();rg.add(rank);rg.position.set(-30,54,-20);sc.add(rg);glow(0xffb42b,18,[-30,54,-20]);
  // ---------- formas flutuando (profundidade) ----------
  const fls=[];[[-20,86,-190,4,0xff9a2e],[40,88,-230,6,0x8a52ff],[-75,60,-230,6,0x4fd8ff],[70,70,-215,5,0xff9a2e]].forEach(q=>{
   const m=new R.Mesh(q[3]>4.8?new R.OctahedronGeometry(q[3]):new R.CylinderGeometry(q[3],q[3],q[3]*.5,6),new R.MeshStandardMaterial({color:q[4],emissive:q[4],emissiveIntensity:.5,roughness:.3,metalness:.5}));m.position.set(q[0],q[1],q[2]);m.userData.y=q[1];sc.add(m);fls.push(m);glow(q[4],q[3]*3,[q[0],q[1],q[2]])});
  // poeira no ar
  const N=90,pp=new Float32Array(N*3);for(let i=0;i<N;i++){pp[i*3]=(rnd()-.5)*160;pp[i*3+1]=rnd()*95;pp[i*3+2]=-250+rnd()*300}
  const pg=new R.BufferGeometry();pg.setAttribute('position',new R.BufferAttribute(pp,3));const dust=new R.Points(pg,new R.PointsMaterial({map:DOT,size:2.2,color:0xffe2b0,transparent:true,opacity:.7,blending:R.AdditiveBlending,depthWrite:false}));sc.add(dust);
  // ---------- boneco ----------
  const W0=eqs[0];   // arma que o boneco segura (a equipada); só ela é montada
  const m=humanoid([W0]);sc.add(m.g);
  m.g.traverse(o=>{if(o.isMesh)o.castShadow=true});
  const e={x:0,y:0,z:0,hp:200,st:0,fl:0,w:W0};
  CAOS.lobby={sc,cam,r};
  let t0=performance.now(),spin=0,drag=null;
  hero.classList.add('is3d');lbg.classList.add('on3d');lbg.insertBefore(cvs,lbg.firstChild);
  // arrastar o boneco gira ele (como no Free Fire); sem arrastar, balança de leve
  hero.addEventListener('pointerdown',ev=>{drag=ev.clientX;try{hero.setPointerCapture(ev.pointerId)}catch(_){}});
  hero.addEventListener('pointermove',ev=>{if(drag===null)return;spin-=(ev.clientX-drag)*.012;drag=ev.clientX});
  const up=()=>{drag=null};hero.addEventListener('pointerup',up);hero.addEventListener('pointercancel',up);
  let lt=0;(function loop(ts){requestAnimationFrame(loop);
   const iv=(LEVE?Math.max(GX.iv(),1000/45):GX.iv())-2;if(ts-lt<iv)return;lt=ts;
   if(document.hidden)return;
   const t=(performance.now()-t0)/1000;
   m.relax=1;poseN(e,m,.95+spin+(drag===null?Math.sin(t*.5)*.1:0),t);m.g.rotation.x=.05+Math.sin(t*.9)*.015;m.g.position.set(0,4.4+Math.sin(t*1.6)*.15,0);
   cam.position.set(Math.sin(t*.25)*5,24,238);cam.lookAt(0,CY,0);   // câmera balança de leve (paralaxe: perto e longe se mexem diferente)
   fls.forEach((f,i)=>{f.rotation.y=t*(.4+i*.07);f.rotation.x=t*.25;f.position.y=f.userData.y+Math.sin(t*.8+i)*2.5});
   rg.position.y=54+Math.sin(t*1.2)*2.2;rank.rotation.z=t*.7;
   if(!LEVE){const a=dust.geometry.attributes.position;for(let i=0;i<N;i++){let y=a.getY(i)+.02;if(y>95)y=0;a.setY(i,y);a.setX(i,a.getX(i)+Math.sin(t+i)*.01)}a.needsUpdate=true}
   r.render(sc,cam);CAOS.gfxTick&&CAOS.gfxTick()})();
 }).catch(err=>{console.warn('lobby 3D falhou, ficou só o degradê',err)});
})();
