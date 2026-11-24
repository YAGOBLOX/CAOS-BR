/* CAOS BR FPS · boneco 3D do lobby (carrega three.js em segundo plano; se falhar, fica o desenho 2D) */
(function(){
 const hero=document.getElementById('hero');if(!hero)return;
 CAOS.loadChars().then(()=>{
  const cv=document.createElement('canvas');cv.id='hero3d';cv.width=660;cv.height=600;hero.appendChild(cv);
  const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});r.setSize(660,600,false);
  const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xffffff,0x6a6a80,.95));const dl=new THREE.DirectionalLight(0xfff0d8,.8);dl.position.set(60,120,160);sc.add(dl);
  const cam=new THREE.PerspectiveCamera(26,660/600,1,600);cam.position.set(0,34,150);cam.lookAt(0,30,0);
  const m=humanoid(1);sc.add(m.g);const e={x:0,y:0,z:0,hp:200,st:0,fl:0,w:1};m.g.position.y=-2;
  let t0=performance.now(),run=true;
  hero.classList.add('is3d');
  (function loop(){requestAnimationFrame(loop);
   const g=document.getElementById('game');if(g&&g.style.display==='block')return;
   const t=(performance.now()-t0)/1000;e.w=(typeof eqs!=='undefined'&&eqs.length)?eqs[0]:1;
   poseN(e,m,1.57-.45+Math.sin(t*.6)*.3,t);m.ts.rotation.z=-.03+Math.sin(t*1.6)*.02;m.g.scale.setScalar(.8);m.g.position.set(0,-2+Math.sin(t*1.6)*.3,0);
   r.render(sc,cam)})();
 }).catch(()=>{});
})();
