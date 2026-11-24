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
