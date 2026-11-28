/* CAOS BR FPS · INICIAR O JOGO (v45): lista de TAREFAS de carregamento que a tela de carregamento (transicao.js) acompanha.
   QUEM ACIONA: o botão verde JOGAR do site cria o iframe deste jogo; ao abrir, lobby.js chama CAOS.iniciarJogo() e a animação cobre a
   tela até tudo estar pronto (fonte, imagens do lobby, three.js + boneco, arma equipada e a 1ª imagem da cena 3D do lobby).
   Tarefa = {nome, peso, run:()=>Promise, liberar?:()=>void, p?:0..1}. A tela só termina quando TODAS terminam (falha conta como terminada,
   para não travar). Uma tarefa pode ir atualizando `p` (0..1) para a barra andar suave dentro dela. `nome` aparece na barra.

   PREPARADO PARA MAPAS (ainda NÃO implementado, de propósito): só o mapa ESCOLHIDO deve carregar.
   - `CAOS.partida.extra()` devolve as tarefas do mapa/modo selecionado (hoje: nenhuma). O sistema de mapas vai trocar essa função
     para devolver, por exemplo, [{nome:'mapa: ilha',peso:6,run:()=>...,liberar:()=>...}] só do mapa atual.
   - Cada tarefa pode ter `liberar()` (apagar geometrias/texturas/GLB daquele mapa). `CAOS.partida.descarregar()` chama o `liberar` das
     tarefas da última partida; chame ao trocar de mapa. Escolher o mapa de novo roda a tarefa outra vez (carrega de novo). */
// heroi3d.js chama CAOS.lobbyOk() quando a 1ª imagem da cena 3D do lobby foi desenhada (ou quando o 3D falhou: aí fica só a imagem de fundo)
CAOS.lobbyPronto=new Promise(r=>{CAOS.lobbyOk=r});
const imgsUI=()=>{const L=['img/lobby/fundo.jpg'];document.querySelectorAll('#ui img').forEach(i=>L.push(i.getAttribute('src')));return L};
CAOS.partida={
 // tarefas fixas (sempre necessárias)
 tarefas:[
  {nome:'fonte',peso:1,run:()=>Promise.race([document.fonts?document.fonts.ready:null,new Promise(r=>setTimeout(r,4000))])},
  {nome:'imagens do lobby',peso:2,run(){const L=imgsUI();let n=0;return Promise.all(L.map(u=>new Promise(r=>{const i=new Image(),ok=()=>{this.p=++n/L.length;r()};i.onload=i.onerror=ok;i.src=u+(u.indexOf('?')<0?'?v='+CAOS.ver:'')})))}},
  {nome:'motor 3D e boneco',peso:3,run:()=>CAOS.loadChars()},
  {nome:'arma equipada',peso:2,run:()=>CAOS.loadChars().then(()=>{const w=WP[eqs[0]];return CAOS.gunGlb&&w&&w.m?CAOS.gunGlb(w.m):null})},
  {nome:'cena do lobby',peso:2,run:()=>CAOS.lobbyPronto}
 ],
 extra:()=>[],        // tarefas do mapa/modo escolhido (futuro)
 ativas:[],           // tarefas da última partida (para descarregar)
 descarregar(){for(const t of this.ativas){try{t.liberar&&t.liberar()}catch(e){console.warn('descarregar',t.nome,e)}}this.ativas=[]}
};
CAOS.iniciarJogo=function(fim){
 const P=CAOS.partida,T=P.tarefas.concat(P.extra()),tot=T.reduce((a,t)=>a+t.peso,0)||1;let n=0;P.ativas=T;
 T.forEach(t=>{t.ok=0;t.p=t.p||0;let p;try{p=Promise.resolve(t.run())}catch(e){p=Promise.reject(e)}
  const fecha=()=>{if(!t.ok){t.ok=1;n++}};
  p.then(fecha,e=>{console.warn('carregamento: falhou',t.nome,e);fecha()})});
 return CAOS.transicao({
  progresso:()=>T.reduce((a,t)=>a+t.peso*(t.ok?1:Math.min(.95,t.p||0)),0)/tot,
  pronto:()=>n>=T.length,
  texto:()=>{const t=T.find(t=>!t.ok);return t?t.nome:''},
  fim:fim,minimo:4.2,maximo:25,abertura:false,pausar:false});
};
