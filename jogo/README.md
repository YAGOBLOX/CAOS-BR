# CAOS BR FPS — jogo (v46: botões do lobby ajustados)

Abra `index.html` direto no navegador para testar (precisa de internet só para o three.js).

## O que existe agora
Só o **lobby** e o **boneco principal** (o primeiro modelo simples do jogo). No lobby ficam o perfil, as moedas, o boneco 3D no centro do salão (arraste para girar) e o botão **DECOLAR**, que por enquanto só mostra o aviso "EM BREVE" (ainda não há partidas). **O DECOLAR não dispara a tela de carregamento.**

## Lobby novo (v42, corrigido na v43)
- Reproduz a imagem de referência do dono (salão de natal sci‑fi). `js/lobby/heroi3d.js` monta a cena: câmera 3D **igual à da imagem** + ~20 camadas de geometria 3D (céu, paisagem, varanda, piso, teto, paredes, pilar da bandeira, pódio, escada, presentes, tela, árvores, chapéu) com a textura `img/lobby/fundo.jpg` projetada **por pixel num shader** (*projective texture mapping*; a v42 calculava por vértice e distorcia piso/teto/guirlandas). Na posição inicial a tela fica idêntica à imagem; a câmera balança de leve e cada camada se move na sua profundidade.
- Leve: 1 textura, 1 material (shader simples, sem luz), sem sombras no cenário. Só o boneco tem luzes e uma sombra pequena no piso. Efeitos: lâmpadas piscando e neve (2 chamadas de desenho).
- Se o three.js/WebGL falhar, fica a própria imagem como fundo (CSS de `#lbg`).
- Para ajustar o boneco: `CZ` em `heroi3d.js`; área de arrastar: `#hero` em `css/lobby.css`.

## Botões do lobby (v45)
- Recriados da imagem de botões do dono. Moldura em CSS (`.gb`, fim de `css/lobby.css`; medidas em px do palco 800x450) + ícones recortados da imagem em `img/ui/*.png` (fundo transparente). Markup em `#ui` do `index.html`.
- Perfil (avatar, nome, LV), moedas e diamantes (com **+**), 4 ícones no topo (amigos, mensagens com selo, configurações, conexão), menu da esquerda (COFRE, LOJA, MISSÕES, EVENTOS, AMIGOS), chat embaixo e DECOLAR. A barra escura do topo segue o mockup.
- v46: botões menores e mais juntos (barra do topo com 40 px); **sem indicação de nível** (sem sistema de nick/nível ainda); **chat vazio** (só moldura e ícone); selo vermelho das cartas **escondido por padrão** — `CAOS.avisoCartas(qtd)` (em `lobby.js`) mostra/esconde quando existir sistema de mensagens.
- **Só visual por enquanto:** todos abrem um aviso "em breve" (`lobby.js`). Diamantes `100` é valor de exemplo do mockup. O nome vem do `localStorage` (`nick`) e as moedas de `economia.js`. Ids que o JS usa: `#nick`, `#coins`, `#go`.

## Tela de carregamento (v44/v45)
- **Quem aciona é o botão verde JOGAR do SITE**: ele cria o iframe do jogo; ao abrir, `lobby.js` chama `CAOS.iniciarJogo()` e a animação cobre o jogo até tudo estar pronto, depois revela o lobby. DECOLAR (amarelo, dentro do jogo) não tem relação com ela.
- `js/lobby/transicao.js`: canvas 2D 800x450 (desenhado em 1,5x) com cena em loop: dois soldados atrás de barreiras trocando tiros + dois duelistas ao fundo, skyline com paralaxe, rastros, clarão no cano, cápsulas, fumaça, faíscas, marcas de bala, brasas, título com glitch e **rachaduras de vidro** que surgem conforme o progresso. Embaixo: barra inclinada e segmentada com porcentagem, nome do recurso que carrega e dica.
- `CAOS.transicao({progresso,pronto,texto,fim,minimo,maximo,abertura,pausar})`: só sai quando tudo carregou, passou o mínimo (4,2 s) e a barra chegou a 100%. Falha de tarefa não trava. Máximo 25 s (`fim(false)`).
- `js/lobby/partida.js`: tarefas `{nome,peso,run,liberar?,p?}` (fonte, imagens do lobby, motor 3D/boneco, arma equipada, 1ª imagem da cena 3D do lobby — `heroi3d.js` chama `CAOS.lobbyOk()`). **Preparado para mapas, ainda sem implementar:** `CAOS.partida.extra()` devolverá só as tarefas do mapa escolhido e `CAOS.partida.descarregar()` chama o `liberar` do mapa anterior ao trocar.

```
index.html              lobby
css/                    base, lobby, overlay (janela de aviso)
js/
  carregamento/         manifesto.js (arquivos do boneco) + carregador.js (carrega three.js e o boneco em 2º plano)
  lobby/                lobby.js (perfil e DECOLAR) + heroi3d.js (cena 3D) + transicao.js (carregamento) + partida.js (tarefas)
  sistemas/             utils (fit() esticado — NÃO MEXER), overlay, graficos (valores fixos),
                        armas-dados (lista WP), economia (moedas e arma equipada, só leitura)
  personagens/          modelos.js (boneco simples), animacoes.js (poseN), modelos-armas.js,
                        armas-3d.js, armas-glb.js
  lib/GLTFLoader.js     carrega as armas em GLB
modelos/armas/          armas em GLB   ·   img/armas/   ícones das armas   ·   img/lobby/fundo.jpg   textura do lobby
```

## Removido na limpeza (continua no histórico do git)
- **Skins/modelos:** Xbot, roupa Oni, Gojo, boneco de blocos (Minecraft), menu SKINS, soldado dos bots.
- **Sistemas:** configurações (painel, sensibilidade, editor de HUD, gráficos ajustáveis), loja, novidades, escolha de modo/mapa.
- **Mapas e modos:** ilha, deserto, estande, clocktower (com `.glb`/`.bin`), treino, solo 1v1, estande.
- **Bots** e todo o motor da partida (movimento, combate, loop, entrada/toque, HUD, render 3D do mapa).

Para recuperar qualquer parte, procure o commit anterior à "Limpa o jogo" no histórico do git.

## Próximas etapas
1. Lobby: refinar (UI, detalhes) a partir do lobby novo.
2. Só depois, criar os mapas (e o motor da partida volta junto com eles).

## Regras que continuam valendo
- O jogo é **deitado (800×450)** e a tela é **esticada** para preencher tudo (`fit()` em `js/sistemas/utils.js`, escala `sx` ≠ `sy`). Não volte para escala uniforme.
- Cache: ao atualizar, mude o `?v=` do `index.html` e o `ver` em `js/carregamento/manifesto.js`.
