/* CAOS BR FPS · MANIFESTO: lista de mapas, modos e arquivos. Para adicionar mapa/modo, registre aqui */
const CAOS={
 ver:'8',   // MUDE este número (e o ?v= do index.html e do site) a cada atualização, para o navegador baixar os arquivos novos
 maps:{}, modes:{}, map:null, sel:{mode:null,map:null},
 manifest:{
  three:'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  // sistemas da partida (carregados 1x ao iniciar a primeira partida)
  game:['js/sistemas/movimento.js','js/sistemas/entidades.js','js/sistemas/combate.js','js/sistemas/loop.js','js/sistemas/entrada.js','js/sistemas/hud.js','js/sistemas/render3d.js'],
  characters:['js/personagens/skins.js','js/personagens/armas-3d.js','js/personagens/modelos.js','js/personagens/modelos-armas.js','js/personagens/animacoes.js'],
  // MODOS: "maps" = mapas em que o modo pode ser jogado (o primeiro é o padrão)
  modes:{
   treino:{name:'TREINO',maps:['ilha'],files:['js/modos/treino/modo.js']},
   solo1v1:{name:'SOLO 1v1',maps:['ilha'],files:['js/modos/solo1v1/modo.js']},
   estande:{name:'ESTANDE',maps:['estande'],files:['js/modos/estande/modo.js']}
  },
  // MAPAS: cada um em sua pasta; só o mapa escolhido é carregado
  maps:{
   ilha:{name:'ILHA DE TREINO',files:['js/mapas/ilha/mapa.js']},
   estande:{name:'ESTANDE DE TIRO',files:['js/mapas/estande/mapa.js']}
  }
 },
 registerMap(m){ for(const k of ['id','size','playerSpawn','kits','walls','drawFloor','sky','fogNear','fogFar','boundaryHeight']) if(m[k]===undefined) console.warn('[mapa '+m.id+'] falta: '+k); this.maps[m.id]=m; },
 registerMode(m){ for(const k of ['id','flags','createBots']) if(m[k]===undefined) console.warn('[modo '+m.id+'] falta: '+k); this.modes[m.id]=m; }
};
