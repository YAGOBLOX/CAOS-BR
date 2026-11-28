# CAOS BR FPS — jogo (v42: limpeza + lobby novo)

Abra `index.html` direto no navegador para testar (precisa de internet só para o three.js).

## O que existe agora
Só o **lobby** e o **boneco principal** (o primeiro modelo simples do jogo). No lobby ficam o perfil, as moedas, o boneco 3D no centro do salão (arraste para girar) e o botão **DECOLAR**, que toca a **transição** (faixas de neon, rajada de tiros, clarão e título com barra de carregamento) e, por enquanto, termina com o aviso "EM BREVE", porque ainda não há mapas.

## Lobby novo (v42)
- Reproduz a imagem de referência do dono (salão de natal sci‑fi). `js/lobby/heroi3d.js` monta a cena: câmera 3D **igual à da imagem** + ~20 camadas de geometria 3D (céu, paisagem, varanda, piso, teto, paredes, pilar da bandeira, pódio, escada, presentes, tela, árvores, chapéu) com a textura `img/lobby/fundo.jpg` projetada pela mesma câmera (*projection mapping*). Na posição inicial a tela fica idêntica à imagem; a câmera balança de leve e cada camada se move na sua profundidade.
- Leve: 1 textura, 1 material sem luz, sem sombras no cenário. Só o boneco tem luzes (3) e uma sombra pequena no piso. Efeitos: lâmpadas das guirlandas piscando e neve (2 chamadas de desenho).
- Se o three.js/WebGL falhar, fica a própria imagem como fundo (CSS de `#lbg`).
- Para ajustar a posição do boneco: `CZ` (distância) em `heroi3d.js`; área de arrastar: `#hero` em `css/lobby.css`.
- Transição: `js/lobby/transicao.js` (`CAOS.transicao(done)`, canvas 2D, ~2,5 s). Quando a partida existir, é no callback de `lobby.js` que ela começa.

```
index.html              lobby
css/                    base, lobby, overlay (janela de aviso)
js/
  carregamento/         manifesto.js (arquivos do boneco) + carregador.js (carrega three.js e o boneco em 2º plano)
  lobby/                lobby.js (perfil e DECOLAR) + heroi3d.js (cena 3D do lobby) + transicao.js
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
