# CAOS BR FPS — estrutura modular (ainda fora do site)

Abra `index.html` direto no navegador para testar (precisa de internet só para o three.js).

## Pastas
```
index.html              lobby (só o essencial carrega aqui)
css/                    base, lobby, overlay, jogo
js/
  carregamento/         manifesto.js (lista de mapas/modos/arquivos) + carregador.js (carrega sob demanda)
  lobby/                lobby.js (perfil, amigos, menus, escolha de modo/mapa, DECOLAR)
  sistemas/             utils, estado, config, economia/loja, layout-hud   (carregam no lobby)
                        movimento, entidades, combate, loop, entrada, hud, render3d   (carregam ao jogar)
  personagens/          skins.js, modelos.js, modelos-armas.js, armas-3d.js, armas-glb.js, animacoes.js
  mapas/<id>/mapa.js    um mapa por pasta (ilha, estande) + _modelo
  modos/<id>/modo.js    um modo por pasta (treino, solo1v1, estande) + _modelo
```

## O que carrega e quando
- **Lobby:** só 10 arquivos pequenos. Nenhum mapa, modo, personagem ou three.js.
- **Ao clicar DECOLAR:** three.js + sistemas da partida + personagens + **somente o mapa e o modo escolhidos**.
- Trocar de mapa/modo depois baixa só o que ainda não foi carregado.

## Adicionar um MAPA
1. Copie `js/mapas/_modelo` para `js/mapas/<id>`.
2. Edite `mapa.js` (paredes, spawns, kits, céu, chão).
3. Em `carregamento/manifesto.js`, adicione em `maps` e coloque o id em `maps:[...]` dos modos que podem usá-lo.

## Adicionar um MODO
1. Copie `js/modos/_modelo` para `js/modos/<id>`.
2. Edite `modo.js` (`createBots`, `shop`, `allWeapons`, `endOnKill`, `hudTitle`).
3. Em `manifesto.js`, adicione em `modes` com a lista de mapas permitidos.

## Pendências conhecidas (para expandir depois)
- `flags:{train/range}` ainda ativam trechos do HUD/fim de partida escritos para os 3 modos atuais (painel de dano do ESTANDE em `sistemas/hud.js`, texto de derrota em `loop.js`). Ideal: mover para dentro de cada modo.
- Cores do jogador/bots (pele, calça, cabelo) ainda estão fixas em `personagens/modelos.js`; só as camisas dos bots estão em `skins.js`.
- Menus "Loja/Passe/Eventos/Amigos" continuam como no original (placeholders).
