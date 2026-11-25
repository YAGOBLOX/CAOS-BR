/* CAOS BR FPS · boneco 3D do lobby (carrega three.js em segundo plano; se falhar, fica o desenho 2D) */
(function(){
 const hero=document.getElementById('hero');if(!hero)return;
 CAOS.loadChars().then(()=>{
  const cv=document.createElement('canvas');cv.id='hero3d';cv.width=660;cv.height=600;hero.appendChild(cv);
  const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});r.setSize(660,600,false);
  const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xffffff,0x6a6a80,.95));const dl=new THREE.DirectionalLight(0xfff0d8,.8);dl.position.set(60,120,160);sc.add(dl);
  const cam=new THREE.PerspectiveCamera(26,660/600,1,600);cam.position.set(0,24,156);cam.lookAt(0,31,0);
  let m=humanoid(1);sc.add(m.g);window.heroRefresh=()=>{sc.remove(m.g);m=humanoid(1);sc.add(m.g)};   // heroRefresh: troca o boneco quando a skin muda
  const e={x:0,y:0,z:0,hp:200,st:0,fl:0,w:1};m.g.position.y=-2;
  let t0=performance.now(),run=true,spin=0,drag=null;
  // arrastar o boneco gira ele (como no Free Fire); sem arrastar, balança de leve
  cv.addEventListener('pointerdown',ev=>{drag=ev.clientX;try{cv.setPointerCapture(ev.pointerId)}catch(e){}});
  cv.addEventListener('pointermove',ev=>{if(drag===null)return;spin-=(ev.clientX-drag)*.012;drag=ev.clientX});
  const up=()=>{drag=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  hero.classList.add('is3d');
  (function loop(){requestAnimationFrame(loop);
   const g=document.getElementById('game');if(g&&g.style.display==='block')return;
   const t=(performance.now()-t0)/1000;e.w=(typeof eqs!=='undefined'&&eqs.length)?eqs[0]:1;
   m.relax=1;poseN(e,m,.95+spin+(drag===null?Math.sin(t*.5)*.1:0),t);m.g.rotation.x=.05+Math.sin(t*.9)*.015;   // 3/4, pose relaxada (arma baixa) e leve inclinação
   if(!m.xb&&!m.mc){m.ts.rotation.z=-.03+Math.sin(t*1.6)*.02;m.g.scale.setScalar(.8)}m.g.position.set(0,-2+Math.sin(t*1.6)*.3,0);
   r.render(sc,cam)})();
 }).catch(()=>{});
})();
