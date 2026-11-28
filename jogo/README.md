# CAOS BR FPS — jogo (v43: lobby corrigido + carregamento real)

Abra `index.html` direto no navegador para testar (precisa de internet só para o three.js).

## O que existe agora
Só o **lobby** e o **boneco principal** (o primeiro modelo simples do jogo). No lobby ficam o perfil, as moedas, o boneco 3D no centro do salão (arraste para girar) e o botão **DECOLAR**, que abre a **tela de carregamento** (faixas de neon, rajada de tiros, clarão, título e barra) e, por enquanto, termina com o aviso "EM BREVE", porque ainda não há mapas.

## Lobby novo (v42, corrigido na v43)
- Reproduz a imagem de referência do dono (salão de natal sci‑fi). `js/lobby/heroi3d.js` monta a cena: câmera 3D **igual à da imagem** + ~20 camadas de geometria 3D (céu, paisagem, varanda, piso, teto, paredes, pilar da bandeira, pódio, escada, presentes, tela, árvores, chapéu) com a textura `img/lobby/fundo.jpg` projetada **por pixel num shader** (*projective texture mapping*; a v42 calculava por vértice e distorcia piso/teto/guirlandas). Na posição inicial a tela fica idêntica à imagem; a câmera balança de leve e cada camada se move na sua profundidade.
- Leve: 1 textura, 1 material (shader simples, sem luz), sem sombras no cenário. Só o boneco tem luzes e uma sombra pequena no piso. Efeitos: lâmpadas piscando e neve (2 chamadas de desenho).
- Se o three.js/WebGL falhar, fica a própria imagem como fundo (CSS de `#lbg`).
- Para ajustar o boneco: `CZ` em `heroi3d.js`; área de arrastar: `#hero` em `css/lobby.css`.

## Carregamento de verdade (v43)
- `js/lobby/partida.js`: lista `CAOS.partida.tarefas` (`{nome,peso,run}`; hoje motor 3D/boneco e a arma equipada) e `CAOS.entrarNaPartida(fim)`. Mapas/modos futuros devem **registrar suas tarefas ali**.
- `js/lobby/transicao.js`: `CAOS.transicao({progresso,pronto,fim,minimo,maximo})`. Aparece ao clicar DECOLAR, fica em loop (novas rajadas, furos antigos somem) e só sai quando tudo carregou, passou o mínimo (3,2 s) e a barra chegou a 100%. Falha de uma tarefa não trava. Tempo máximo 25 s (sai com `fim(false)`).

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
