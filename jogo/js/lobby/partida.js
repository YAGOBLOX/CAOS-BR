/* CAOS BR FPS · ENTRAR NA PARTIDA (v43): lista de TAREFAS de carregamento que a tela de transição (transicao.js) acompanha.
   Cada tarefa = {nome, peso, run:()=>Promise}. A transição só termina quando TODAS terminam (falha conta como terminada, para não travar).
   Hoje: o motor 3D + boneco e o modelo da arma equipada. Quando existirem mapas/modos, registre aqui o que eles precisam
   (ex.: CAOS.partida.tarefas.push({nome:'mapa',peso:5,run:()=>CAOS.load(...)})) e troque o callback de lobby.js pela partida de verdade. */
CAOS.partida={
 tarefas:[
  {nome:'motor 3D e boneco',peso:3,run:()=>CAOS.loadChars()},
  {nome:'arma equipada',peso:2,run:()=>CAOS.loadChars().then(()=>{const w=WP[eqs[0]];return CAOS.gunGlb&&w&&w.m?CAOS.gunGlb(w.m):null})}
 ]
};
CAOS.entrarNaPartida=function(fim){
 const T=CAOS.partida.tarefas,tot=T.reduce((a,t)=>a+t.peso,0)||1;let feito=0,n=0;
 const fecha=t=>{if(t.ok)return;t.ok=1;feito+=t.peso;n++};
 T.forEach(t=>{t.ok=0;let p;try{p=Promise.resolve(t.run())}catch(e){p=Promise.reject(e)}
  p.then(()=>fecha(t),e=>{console.warn('carregamento: falhou',t.nome,e);fecha(t)})});
 return CAOS.transicao({progresso:()=>feito/tot,pronto:()=>n>=T.length,fim:fim,minimo:3.2,maximo:25});
};
