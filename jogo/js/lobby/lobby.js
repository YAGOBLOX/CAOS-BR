/* CAOS BR FPS · lobby: perfil, botões e início do jogo.
   TELA DE CARREGAMENTO: quem a aciona é o botão verde JOGAR do SITE (ele cria o iframe deste jogo). Ao abrir, este arquivo chama
   CAOS.iniciarJogo() (partida.js): a animação aparece, acompanha o carregamento real e só some quando o jogo está pronto.
   O botão amarelo DECOLAR (dentro do jogo) NÃO dispara carregamento: por enquanto só avisa que as partidas ainda não existem. */
try{const n=localStorage.getItem('nick');if(n)$('#nick').textContent=n}catch(e){}
try{if(typeof coins==='number')$('#coins').textContent=coins}catch(e){}
const soon=nome=>open('<h2>'+nome+'</h2>Em breve. Este botão já está no lobby, mas a função dele chega numa próxima etapa.');
document.querySelectorAll('#ui [data-p]').forEach(b=>b.addEventListener('click',()=>soon(b.dataset.p)));
$('#go').onclick=()=>open('<h2>EM BREVE</h2>As partidas ainda estão em desenvolvimento; os mapas entram numa próxima etapa.');
CAOS.iniciarJogo();
