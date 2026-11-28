/* CAOS BR FPS · lobby: perfil e botão DECOLAR.
   DECOLAR abre a tela de carregamento (transicao.js) que acompanha as tarefas de partida.js. Sem mapas ainda, ao terminar ela mostra
   o aviso EM BREVE; quando a partida existir, é aqui (no callback) que ela começa. */
try{const n=localStorage.getItem('nick');if(n)$('#nick').textContent=n}catch(e){}
let busy=false;
$('#go').onclick=()=>{
 if(busy)return;busy=true;
 CAOS.entrarNaPartida(()=>{busy=false;open('<h2>EM BREVE</h2>As partidas ainda estão em desenvolvimento. O lobby novo já está pronto; os mapas entram numa próxima etapa.')});
};
