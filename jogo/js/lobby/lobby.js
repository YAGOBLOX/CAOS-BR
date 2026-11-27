/* CAOS BR FPS · lobby: perfil e botão DECOLAR.
   Loja, skins, novidades, configurações, escolha de modo/mapa e bots foram removidos na limpeza (v41).
   Sem mapas ainda, DECOLAR só mostra um aviso; a partida volta quando os mapas forem feitos. */
try{const n=localStorage.getItem('nick');if(n)$('#nick').textContent=n}catch(e){}
$('#go').onclick=()=>open('<h2>EM BREVE</h2>As partidas ainda estão em desenvolvimento. Primeiro vamos reformular o lobby; os mapas entram numa próxima etapa.');
