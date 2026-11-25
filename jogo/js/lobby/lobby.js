/* CAOS BR FPS · lobby: perfil, amigos, menus, seleção de modo/mapa e botão DECOLAR */
try{const n=localStorage.getItem('nick');if(n)$('#nick').textContent=n}catch(e){}
// ===== seleção de modo e mapa (dados vêm do manifesto; nada de mapa/modo é carregado aqui) =====
const MF=CAOS.manifest,modeIds=Object.keys(MF.modes);
CAOS.sel.mode=modeIds[0];CAOS.sel.map=MF.modes[modeIds[0]].maps[0];
function refreshSel(){
 const mo=MF.modes[CAOS.sel.mode];
 $('#modeName').textContent=mo.name;$('#mapName').textContent=MF.maps[CAOS.sel.map].name;
 $('#mapHint').style.visibility=mo.maps.length>1?'visible':'hidden';
}
$('#mode').onclick=()=>{
 CAOS.sel.mode=modeIds[(modeIds.indexOf(CAOS.sel.mode)+1)%modeIds.length];
 CAOS.sel.map=MF.modes[CAOS.sel.mode].maps[0];refreshSel();
};
// escolha de mapa (estilo Free Fire): cartões com imagem e nome dos mapas do modo escolhido
function openMaps(){
 const ml=MF.modes[CAOS.sel.mode].maps;
 open('<h2>ESCOLHER MAPA</h2><div class="mapgrid">'+ml.map(id=>{const m=MF.maps[id];return '<button class="mp'+(id===CAOS.sel.map?' on':'')+'" data-m="'+id+'"><img src="'+m.img+'" alt=""><b>'+m.name+(id===CAOS.sel.map?' ✓':'')+'</b></button>'}).join('')+'</div>');
 card.querySelectorAll('.mp').forEach(b=>b.onclick=()=>{CAOS.sel.map=b.dataset.m;refreshSel();ov.classList.remove('on')});
}
$('#mapSel').onclick=openMaps;
refreshSel();
document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{
 const p=b.dataset.p;
 if(p==='Config')openCfg();else if(p==='Loja')openShop();else if(p==='Skins')openSkins();else if(p==='Novidades')open('<h2>NOVIDADES</h2>• Mapa expandido (1800 x 1200)<br>• 12 armas novas na LOJA: AK-47, M4A1, MP5, AWM, RPG-7 e mais<br>• Compre e equipe armas na LOJA; na partida: arma + punho (toque na arma para recarregar)<br>• HUD editável nas configurações<br>• 200 de vida para todos');else open('<h2>'+p.toUpperCase()+'</h2>Em breve! Aqui vai a tela de '+p+'.');
});
let iv;
$('#go').onclick=()=>{
 const mo=MF.modes[CAOS.sel.mode],ma=MF.maps[CAOS.sel.map];
 open('<h2>PROCURANDO PARTIDA…</h2>Modo: '+mo.name+' · Mapa: '+ma.name+'<div class="bar"><i id="pb"></i></div>');
 let p=0,ready=false;clearInterval(iv);
 CAOS.load(CAOS.sel.mode,CAOS.sel.map).then(()=>{ready=true}).catch(err=>{clearInterval(iv);open('<h2>ERRO AO CARREGAR</h2>'+err.message)});
 iv=setInterval(()=>{
  if(p<92||ready)p+=8;$('#pb').style.width=Math.min(p,100)+'%';
  if(p>=100){clearInterval(iv);ov.classList.remove('on');startGame()}
 },120);
 $('#x').onclick=()=>{clearInterval(iv);ov.classList.remove('on')};
};
