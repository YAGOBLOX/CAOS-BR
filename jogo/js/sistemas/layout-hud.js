/* CAOS BR FPS · editor de posição dos botões do HUD (salvo no aparelho) */
let lay={};try{lay=JSON.parse(localStorage.getItem('lay')||'{}')}catch(e){}
const saveLay=()=>{try{localStorage.setItem('lay',JSON.stringify(lay))}catch(e){}};
let editMode=false,drag=null;
const HUD=['fbtn','rld','jmp','cro','prn','aimb','slots','gear','shopb','smile','quit'];
HUD.forEach(i=>$('#'+i).classList.add('hd'));
function applyLay(){for(const id in lay){const el=$('#'+id);if(!el)continue;const s=el.style;s.left=lay[id][0]+'px';s.top=lay[id][1]+'px';s.right='auto';s.bottom='auto'}}
applyLay();
function resetLay(){lay={};saveLay();HUD.forEach(i=>{const s=$('#'+i).style;s.left=s.top=s.right=s.bottom=''});applyCfg()}
function setEdit(v){editMode=v;$('#game').classList.toggle('edit',v);$('#hudbar').style.display=v?'flex':'none';fire=false;fb=false;fid=null;joy=null;jx=jy=0}
$('#game').addEventListener('pointerdown',e=>{if(!editMode)return;e.stopPropagation();e.preventDefault();const el=HUD.map(i=>$('#'+i)).find(n=>n.contains(e.target));if(!el)return;const[x,y]=pos(e);drag={el,id:e.pointerId,ox:x-el.offsetLeft,oy:y-el.offsetTop};try{el.setPointerCapture(e.pointerId)}catch(_){}},true);
addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const[x,y]=pos(e),el=drag.el,nx=cl(x-drag.ox,0,800-el.offsetWidth),ny=cl(y-drag.oy,0,450-el.offsetHeight),s=el.style;s.left=nx+'px';s.top=ny+'px';s.right='auto';s.bottom='auto';lay[el.id]=[Math.round(nx),Math.round(ny)]});
addEventListener('pointerup',e=>{if(drag&&e.pointerId===drag.id){drag=null;saveLay()}});
$('#game').addEventListener('click',e=>{if(editMode){e.stopPropagation();e.preventDefault()}},true);
$('#hsv').onclick=()=>setEdit(false);$('#hrs').onclick=resetLay;
