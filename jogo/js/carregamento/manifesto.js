/* CAOS BR FPS · MANIFESTO: lista dos arquivos que o lobby carrega em segundo plano.
   Mapas, modos e bots foram removidos na limpeza (v41; lobby novo v42); quando voltarem, registre aqui. */
const CAOS={
 ver:'47',   // MUDE este número (e o ?v= do index.html) a cada atualização, para o navegador baixar os arquivos novos
 manifest:{
  three:'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  // boneco do lobby (modelo simples) + armas
  characters:['js/lib/GLTFLoader.js','js/personagens/armas-3d.js','js/personagens/armas-glb.js','js/personagens/modelos.js','js/personagens/modelos-armas.js','js/personagens/animacoes.js']
 }
};
