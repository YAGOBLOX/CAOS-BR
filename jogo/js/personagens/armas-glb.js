/* CAOS BR FPS · modelos 3D das armas em GLB (pasta modelos/armas/<id>.glb). Carrega SOB DEMANDA (só quando a arma aparece na mão).
   O jogo usa: +x = cano, +y = cima, origem = mão. Cada GLB é girado/escalado/centralizado para ocupar a mesma caixa do modelo que ele substituiu (tabela abaixo).
   b = [xmin,xmax,ymin,ymax] da caixa em unidades do jogo · ry = giro em Y (rad) que leva a FRENTE do GLB para +x · cut = peças a ignorar (nome contém) */
const GUNGLB={gs:1.3, /* escala geral das armas GLB (proporção com o boneco) */

 m4a1:{b:[-6.6,23.4,-5.7,3.5],ry:1.5708,cut:['556x45']}   /* cut: bala solta que veio no modelo */,
 scar:{b:[-6.6,23.4,-5.2,3.2],ry:1.5708},
 ak47:{b:[-6.2,21.9,-5.0,3.0],ry:1.5708},
 remington870:{b:[-7.8,20.1,-4.2,2.5],ry:1.5708},
 mp5:{b:[-5.5,16.5,-6.5,4.0],ry:1.5708},
 m1911:{b:[-1.7,12.3,-5.3,3.3],ry:1.5708}
};
(function(){
 const cache={};
 // converte o material para Lambert (leve) mantendo a textura; textura sem conversão de cor (igual ao resto do jogo)
 const lite=o=>{if(!o.isMesh)return;const m=o.material,a=Array.isArray(m)?m:[m],n=a.map(x=>{if(x.map)x.map.encoding=THREE.LinearEncoding;return new THREE.MeshLambertMaterial({map:x.map||null,color:x.color,side:x.side,transparent:x.transparent,opacity:x.opacity,alphaTest:x.alphaTest||0})});o.material=Array.isArray(m)?n:n[0];o.castShadow=true;o.frustumCulled=false};
 function prep(scene,id){
  const S=GUNGLB[id],rm=[];scene.traverse(o=>{if(o.isMesh&&S.cut&&S.cut.some(c=>o.name.indexOf(c)>=0))rm.push(o)});rm.forEach(o=>o.parent.remove(o));
  scene.updateMatrixWorld(true);scene.traverse(lite);
  const root=new THREE.Group();root.add(scene);root.rotation.y=S.ry||0;root.updateMatrixWorld(true);
  const b=new THREE.Box3().setFromObject(root),sz=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());
  const k=(S.b[1]-S.b[0])/sz.x,ho=new THREE.Group();ho.add(root);root.scale.setScalar(k);
  root.position.set((S.b[0]+S.b[1])/2-c.x*k,(S.b[2]+S.b[3])/2-c.y*k,-c.z*k);
  ho.scale.setScalar(GUNGLB.gs);return ho;
 }
 // devolve uma Promise do modelo pronto (ou null se falhar). Cada chamada usa uma cópia leve (geometria/material compartilhados)
 CAOS.gunGlb=id=>{
  if(!GUNGLB[id])return Promise.resolve(null);
  return (cache[id]||(cache[id]=new Promise(ok=>{
   const t=setTimeout(()=>ok(null),30000);
   try{new THREE.GLTFLoader().load('modelos/armas/'+id+'.glb?v='+CAOS.ver,g=>{clearTimeout(t);try{ok(prep(g.scene,id))}catch(e){console.warn('[arma '+id+']',e);ok(null)}},undefined,()=>{clearTimeout(t);ok(null)})}catch(e){clearTimeout(t);ok(null)}
  }))).then(h=>{if(!h)delete cache[id];return h&&h.clone(true)});
 };
})();
