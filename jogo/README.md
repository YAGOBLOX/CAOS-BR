# CAOS BR FPS — jogo (estado após a limpeza v41)

Abra `index.html` direto no navegador para testar (precisa de internet só para o three.js).

## O que existe agora
Só o **lobby** e o **boneco principal** (o primeiro modelo simples do jogo). No lobby ficam o perfil, as moedas, o boneco 3D no pedestal (arraste para girar) e o botão **DECOLAR** — que por enquanto só mostra o aviso "EM BREVE", porque ainda não há mapas.

```
index.html              lobby
css/                    base, lobby, overlay (janela de aviso)
js/
  carregamento/         manifesto.js (arquivos do boneco) + carregador.js (carrega three.js e o boneco em 2º plano)
  lobby/                lobby.js (perfil e DECOLAR) + heroi3d.js (cena 3D do lobby)
  sistemas/             utils (fit() esticado — NÃO MEXER), overlay, graficos (valores fixos),
                        armas-dados (lista WP), economia (moedas e arma equipada, só leitura)
  personagens/          modelos.js (boneco simples), animacoes.js (poseN), modelos-armas.js,
                        armas-3d.js, armas-glb.js
  lib/GLTFLoader.js     carrega as armas em GLB
modelos/armas/          armas em GLB   ·   img/armas/   ícones das armas
```

## Removido na limpeza (continua no histórico do git)
- **Skins/modelos:** Xbot, roupa Oni, Gojo, boneco de blocos (Minecraft), menu SKINS, soldado dos bots.
- **Sistemas:** configurações (painel, sensibilidade, editor de HUD, gráficos ajustáveis), loja, novidades, escolha de modo/mapa.
- **Mapas e modos:** ilha, deserto, estande, clocktower (com `.glb`/`.bin`), treino, solo 1v1, estande.
- **Bots** e todo o motor da partida (movimento, combate, loop, entrada/toque, HUD, render 3D do mapa).

Para recuperar qualquer parte, procure o commit anterior à "Limpa o jogo" no histórico do git.

## Próximas etapas
1. Reformular o lobby.
2. Só depois, criar os mapas (e o motor da partida volta junto com eles).

## Regras que continuam valendo
- O jogo é **deitado (800×450)** e a tela é **esticada** para preencher tudo (`fit()` em `js/sistemas/utils.js`, escala `sx` ≠ `sy`). Não volte para escala uniforme.
- Cache: ao atualizar, mude o `?v=` do `index.html` e o `ver` em `js/carregamento/manifesto.js`.
