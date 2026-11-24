/* CAOS BR FPS · configurações do jogador (sensibilidade, HUD, mira assistida) */
// ===== CONFIG =====
const DEF={sens:1,vs:.8,inv:0,asst:.6,zs:.6,hudAlpha:1,mini:1,fS:92,fR:44,fB:40,cfgv:2};
const S=Object.assign({},DEF);
try{Object.assign(S,JSON.parse(localStorage.getItem('cfg')||'{}'))}catch(e){}
if(S.cfgv!==2){S.fS=DEF.fS;S.fR=DEF.fR;S.fB=DEF.fB;S.cfgv=2;try{localStorage.setItem('cfg',JSON.stringify(S))}catch(e){}}   // novo layout: reaplica o padrão uma vez
let afr=1,zoom=false;
const sn=()=>S.sens*(zoom?S.zs:1)*afr;
function saveCfg(){try{localStorage.setItem('cfg',JSON.stringify(S))}catch(e){}}
function applyCfg(){
 // ATIRAR no canto direito; os outros botões em ARCO ao redor dele (estilo Free Fire). Tudo longe do centro, onde fica o boneco.
 const fS=S.fS,fcx=800-S.fR-fS/2,fcy=450-S.fB-fS/2;
 const f=$('#fbtn').style;f.width=f.height=fS+'px';f.right=S.fR+'px';f.bottom=S.fB+'px';
 const at=(q,sz,deg,d)=>{const a=deg*Math.PI/180,x=fcx+Math.cos(a)*d,y=fcy-Math.sin(a)*d,st=$(q).style;st.right=(800-x-sz/2)+'px';st.bottom=(450-y-sz/2)+'px'};
 const d=fS/2+60;
 at('#jmp',52,80,d);at('#cro',52,115,d);at('#prn',52,150,d);at('#aimb',52,185,d);at('#rld',50,100,fS/2+120);
 setTimeout(()=>{if(typeof applyLay==='function')applyLay()},0);
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
