/* CAOS BR FPS · GRÁFICOS do lobby: valores FIXOS (predefinição "média", a que já era o padrão).
   O painel de configurações e o salvamento foram removidos na limpeza (v41). As texturas nunca mudam de tamanho. */
(function(){
 const g={sh:2,res:2,tx:3,aa:1,fps:45,lb:2,cd:1,fl:0};   // sh sombras 0–3 · res resolução 0–3 · aa suavização · fps limite · lb lobby (0 = desligado, 1 = leve, 2 = completo)
 CAOS.gfx=g;
 g.lobW=()=>[800,900,1050,1200][g.res];                   // largura do canvas do lobby (16:9)
 g.smap=()=>[0,512,1024,1536][g.sh];                      // mapa de sombra
 g.iv=()=>1000/g.fps;                                     // intervalo mínimo entre quadros
 CAOS.texLite=function(c){return c};                      // a qualidade nunca altera as texturas
})();
