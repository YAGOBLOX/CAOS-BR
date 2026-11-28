/* CAOS BR FPS · ENTRAR NA PARTIDA (v44): lista de TAREFAS de carregamento que a tela de carregamento (transicao.js) acompanha.
   Tarefa = {nome, peso, run:()=>Promise, liberar?:()=>void, p?:0..1}. A tela só termina quando TODAS terminam (falha conta como terminada,
   para não travar). Uma tarefa pode ir atualizando `p` (0..1) para a barra andar suave dentro dela. `nome` aparece na barra.

   PREPARADO PARA MAPAS (ainda NÃO implementado, de propósito): só o mapa ESCOLHIDO deve carregar.
   - `CAOS.partida.extra()` devolve as tarefas do mapa/modo selecionado (hoje: nenhuma). O sistema de mapas vai trocar essa função
     para devolver, por exemplo, [{nome:'mapa: ilha',peso:6,run:()=>...,liberar:()=>...}] só do mapa atual.
   - Cada tarefa pode ter `liberar()` (apagar geometrias/texturas/GLB daquele mapa). `CAOS.partida.descarregar()` chama o `liberar` das
     tarefas da última partida; chame ao trocar de mapa. Escolher o mapa de novo roda a tarefa outra vez (carrega de novo). */
CAOS.partida={
 // tarefas fixas (sempre necessárias)
 tarefas:[
  {nome:'motor 3D e boneco',peso:3,run:()=>CAOS.loadChars()},
  {nome:'arma equipada',peso:2,run:()=>CAOS.loadChars().then(()=>{const w=WP[eqs[0]];return CAOS.gunGlb&&w&&w.m?CAOS.gunGlb(w.m):null})}
 ],
 extra:()=>[],        // tarefas do mapa/modo escolhido (futuro)
 ativas:[],           // tarefas da última partida (para descarregar)
 descarregar(){for(const t of this.ativas){try{t.liberar&&t.liberar()}catch(e){console.warn('descarregar',t.nome,e)}}this.ativas=[]}
};
CAOS.entrarNaPartida=function(fim){
 const P=CAOS.partida,T=P.tarefas.concat(P.extra()),tot=T.reduce((a,t)=>a+t.peso,0)||1;let n=0;P.ativas=T;
 T.forEach(t=>{t.ok=0;t.p=t.p||0;let p;try{p=Promise.resolve(t.run())}catch(e){p=Promise.reject(e)}
  const fecha=()=>{if(!t.ok){t.ok=1;n++}};
  p.then(fecha,e=>{console.warn('carregamento: falhou',t.nome,e);fecha()})});
 return CAOS.transicao({
  progresso:()=>T.reduce((a,t)=>a+t.peso*(t.ok?1:Math.min(.95,t.p||0)),0)/tot,
  pronto:()=>n>=T.length,
  texto:()=>{const t=T.find(t=>!t.ok);return t?t.nome:''},
  fim:fim,minimo:3.8,maximo:25});
};
