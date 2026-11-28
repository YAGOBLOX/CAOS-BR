/* CAOS BR FPS · LOBBY 3D (v42) — reconstrução do lobby a partir da imagem de referência do dono.
   O lobby antigo (hangar feito no código, com dezenas de luzes, sombras e texturas geradas) foi DESCARTADO por inteiro.

   COMO FUNCIONA (leve e fiel):
   - A câmera 3D é IGUAL à da imagem (ponto de fuga em (832,516) da imagem 1672x941, foco 1100 px; ver U0,V0,F abaixo).
   - O cenário é geometria 3D real em camadas (céu, paisagem, varanda, piso, teto, paredes, pilar da bandeira, pódio, escada,
     presentes, tela, árvores, chapéu de Natal). Cada vértice recebe a textura `img/lobby/fundo.jpg` projetada pela MESMA câmera
     ("projection mapping"): na posição inicial a tela fica idêntica à imagem; ao balançar a câmera, cada camada se mexe na sua
     profundidade (paralaxe). Tudo usa UM material sem luz (MeshBasicMaterial) e uma textura: ~25 objetos, nenhuma sombra no cenário.
   - Só o boneco usa luzes (3) e uma sombra pequena no piso. Efeitos: lâmpadas das guirlandas piscando e neve caindo (2 chamadas).
   - Arrastar em #hero gira o boneco. Se o three.js/WebGL falhar, fica a própria imagem como fundo (CSS de #lbg). */
