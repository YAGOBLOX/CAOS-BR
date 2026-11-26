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
function openCfg(){openPanel('ctl')}   // painel em painel-config.js
$('#gear').onclick=openCfg;applyCfg();
