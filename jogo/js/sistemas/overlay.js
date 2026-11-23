/* CAOS BR FPS · janelas (cards) por cima da tela: open(html) */
const ov=$('#ov'),card=$('#card');
function open(html){card.innerHTML=html+'<button class="btn" id="x">FECHAR</button>';ov.classList.add('on');$('#x').onclick=()=>ov.classList.remove('on')}
