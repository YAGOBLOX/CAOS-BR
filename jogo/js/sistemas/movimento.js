/* CAOS BR FPS · colisão, movimento, visão, pulo e agachar */
/* v34: CHÃO POR CAMADAS (mapas com CAOS.lv: escadas, pontes, andares). Cada célula de 17u tem camadas de chão: altura lh, vão livre lc, espessura do sólido acima lt.
   Anda-se para onde existe camada com altura ≤ z+PASSO (e não mais que 70 abaixo). Mapas sem CAOS.lv continuam planos (retângulos em walls). */
const PASSO=18,VAO=51;
function lcell(x,y){const m=CAOS.lv,i=Math.floor(x/17),j=Math.floor(y/17);return(!m||i<0||j<0||i>=m.nx||j>=m.nz)?-1:j*m.nx+i}
function flr(x,y,z){const c=lcell(x,y);if(c<0)return null;const m=CAOS.lv;let b=null;for(let l=m.idx[c];l<m.idx[c+1];l++){const h=m.lh[l];if(m.lc[l]>=VAO&&h<=z+PASSO&&h>=z-70&&(b===null||h>b))b=h}return b}
function gnd(e){if(!CAOS.lv)return 0;const f=flr(e.x,e.y,e.z||0);if(f!==null)e.gz=f;return e.gz||0}
function grav(e,dt){const g=gnd(e);e.vz-=900*dt;e.z+=e.vz*dt;if(e.z<g){e.z=(e.vz<=0&&g-e.z<=30)?Math.min(g,e.z+420*dt):g;if(e.vz<0)e.vz=0}}
const onGnd=e=>e.z<=gnd(e)+.5;
function hitW(x,y,r,z){
 for(const[a,b,w,h]of walls){const nx=cl(x,a,a+w),ny=cl(y,b,b+h);if((x-nx)**2+(y-ny)**2<r*r)return 1}
 if(CAOS.lv){z=z||0;const q=Math.min(r,10)*.8;return(flr(x,y,z)===null||flr(x+q,y,z)===null||flr(x-q,y,z)===null||flr(x,y+q,z)===null||flr(x,y-q,z)===null)?1:0}
 return 0}
function hitWH(x,y,h){
 if(CAOS.lv){const c=lcell(x,y);if(c<0)return h<22?1:0;const m=CAOS.lv;for(let l=m.idx[c];l<m.idx[c+1];l++){const b=m.lh[l]+m.lc[l];if(h>=b&&h<=b+m.lt[l]+8)return 1}return 0}
 for(const[a,b,w,l]of walls){if(x>a&&x<a+w&&y>b&&y<b+l&&h<((a<0||b<0||a>=W||b>=H)?22:WALLH))return 1}return 0}
function mv(e,dx,dy){let m=0;if(dx&&!hitW(e.x+dx,e.y,13,e.z)){e.x+=dx;m=1}if(dy&&!hitW(e.x,e.y+dy,13,e.z)){e.y+=dy;m=1}return m}
function see(a,b){const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.ceil(d/10);for(let i=1;i<n;i++){const u=i/n,x=a.x+(b.x-a.x)*u,y=a.y+(b.y-a.y)*u;if(CAOS.lv?hitWH(x,y,(a.z||0)+30+((b.z||0)-(a.z||0))*u):hitW(x,y,2))return 0}return 1}
function jump(){if(G&&!G.over&&onGnd(G.p)){G.p.vz=300;G.p.st=0}}
function stance(n){if(G&&!G.over)G.p.st=G.p.st===n?0:n}
