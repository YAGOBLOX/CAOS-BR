/* CAOS BR FPS · lobby: perfil, botões e início do jogo.
   TELA DE CARREGAMENTO: quem a aciona é o botão verde JOGAR do SITE (ele cria o iframe deste jogo). Ao abrir, este arquivo chama
   CAOS.iniciarJogo() (partida.js): a animação aparece, acompanha o carregamento real e só some quando o jogo está pronto.
   O botão amarelo DECOLAR (dentro do jogo) NÃO dispara carregamento: por enquanto só avisa que as partidas ainda não existem. */
try{const n=localStorage.getItem('nick');if(n)$('#nick').textContent=n}catch(e){}
try{if(typeof coins==='number')$('#coins').textContent=coins}catch(e){}
const soon=nome=>open('<h2>'+nome+'</h2>Em breve. Este botão já está no lobby, mas a função dele chega numa próxima etapa.');
document.querySelectorAll('#ui [data-p]').forEach(b=>b.addEventListener('click',()=>b.dataset.p==='Configurações'?CAOS.abrirConfig():soon(b.dataset.p)));
$('#go').onclick=()=>open('<h2>EM BREVE</h2>As partidas ainda estão em desenvolvimento; os mapas entram numa próxima etapa.');
// selo vermelho do botão de cartas: escondido por padrão. Quando existir sistema de mensagens, chame CAOS.avisoCartas(qtd) (0 = esconde).
CAOS.avisoCartas=n=>{const b=$('#bdgMail');n=+n||0;b.hidden=n<=0;b.textContent=n>9?'9+':n>0?n:''};
CAOS.musica.iniciar();   // a música do lobby já começa quando o jogo abre (volume e faixa em CONFIGURAÇÕES)
CAOS.iniciarJogo();