(function(){
 const hero=document.getElementById('hero'),lbg=document.getElementById('lbg');if(!hero||!lbg)return;
 CAOS.loadChars().then(()=>{
  const GX=CAOS.gfx;if(GX.lb===0)return;   // lobby 3D desligado: fica só a imagem de fundo
  const LEVE=GX.lb===1,W=GX.lobW(),H=Math.round(W*9/16),R=THREE;
  const cvs=document.createElement('canvas');cvs.id='lbg3d';
  const r=new R.WebGLRenderer({canvas:cvs,antialias:!!GX.aa,powerPreference:'high-performance'});r.setPixelRatio(1);r.setSize(W,H,false);
  const SH=LEVE?0:GX.sh;r.shadowMap.enabled=SH>0;r.shadowMap.type=R.PCFShadowMap;
  const sc=new R.Scene();

  // ---------- câmera igual à da imagem (lente deslocada: o horizonte fica em V0, não no meio) ----------
  const IW=1672,IH=941,U0=832,V0=516,F=1100,HE=40,NEAR=10,FAR=3600;   // medidas na imagem; HE = altura do olho (cm do boneco)
  const cam=new R.PerspectiveCamera();cam.near=NEAR;cam.far=FAR;
  cam.projectionMatrix.makePerspective(-U0*NEAR/F,(IW-U0)*NEAR/F,V0*NEAR/F,-(IH-V0)*NEAR/F,NEAR,FAR);
  cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
  cam.position.set(0,HE,0);

  // ---------- textura única + material único (sem luz) ----------
  // A coordenada da textura é calculada POR PIXEL no shader: pega o ponto 3D do pixel e o projeta com a câmera da imagem
  // (u=U0+F*x/d, v=V0-F*(y-HE)/d). Assim piso, teto e laterais (superfícies inclinadas) ficam exatos; calcular só nos vértices distorcia.
  let ready=false;
  const tex=new R.TextureLoader().load('img/lobby/fundo.jpg?v='+CAOS.ver,()=>{ready=true},undefined,()=>{ready=true;MAT.uniforms.ok.value=0});
  tex.generateMipmaps=false;tex.minFilter=tex.magFilter=R.LinearFilter;
  const MAT=new R.ShaderMaterial({side:R.DoubleSide,
   uniforms:{map:{value:tex},ok:{value:1}},
   vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
   fragmentShader:'uniform sampler2D map;uniform float ok;varying vec3 vP;void main(){float d=-vP.z;'+
    'vec2 q=vec2((%U0%+%F%*vP.x/d)/%IW%,1.0-(%V0%-%F%*(vP.y-%HE%)/d)/%IH%);'.replace(/%(\w+)%/g,(_,k)=>({U0,V0,F,HE,IW,IH}[k]).toFixed(1))+
    'gl_FragColor=ok>.5?texture2D(map,q):vec4(.10,.07,.17,1.0);}'});

  // ponto da imagem (u,v) numa profundidade d  →  posição no mundo (a câmera olha para -z)
  const wp=(u,v,d)=>[(u-U0)*d/F,HE+(V0-v)*d/F,-d];
  function mesh(P,I){
   const g=new R.BufferGeometry();g.setAttribute('position',new R.BufferAttribute(new Float32Array(P),3));g.setIndex(I);
   const m=new R.Mesh(g,MAT);m.matrixAutoUpdate=false;m.frustumCulled=false;sc.add(m);return m;
  }
  const quad=(a,b,c,d)=>mesh([...a,...b,...c,...d],[0,1,2,0,2,3]);
  const rect=(u0,v0,u1,v1,d)=>quad(wp(u0,v0,d),wp(u1,v0,d),wp(u1,v1,d),wp(u0,v1,d));
  function box(u0,v0,u1,v1,d,t){   // face da frente numa profundidade d + t de espessura para o fundo
   const f=[wp(u0,v0,d),wp(u1,v0,d),wp(u1,v1,d),wp(u0,v1,d)],b=f.map(p=>[p[0],p[1],p[2]-t]);
   return mesh([...f.flat(),...b.flat()],[0,1,2,0,2,3, 4,6,5,4,7,6, 0,1,5,0,5,4, 3,2,6,3,6,7, 0,3,7,0,7,4, 1,2,6,1,6,5]);
  }
  const fl=(u,v)=>{const d=F*HE/(v-V0);return[(u-U0)*d/F,0,-d]};                  // ponto do piso (y=0)
  const HC=285,ce=(u,v)=>{const d=F*(HC-HE)/(V0-v);return[(u-U0)*d/F,HC,-d]};      // ponto do teto (y=HC)

  // ---------- camadas, de trás para a frente ----------
  rect(-700,-500,2372,1441,2600);                                  // céu, montanhas e luz do entardecer (fundo distante)
  rect(1000,285,1240,505,1500);                                    // penhasco nevado + pinheiros da direita
  rect(405,310,540,495,1250);rect(520,385,605,505,1200);           // pinheiros da esquerda, atrás da varanda
  box(560,486,1178,548,1000,16);                                   // grade/balaústre de pedra da varanda
  quad(fl(-500,555),fl(2170,555),fl(2170,1000),fl(-500,1000));     // PISO de metal brilhante (reflexos, faixas vermelhas, neon, floco de neve)
  quad(ce(-500,-80),ce(2170,-80),ce(2170,216),ce(-500,216));       // TETO com vigas, painéis de luz e guirlandas
  rect(-80,170,395,598,860);rect(1238,100,1760,600,860);          // paredes do fundo, esquerda e direita
  box(40,185,362,505,780,45);                                      // pilar da BANDEIRA (estrela dourada) + cúpula de luzes
  box(88,520,414,598,700,80);                                      // PÓDIO com faixas de neon
  box(366,440,582,572,720,50);                                     // bloco da escada/máquina
  box(8,440,134,532,620,28);box(358,466,456,542,690,25);           // presentes da esquerda
  box(1228,278,1614,536,700,28);                                   // PAINEL/TELA com moldura de neon
  box(1510,215,1660,320,690,22);                                   // chapéu de Papai Noel
  box(1160,405,1230,515,720,15);box(1155,512,1260,575,700,20);     // arvorezinha e presentes do meio-direita
  box(1575,375,1672,590,650,25);box(1555,510,1672,598,620,25);    // árvore grande e presentes da direita

  // ---------- efeitos: lâmpadas piscando e neve ----------
  const dot=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
   g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new R.CanvasTexture(c)})();
  const BU=[1654,48,14,55,1647,61,42,74,879,93,793,96,664,101,65,106,655,101,980,107,749,110,906,106,918,108,1036,108,701,110,1039,113,1116,111,559,114,628,115,789,114,882,114,1534,117,708,119,728,118,733,119,932,118,953,116,111,120,1103,120,603,122,608,121,1559,120,99,122,955,122,1069,125,1080,124,1542,124,588,126,794,129,872,132,858,146,834,154,839,159,1439,158,832,162,272,168,1411,169,263,171,283,178,1364,180,1393,180];   // posições (u,v) das lâmpadas na imagem, detectadas automaticamente
  const BU2=[];for(let i=0;i<BU.length;i+=2)BU2.push([BU[i],BU[i+1]]);
  const NB=BU2.length,bp=new Float32Array(NB*3),bc=new Float32Array(NB*3),ph=new Float32Array(NB);
  BU2.forEach((p,i)=>{const w=wp(p[0],p[1],p[1]<130?640:700);bp.set(w,i*3);ph[i]=(i*2.399)%6.283});
  const bg=new R.BufferGeometry();bg.setAttribute('position',new R.BufferAttribute(bp,3));bg.setAttribute('color',new R.BufferAttribute(bc,3));
  const bm=new R.PointsMaterial({size:W*.0075,sizeAttenuation:false,map:dot,vertexColors:true,transparent:true,blending:R.AdditiveBlending,depthWrite:false});
  const bulbs=new R.Points(bg,bm);bulbs.frustumCulled=false;sc.add(bulbs);

  let snow=null,sp=null,NS=0;
  if(!LEVE){
   NS=110;sp=new Float32Array(NS*3);const sd=new Float32Array(NS*3);   // sd = [profundidade, velocidade, fase]
   for(let i=0;i<NS;i++){const d=90+Math.random()*620;sd[i*3]=d;sd[i*3+1]=9+Math.random()*10;sd[i*3+2]=Math.random()*6.283;
    sp[i*3]=(Math.random()-.5)*1.5*d*.76;sp[i*3+1]=HE-.38*d+Math.random()*.84*d;sp[i*3+2]=-d}
   const sg=new R.BufferGeometry();sg.setAttribute('position',new R.BufferAttribute(sp,3));
   snow=new R.Points(sg,new R.PointsMaterial({size:1.5,sizeAttenuation:true,map:dot,color:0xffffff,transparent:true,opacity:.9,depthWrite:false}));snow.frustumCulled=false;sc.add(snow);snow.userData.sd=sd;
  }

  // ---------- boneco (modelo simples) no centro do piso, sobre o floco de neve ----------
  const CZ=-165,W0=eqs[0];   // distância da câmera e arma equipada (só ela é montada)
  const m=humanoid([W0]);sc.add(m.g);m.g.traverse(o=>{if(o.isMesh)o.castShadow=true});
  const e={x:0,y:0,z:0,hp:200,st:0,fl:0,w:W0};
  // luzes só para o boneco: céu azulado, luz quente das lâmpadas (com sombra), recorte laranja de trás e azul da janela
  sc.add(new R.HemisphereLight(0xb4c2ff,0x8a6a44,.82));
  const key=new R.DirectionalLight(0xffe0b4,.95);key.position.set(-70,130,CZ+95);key.target.position.set(0,28,CZ);sc.add(key,key.target);
  if(SH>0){key.castShadow=true;const s=SH>=3?1024:512;key.shadow.mapSize.set(s,s);const sc2=key.shadow.camera;sc2.left=-60;sc2.right=60;sc2.top=80;sc2.bottom=-40;sc2.near=20;sc2.far=360;key.shadow.bias=-.0015}
  const rim=new R.PointLight(0xff9a3c,.85,380,1);rim.position.set(110,55,CZ-70);sc.add(rim);
  const cool=new R.DirectionalLight(0x7fa4ff,.5);cool.position.set(-60,70,CZ-230);cool.target.position.set(0,28,CZ);sc.add(cool,cool.target);
  // sombra do boneco no piso: sombra de verdade (se ligada) + mancha suave de contato
  const sdw=new R.Mesh(new R.PlaneGeometry(240,240),new R.ShadowMaterial({opacity:.5}));sdw.rotation.x=-Math.PI/2;sdw.position.set(0,.1,CZ);sdw.receiveShadow=true;sdw.visible=SH>0;sc.add(sdw);
  const blobT=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,32);
   g.addColorStop(0,'rgba(0,0,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new R.CanvasTexture(c)})();
  const blob=new R.Mesh(new R.PlaneGeometry(46,26),new R.MeshBasicMaterial({map:blobT,transparent:true,depthWrite:false}));blob.rotation.x=-Math.PI/2;blob.position.set(0,.2,CZ);sc.add(blob);

  CAOS.lobby={sc,cam,r,paused:false};
  let t0=performance.now(),spin=0,drag=null,shown=false;
  hero.classList.add('is3d');lbg.insertBefore(cvs,lbg.firstChild);
  // arrastar o boneco gira ele; sem arrastar, balança de leve
  hero.addEventListener('pointerdown',ev=>{drag=ev.clientX;try{hero.setPointerCapture(ev.pointerId)}catch(_){}});
  hero.addEventListener('pointermove',ev=>{if(drag===null)return;spin-=(ev.clientX-drag)*.012;drag=ev.clientX});
  const up=()=>{drag=null};hero.addEventListener('pointerup',up);hero.addEventListener('pointercancel',up);
  let lt=0;(function loop(ts){requestAnimationFrame(loop);
   const iv=(LEVE?Math.max(GX.iv(),1000/45):GX.iv())-2;if(ts-lt<iv)return;
   const dt=Math.min(.1,(ts-lt)/1000);lt=ts;
   if(document.hidden||CAOS.lobby.paused||!ready)return;
   const t=(performance.now()-t0)/1000;
   m.relax=1;poseN(e,m,.95+spin+(drag===null?Math.sin(t*.5)*.1:0),t);m.g.position.set(0,0,CZ);
   cam.position.set(Math.sin(t*.25)*1.4,HE+Math.sin(t*.2)*.4,0);   // balanço leve da câmera: as camadas se mexem em profundidades diferentes (paralaxe)
   for(let i=0;i<NB;i++){const k=.4+.6*(.5+.5*Math.sin(t*2.3+ph[i]*3+Math.sin(t*.7+ph[i])));bc[i*3]=k;bc[i*3+1]=k*.82;bc[i*3+2]=k*.45}
   bg.attributes.color.needsUpdate=true;
   if(snow){const sd=snow.userData.sd;for(let i=0;i<NS;i++){const d=sd[i*3];let y=sp[i*3+1]-sd[i*3+1]*dt;if(y<HE-.38*d)y=HE+.46*d;sp[i*3+1]=y;sp[i*3]+=Math.sin(t*.8+sd[i*3+2])*dt*3}
    snow.geometry.attributes.position.needsUpdate=true}
   r.render(sc,cam);
   if(!shown){shown=true;lbg.classList.add('on3d')}   // a imagem de fundo (CSS) dá lugar à cena 3D sem "pulo": as duas são iguais
   CAOS.gfxTick&&CAOS.gfxTick()})();
 }).catch(err=>{console.warn('lobby 3D falhou, ficou só a imagem de fundo',err)});
})();
