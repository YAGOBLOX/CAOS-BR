/* CAOS BR FPS · estado global compartilhado (partida G, 3D T, entrada, canvas HUD, tamanho do mapa) */
// W/H e walls são definidos pelo MAPA escolhido (ver mapas/<id>/mapa.js)
let W=1800,H=1200,walls=[],RR=null;
const cv=$('#cv'),cx=cv.getContext('2d');
let lx=0,ly=0,pit=0,fb=false,T=null,G=null,keys={},jx=0,jy=0,fire=false,ang=0,joy=null,aim=null;
let fpx=0,fpy=0,fid=null;
