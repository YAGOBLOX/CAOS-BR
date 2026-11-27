/* CAOS BR FPS · render 3D: cena, luzes, chão, paredes, câmera (o visual do MAPA vem de mapas/<id>/mapa.js) */
function init3(){
 const M=G.map;
 const r=RR||(RR=new THREE.WebGLRenderer({canvas:$('#c3'),antialias:!!CAOS.gfx.aa,powerPreference:'high-performance'}));
 const GX=CAOS.gfx;r.setPixelRatio(GX.pr());r.setSize(800,450,false);
 const sc=new THREE.Scene();const SK=M.sky;sc.background=new THREE.Color(SK);sc.fog=new THREE.Fog(SK,M.fogNear,M.fogFar);
 sc.add(new THREE.HemisphereLight(0xcfe8ff,0x4a5a30,.75));
 const dl=new THREE.DirectionalLight(0xfff0d0,.95);dl.position.set(300,700,150);dl.target.position.set(W/2,0,H/2);dl.castShadow=true;dl.shadow.mapSize.set(GX.smap()||512,GX.smap()||512);dl.castShadow=GX.sh>0;const sh=dl.shadow.camera;sh.left=-760;sh.right=760;sh.top=560;sh.bottom=-560;sh.near=100;sh.far=1600;sc.add(dl,dl.target);r.shadowMap.enabled=GX.sh>0;r.shadowMap.type=[0,THREE.PCFShadowMap,THREE.PCFShadowMap,THREE.PCFSoftShadowMap][GX.sh]||THREE.PCFShadowMap;dl.shadow.bias=-.0006;dl.shadow.normalBias=.8;const fl2=new THREE.DirectionalLight(0x9fc4ff,.3);fl2.position.set(-300,200,-300);sc.add(fl2);
 const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
 M.drawFloor(g);CAOS.texLite(c);
 const tx=new THREE.CanvasTexture(c);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(W/160,H/160);tx.anisotropy=4;
 const flr=M.noFloor?null:new THREE.Mesh(new THREE.PlaneGeometry(W,H),new THREE.MeshLambertMaterial({map:tx}));
 if(flr){flr.rotation.x=-Math.PI/2;flr.position.set(W/2,0,H/2);flr.receiveShadow=true;sc.add(flr)}
 const wt=new THREE.Mesh(new THREE.PlaneGeometry(8000,8000),new THREE.MeshLambertMaterial({color:M.waterColor||0x1e78c8}));wt.rotation.x=-Math.PI/2;wt.position.set(W/2,M.waterY!==undefined?M.waterY:-3,H/2);sc.add(wt);
 if(!M.noFloor){const sd=new THREE.Mesh(new THREE.PlaneGeometry(W+160,H+160),new THREE.MeshLambertMaterial({color:0xd8c58f}));sd.rotation.x=-Math.PI/2;sd.position.set(W/2,-1,H/2);sc.add(sd)}
 
 const mt=f=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');f(g);CAOS.texLite(c);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t};
 const BR=mt(g=>{g.fillStyle='#c9bba5';g.fillRect(0,0,128,128);for(let y=0;y<8;y++)for(let x=0;x<5;x++){g.fillStyle=['#a4553a','#96482f','#b0633f','#8e4a33'][(x+y*3)%4];g.fillRect(x*32-(y%2?16:0)+1,y*16+1,30,14)}});
 const CN=mt(g=>{g.fillStyle='#b9b2a0';g.fillRect(0,0,128,128);for(let i=0;i<500;i++){g.fillStyle=i%2?'#a39c8a':'#c8c1b0';g.fillRect(Math.random()*128,Math.random()*128,2,2)}});
 for(const[a,z,w,h]of (M.hideWalls?[]:walls)){
  const bw=a<0||z<0||a>=W||z>=H,hh=bw?M.boundaryHeight:(M.wallHeight||70),bd=bw,tw=(bd?CN:BR).clone();tw.needsUpdate=true;tw.repeat.set(Math.max(w,h)/64,hh/64);const side=new THREE.MeshLambertMaterial({map:tw}),top=new THREE.MeshLambertMaterial({color:bd?0xb5aa90:0x7a7770}),m=new THREE.Mesh(new THREE.BoxGeometry(w,hh,h),[side,side,top,top,side,side]);m.castShadow=m.receiveShadow=true;m.position.set(a+w/2,hh/2,z+h/2);sc.add(m);
  
 }
 M.decorate&&M.decorate(sc);
 const bx=(w,h,d,c)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:c}));
 const kits=G.kits.map(k=>{const o=new THREE.Group();o.add(bx(16,16,16,0xffffff),bx(18,5,18,0x2fcf5a),bx(5,18,18,0x2fcf5a));o.position.set(k.x,14,k.y);sc.add(o);return o});
 T={r,sc,dl,cam:new THREE.PerspectiveCamera(72,800/450,1,3000),bl:[],kits,mp:humanoid(1),
  mbs:CAOS.skins.botShirts.map(c=>humanoid(0,c))};
 T.mbs.forEach(m=>sc.add(m.g));sc.add(T.mp.g);
}
function draw3d(){
 const p=G.p,t=G.t;if(!T)init3();
 poseN(p,T.mp,p.fa===undefined?ang:p.fa,t);
 T.mbs.forEach((m,i)=>{const q=G.bs[i];m.g.visible=!!q&&(q.hp>0||q.rs===undefined||q.rs>2.2);if(q)poseN(q,m,q.a||0,t)});
 T.kits.forEach((o,i)=>{o.visible=G.kits[i].t<=0;o.rotation.y=t*2;o.position.y=14+Math.sin(t*3)*3});
 while(T.bl.length<G.bl.length){const s=new THREE.Mesh(T.bg||(T.bg=new THREE.BoxGeometry(1,1,1)),T.bm||(T.bm=new THREE.MeshBasicMaterial({color:0xffe9a0})));T.sc.add(s);T.bl.push(s)}
 T.bl.forEach((s,i)=>{const q=G.bl[i];s.visible=!!q;if(q){s.position.set(q.x,q.h,q.y);s.scale.set(q.th||1.4,q.th||1.4,q.ln||14);s.lookAt(q.x+q.vx,q.h+q.vh,q.y+q.vy)}});
 T.dl.target.position.set(p.x,0,p.y);T.dl.position.set(p.x-300,700,p.y-250);const R=camRay();T.cam.fov+=((zoom?42:72)-T.cam.fov)*.25;T.cam.updateProjectionMatrix();
 T.cam.position.set(R.o.x,R.o.y,R.o.z);T.cam.lookAt(R.t.x,R.t.y,R.t.z);
 T.r.render(T.sc,T.cam);CAOS.gfxTick&&CAOS.gfxTick();
}
$('#c3').addEventListener('webglcontextlost',e=>e.preventDefault());
$('#c3').addEventListener('webglcontextrestored',()=>{T=null});
