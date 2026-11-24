/* CAOS BR FPS · janelas (cards) por cima da tela: open(html) */
const ov=$('#ov'),card=$('#card');
function open(html){
 card.innerHTML='<div class="cxb"><button class="btn" id="xx" aria-label="Fechar">✕</button></div>'+html+'<button class="btn" id="x">FECHAR</button>';
 ov.classList.add('on');$('#x').onclick=()=>ov.classList.remove('on');
 $('#xx').onclick=()=>$('#x').click();   // ✕ do topo = mesmo que FECHAR (sempre visível, mesmo com a lista rolando)
}
ov.addEventListener('pointerdown',e=>{if(e.target===ov&&$('#x'))$('#x').click()});   // tocar fora da janela fecha
addEventListener('keydown',e=>{if(e.key==='Escape'&&ov.classList.contains('on')&&$('#x'))$('#x').click()});
