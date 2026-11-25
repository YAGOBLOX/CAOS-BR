# CAOS BR — instruções para IAs e desenvolvedores

> Leia este arquivo ANTES de mexer em qualquer coisa. Vale para qualquer IA ou ferramenta (Claude, ChatGPT, Codex, Cursor, Gemini etc.) e para pessoas.

## O que é o projeto
- **Site** (GitHub Pages: https://yagoblox.github.io/CAOS-BR/) com a vitrine do jogo **CAOS BR FPS**.
- **Jogo** (beta) dentro da pasta `jogo/`, em HTML/CSS/JS puro + three.js (carregado de CDN). Não usa build nem npm.
- Dono: Yago Emídio (YAGOBLOX). Idioma: **português do Brasil** (textos, comentários e commits).

## Estrutura
```
index.html        site (vitrine + tela do jogo)
scripts.html      página de scripts
caos-br-fps.png   capa do jogo
jogo/             o jogo completo (tem o próprio index.html, css/ e js/)
  README.md       estrutura interna do jogo (mapas, modos, o que carrega e quando)
  img/armas/             ícones das armas (menu ARMAS, slots e HUD)
  js/personagens/armas-3d.js   malhas 3D das armas novas (GUNMESH)
  js/sistemas/armas-dados.js   lista de armas (WP): números, preço, ícone, modelo
  js/sistemas/utils.js   função fit(): tamanho/escala da tela do jogo (VER REGRAS ABAIXO)
```

## Como o jogo entra no site
- O botão **▶ JOGAR** (`openGame()` no `index.html`) abre uma tela cheia (`#game-screen`) e cria um `<iframe src="jogo/index.html">` dentro de `#game-play-area`.
- O botão **← VOLTAR À SELEÇÃO** (`closeGame()`) **remove o iframe** (para som, loop e libera memória). Não troque isso por "esconder" o iframe.
- O jogo só é carregado quando clica em JOGAR. Não carregue o jogo na abertura do site.
- No celular, ao abrir, o site tenta tela cheia e travar na horizontal.

## REGRAS QUE NÃO PODEM QUEBRAR
1. **O jogo é DEITADO (paisagem), palco lógico 800×450.** Em celular em pé, o próprio jogo gira o palco 90° (`rot` em `jogo/js/sistemas/utils.js`). Mantenha isso.
2. **A TELA DO JOGO É ESTICADA E PREENCHE A TELA INTEIRA, sem faixas/espaços nas laterais.**
   - `fit()` em `jogo/js/sistemas/utils.js` usa `scale(sx, sy)` com valores **diferentes** em cada eixo (largura da tela ÷ 800, altura da tela ÷ 450).
   - **NÃO** volte para escala uniforme (`Math.min(...)`), **NÃO** adicione `letterbox`/barras/`object-fit: contain` no palco.
   - Os toques usam `getBoundingClientRect()` (`jogo/js/sistemas/entrada.js`), então funcionam com a escala esticada. Se criar novo código de toque/mira, **converta coordenadas pelo retângulo do elemento**, nunca assumindo escala uniforme.
3. **O iframe do jogo ocupa 100% da área disponível** (`#game-play-area iframe`, `position:absolute; inset:0`). Sem margens, sem bordas, sem `max-width`.
4. **A barra superior com o botão VOLTAR deve ser pequena** para não atrapalhar (fonte ~10–11px, padding ~3–5px). Não aumente. Não cubra o HUD do jogo.
5. **Não use bibliotecas novas por CDN sem necessidade** e não adicione build/npm. Tudo é arquivo estático.
6. As funções chamadas entre arquivos precisam existir antes de serem usadas (a ordem dos `<script>` em `jogo/index.html` importa).

## Como atualizar o jogo
1. Substitua/edite os arquivos dentro de `jogo/` (mantenha os caminhos relativos: `js/...`, `css/...`).
2. Se vier um zip novo do jogo, **preserve** as regras acima, principalmente o `fit()` esticado em `utils.js`. Se o zip novo trouxer o `fit()` antigo (escala uniforme `Math.min`), reaplique a versão esticada.
3. Para adicionar mapa ou modo, siga `jogo/README.md` (copiar `_modelo` e registrar em `jogo/js/carregamento/manifesto.js`).
4. Se mudar o nome ou o caminho de `jogo/index.html`, atualize `GAME_URL` no script do `index.html` do site.

## Como adicionar uma ARMA
1. **Dados**: em `jogo/js/sistemas/armas-dados.js`, adicione uma linha no FIM da lista `WP` (antes do PUNHO não importa; nunca reordene nem apague as existentes, porque o jogador salva as armas pela posição). Campos explicados no topo do arquivo. O **preço é o campo `pr`** (é só mudar ali).
2. **Ícone**: `jogo/img/armas/<id>.png` (PNG com fundo transparente, ~256x96, arma de lado com o cano para a direita, cor clara). Campo `ic`.
3. **Modelo 3D**: em `jogo/js/personagens/armas-3d.js`, adicione `<id>:{v:[...],i:[...]}` ao `GUNMESH` (v = vértices x,y,z multiplicados por 20 e arredondados; i = índices dos triângulos; eixo +x = cano, origem = mão). Campo `m` = `<id>`. Sem modelo, a arma funciona mas fica invisível na mão.
4. Pronto: ela aparece sozinha no menu ARMAS (comprar/equipar). Não precisa mexer em loja, slots ou HUD.

Como o jogo trata armas:
- No menu **ARMAS** o jogador compra e **EQUIPA uma arma só**. Na partida ele tem **2 slots: a arma equipada + PUNHO** (tocar na arma que já está na mão **recarrega**; tocar na outra puxa).
- As 6 primeiras entradas de `WP` (PISTOLA, FUZIL, SHOTGUN, SMG, SNIPER, REVÓLVER) são antigas e estão com `hide:1`: não aparecem no menu nem na partida; só ficam porque os bots usam o modelo do FUZIL e os saves usam a posição. Armas com `st:1` são as iniciais (M1911, REMINGTON 870, M4A1).
- **Todas as janelas (cards) têm botão ✕ fixo no topo**, e fecham também tocando fora ou com Esc (`open()` em `jogo/js/sistemas/overlay.js`). Na partida, o botão **⬅ LOBBY** (`#quit`) volta ao lobby. Não remova.
- O jogador **equipa até 3 armas** no menu ARMAS (`eqs` em `economia.js`, salvo em `sv.q`). Na partida: um slot por arma equipada + PUNHO. **Tocar na arma que já está na mão recarrega; tocar em outra troca.**
- Botões do jogo usam **ícones SVG** (sprite no começo do `#game` em `jogo/index.html`: boneco pulando/agachado/deitado, mira, recarga, tiro, lobby...). Não volte para emoji (ficam cinza/quebrados em alguns aparelhos). Estilo em `jogo/css/jogo.css` (bloco "BOTÕES DO JOGO"). O minimapa é desenhado em `hud.js`.
- **CACHE:** a cada atualização, mude a versão `?v=` em 3 lugares: `GAME_URL` no `index.html` da raiz, as tags `<script>/<link>` do `jogo/index.html` e `ver` em `jogo/js/carregamento/manifesto.js`. Sem isso o navegador pode mostrar arquivos velhos.
- Modelos 3D novos têm 3 cores por vértice (campo `c` em `GUNMESH`: 0 escuro, 1 madeira, 2 metal claro).
- O **PUNHO** é a entrada com `fist:1` em `WP` (sem munição, golpe de curto alcance, sem modelo 3D). Não remova.
- No modo **ESTANDE** (`allWeapons:true`) aparecem todas as armas + punho, em ícones pequenos.
- O salvamento fica em `localStorage` `sv` = `{c: moedas, o: armas compradas, q: armas equipadas}`.

## Checklist antes de enviar (testar em 3 tamanhos)
- Computador (ex.: 1280×720), celular **em pé** (ex.: 390×780) e celular **deitado** (ex.: 780×390).
- Clicar em JOGAR: o lobby do jogo preenche a tela inteira, sem espaços nas laterais, e o botão DECOLAR aparece.
- Clicar em VOLTAR: volta para o site e o iframe some (`document.querySelector('iframe')` deve ser `null`).
- Console sem erros (o jogo precisa de internet só para o three.js).
- Clicar em DECOLAR inicia a partida (testar no site publicado ou com internet).

## Dados salvos no aparelho (`localStorage`)
`nick`, `cfg`, `sv`, `lay` (nome, configurações, progresso/moedas e posição dos botões do HUD).

## Commits
Mensagens curtas em português, no imperativo (ex.: "Corrige tela esticada no celular").

## Controles do HUD (estilo Free Fire)
- Botão ATIRAR é analógico: base fixa + bolinha (`.fk`) que acompanha o dedo até um limite; arrastar o dedo gira a câmera SEM parar de atirar (eventos no `window` em `entrada.js`). Não troque por `click`/`pointerleave`.
- Analógico de andar flutua e **segue o dedo** (a base anda junto quando o dedo passa do raio). Desenho no `hud.js`.
- Os outros botões ficam em arco ao redor do ATIRAR (`applyCfg()` em `config.js`), longe do centro onde fica o boneco. `cfgv` (cfg) e `layv` (layout-hud.js) forçam o padrão novo uma vez; mude o número para resetar de novo.

## Bala e cores das armas
- Cada arma em `WP` tem `bv` (velocidade da bala), `rg` (alcance), `bn`/`bt` (comprimento/espessura do traço). A bala é um traço fino alinhado à direção (`render3d.js`) e anda em sub-passos de ~8px (`loop.js`) para não atravessar parede/inimigo.
- As cores das armas 3D são por região em `colr()` dentro de `jogo/js/personagens/modelos-armas.js` (uma regra por arma, com o campo `m`). Arma nova sem regra usa as 3 cores padrão.

## Personagem 3D
- `jogo/js/personagens/modelos.js` (humanoide com quadril/joelho/ombro/cotovelo encaixados) e `animacoes.js` (pose + IK de 2 ossos: as mãos seguram a arma; punho = guarda de boxe).
- O CORPO é independente da câmera: `p.fa` (loop.js) vira suave para onde anda; ao atirar/mirar vira para a mira. A bala sempre sai pela mira (câmera), não pelo corpo.
- O lobby mostra o mesmo boneco em 3D (`jogo/js/lobby/heroi3d.js`, carrega three.js em 2º plano via `CAOS.loadChars()`); se falhar, fica o desenho 2D (`#hero`).

## Lobby e transições
- Lobby enxuto (estilo Free Fire): perfil, moedas, ⚙️, LOJA (compra/equipa armas — não existe mais botão ARMAS), NOVIDADES, modo/mapa e DECOLAR. Só deixe botão que tenha função.
- Agachar/deitar são animados: `m.cs`/`m.ps` em `animacoes.js` (corpo) e `p.hs` em `loop.js` + `SM()` em `combate.js` (câmera). Não volte para troca instantânea.
- Os bots seguram o M4A1 (`BOTW` em `modelos-armas.js`); a posição da arma na mão é em `poseN`.

## IA dos bots (loop.js, bloco dos bots)
- Miram na altura real do jogador (em pé/agachado/deitado): ~10% cabeça, ~30% peito, o resto erra por perto. `shoot(e,a,dm,o,ty,d)` em `combate.js` recebe a altura alvo.
- Esquivam (pulam/agacham, mais quando o jogador mira neles), andam com velocidade suave, se afastam uns dos outros e giram suave. Para ajustar a dificuldade: as chances em `const sd=...`/`r<.1`/`r<.4`, `q.rate` e `q.dmg` nos modos.

## Mapas e escolha de mapa
- Mapas: `ilha`, `deserto` (casas de adobe, montanhas de areia, cactos grandes, árvores secas, mesas, trilhas) e `estande`. Cada um em `jogo/js/mapas/<id>/mapa.js`, registrado em `manifesto.js` com `img` (prévia em `jogo/img/mapas/<id>.png`, 480x270) e listado em `maps:[...]` dos modos que podem usá-lo.
- O lobby abre a tela ESCOLHER MAPA (`openMaps()` em `lobby.js`) com imagem + nome de cada mapa do modo. Mapa novo: copie `_modelo`, registre no manifesto, ponha a prévia em `img/mapas/` e confira (spawns/kits fora de paredes e alcançáveis).
- Campo opcional `waterColor` no mapa troca a cor do "mar" fora da borda (deserto usa areia).
- Colisores dos objetos devem cobrir quase toda a base visual (montanhas ~.85 do raio, pedras ~.95), senão o boneco "entra" neles.
- A câmera em 3ª pessoa não atravessa parede: `camRay()` em `combate.js` encurta o recuo até antes do 1º obstáculo. Mira = bolinha (anel + ponto) em `drawCh()` no `hud.js`.

## Modelo do jogador (Xbot, glb)
- O jogador usa `jogo/modelos/xbot.glb` (esqueleto Mixamo; animações idle/walk/run). Os bots continuam com o boneco simples e leve (`humanoid(0)`). Guardados para uso futuro (não carregados): `soldado.glb`, `michelle.glb`, `readyplayer.glb` na mesma pasta. Licença: modelos de exemplo do three.js (Mixamo/Ready Player Me) — confira antes de publicar.
- `xbotBody()` (modelos.js) e `poseX()` (animacoes.js): mistura de animações por velocidade, agachar = quadril/joelhos por código, deitado = corpo girado, mãos na arma por IK de 2 ossos (`ik2`). O three r128 mede a malha errado (bind pose): a altura é fixa em 1,8 m (`XB_H/1.8`).
- Carregamento: `CAOS.loadXbot()` (carregador.js), com limite de 25 s; se falhar, usa o boneco simples. `js/lib/GLTFLoader.js` e `SkeletonUtils.js` são do three r128 (local, sem CDN extra).
- Trocar de modelo: ajuste nomes dos ossos `mixamorig*` e a altura real em `xbotBody()`.

## Roupa e poses do Xbot (v20)
- `xbClothes()` (fim de `modelos.js`): roupa estilo samurai/oni (referência do dono): jaqueta azul com lapela rosa, calça larga roxa, faixa magenta, ataduras, sandália branca, máscara oni vermelha com chifres e coque. Peças presas aos OSSOS. Cintura fina (corpo masculino). Medidas em cm.
- `poseX()`: andar/correr só em pé; agachado/deitado usam o parado + pose por código (sem tremer). Agachar: queda do quadril `88.8*(1-cos(1.05*cs))`. Cotovelos com pole para fora (mão não cruza o corpo); arma em z=4.4, foregrip limitado a 9.
- v22: cintura afinada por osso em `poseX()` (`Hips.scale.x=.8`, `Spine2` e `UpLeg` com `1/.8` para ombros/pernas ficarem normais). Roupa cobre costas inteiras (jaqueta com `ez` ~.98 e deslocada para trás) e tem mais detalhes (dobras da calça, trevo, ataduras, dentes da máscara, chifres).
- v23: a roupa do Xbot agora é uma CÓPIA INFLADA da malha do corpo (`Beta_Surface`) ligada ao mesmo esqueleto (skinning), com cor/folga por região (altura/abertura do corpo em T-pose) em `xbClothes()`. Material precisa de `skinning:true` (three r128). Só a máscara/cabelo/chifres são peças rígidas no osso Head. Para mudar a roupa, ajuste as regiões `if(y<...)` (cor `hex`, folga `f` em cm).
