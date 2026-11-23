/* CAOS BR FPS · configurações do jogador (sensibilidade, HUD, mira assistida) */
// ===== CONFIG =====
const DEF={sens:1,vs:.8,inv:0,asst:.6,zs:.6,hudAlpha:1,mini:1,fS:84,fR:34,fB:30};
const S=Object.assign({},DEF);
try{Object.assign(S,JSON.parse(localStorage.getItem('cfg')||'{}'))}catch(e){}
let afr=1,zoom=false;
const sn=()=>S.sens*(zoom?S.zs:1)*afr;
function saveCfg(){try{localStorage.setItem('cfg',JSON.stringify(S))}catch(e){}}
function applyCfg(){
 const f=$('#fbtn').style;f.width=f.height=S.fS+'px';f.right=S.fR+'px';f.bottom=S.fB+'px';f.fontSize=(S.fS*.38)+'px';
 const r=$('#rld').style;r.right=(S.fR+S.fS+12)+'px';r.bottom=(S.fB+S.fS/2-26)+'px';
 const mb=S.fB+S.fS+8;setTimeout(()=>{if(typeof applyLay==='function')applyLay()},0);[['#jmp',0],['#cro',62],['#prn',124],['#aimb',186]].forEach(([q,o])=>{const y=$(q).style;y.right=(S.fR+o)+'px';y.bottom=mb+'px'});
}
function openCfg(){
 const R=(l,k,a,b,st)=>`<div class="cr"><span>${l}</span><input type="range" data-k="${k}" min="${a}" max="${b}" step="${st}" value="${S[k]}"><b>${S[k]}</b></div>`;
 const O=(l,k,o)=>`<div class="cr"><span>${l}</span><select data-k="${k}">${o.map(([v,n])=>`<option value="${v}"${String(S[k])===String(v)?' selected':''}>${n}</option>`).join('')}</select></div>`;
 open('<h2>CONFIGURAÇÕES</h2><div class="cr"><span>Nome</span><input type="text" id="nm" maxlength="12" value="'+$('#nick').textContent+'"></div><div class="cs">SENSIBILIDADE</div>'+
  R('Câmera','sens',.3,2.5,.05)+R('Câmera com zoom (x Câmera)','zs',.2,1.5,.05)+R('Vertical (cima/baixo)','vs',.2,2.5,.05)+O('Inversor vertical','inv',[[0,'Normal'],[1,'Invertido']])+R('Grudar na mira','asst',0,1,.05)+
  '<div class="cs">HUD</div>'+R('Opacidade do HUD','hudAlpha',.2,1,.05)+O('Minimapa','mini',[[1,'Ligado'],[0,'Desligado']])+R('Botão atirar: tamanho','fS',56,130,2)+R('Botão atirar: dist. da direita','fR',8,300,2)+R('Botão atirar: dist. de baixo','fB',8,200,2)+
  '<button class="btn" id="eh">EDITAR POSIÇÃO DOS BOTÕES</button><button class="btn" id="rs">RESTAURAR PADRÃO</button>');
 card.querySelectorAll('[data-k]').forEach(el=>el.oninput=el.onchange=()=>{
  const v=isNaN(+el.value)?el.value:+el.value;S[el.dataset.k]=v;
  if(el.type==='range')el.nextElementSibling.textContent=v;
  saveCfg();applyCfg();
 });
 $('#nm').oninput=()=>{const v=$('#nm').value.trim().toUpperCase()||'PLAYER_01';$('#nick').textContent=v;try{localStorage.setItem('nick',v)}catch(e){}};
 $('#rs').onclick=()=>{Object.assign(S,DEF);saveCfg();resetLay();openCfg()};
 $('#eh').onclick=()=>{if(!G){$('#eh').textContent='ENTRE NUMA PARTIDA PRIMEIRO';return}ov.classList.remove('on');setEdit(true)};
}
$('#gear').onclick=openCfg;applyCfg();
