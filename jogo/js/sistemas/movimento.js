/* CAOS BR FPS · colisão, movimento, visão, pulo e agachar */
function hitW(x,y,r){for(const[a,b,w,h]of walls){const nx=cl(x,a,a+w),ny=cl(y,b,b+h);if((x-nx)**2+(y-ny)**2<r*r)return 1}return 0}
function hitWH(x,y,h){for(const[a,b,w,l]of walls){if(x>a&&x<a+w&&y>b&&y<b+l&&h<((a<0||b<0||a>=W||b>=H)?22:WALLH))return 1}return 0}
function mv(e,dx,dy){let m=0;if(dx&&!hitW(e.x+dx,e.y,13)){e.x+=dx;m=1}if(dy&&!hitW(e.x,e.y+dy,13)){e.y+=dy;m=1}return m}
function see(a,b){const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.ceil(d/10);for(let i=1;i<n;i++){if(hitW(a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n,2))return 0}return 1}
function jump(){if(G&&!G.over&&G.p.z===0){G.p.vz=300;G.p.st=0}}
function stance(n){if(G&&!G.over)G.p.st=G.p.st===n?0:n}
