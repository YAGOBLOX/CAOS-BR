# CAOS BR — estado do projeto

Jogo multiplayer de tiro 2D com arenas dinâmicas, feito para rodar no navegador.
Desenvolvido em colaboração entre o dono do repositório (YAGOBLOX) e o Claude.

**Para retomar em um chat novo:** leia este arquivo, rode `git log --oneline -10` e
`node --test`, e continue a partir de "Próximos passos".

## Links e hospedagem

- Jogo publicado (GitHub Pages, branch `main`, pasta raiz): https://yagoblox.github.io/CAOS-BR/
- Servidor multiplayer: **ainda não publicado**. Plano: Render (plano gratuito), ver "Publicar o servidor".
- Repositório público: nunca commitar senhas, chaves, tokens ou dados pessoais.

## Estrutura

```
index.html          página do jogo (menu + canvas); o Pages serve este arquivo
client/             código que roda no navegador (módulos ES, sem build)
  main.js           menu, laço principal (requestAnimationFrame)
  game.js           OfflineGame (local, com bots) e OnlineGame (WebSocket + interpolação)
  input.js          teclado/mouse e joysticks virtuais (celular)
  render.js         desenho no canvas e HUD
  config.js         SERVER_URL (vazio até o servidor existir)
shared/             código usado pelo cliente E pelo servidor
  config.js         constantes do jogo e PROTOCOL_VERSION
  sim.js            regras do jogo (movimento, tiro, dano, zona, respawn)
  bots.js           IA dos bots
server/             servidor Node (sem dependências)
  server.js         servidor autoritativo, 30 Hz, bots de preenchimento
  ws.js             WebSocket mínimo (RFC 6455) implementado à mão
test/               testes (node:test): sim, servidor com conexões reais, cliente
render.yaml         receita opcional do Render
```

Regras de código: JavaScript puro em módulos ES, **sem dependências npm** e sem etapa de
build (assim o GitHub Pages serve os arquivos direto). `shared/` não pode usar DOM nem
APIs só do Node.

## Como rodar

- Testes: `node --test`
- Servidor local: `node server/server.js` (porta 8080; `PORT` muda)
- Cliente local: `python3 -m http.server 8000` e abrir `http://localhost:8000/?server=ws://localhost:8080`
  (sem `?server=` o botão Online fica desativado; o modo offline funciona sempre)

## Regras do jogo (valores em `shared/config.js`)

- Arena 1600x1000 com 7 obstáculos fixos. Jogador: raio 16, 240 px/s, 100 de vida.
- Tiro: 20 de dano, uma bala a cada 0,18 s, 720 px/s, vive 1,2 s.
- Arena dinâmica: zona segura circular no ciclo abre (20 s) → fecha (15 s) → fechada (10 s)
  → reabre (5 s). Fora dela: 12 de dano por segundo.
- Morreu: renasce em 2 s em ponto livre dentro da zona. Placar: abates e mortes.

## Protocolo de rede (JSON por WebSocket)

Cliente → servidor: `{t:'join',name}`, `{t:'input',mx,my,aim,shoot}` (~30/s), `{t:'ping',ts}`.
Servidor → cliente: `{t:'welcome',id,v}`, `{t:'full'}`, `{t:'pong',ts}`, e `{t:'snap',...}` 30x/s com
`tm` (tempo), `p` (jogadores), `b` (balas), `z` (zona), `e` (eventos de abate).
Campos curtos dos jogadores: `id n x y a hp al k d b` (ver comentário em `snapshot()` de `sim.js`).
Mudou o formato? Aumente `PROTOCOL_VERSION` em `shared/config.js`.

Segurança do servidor: checagem de Origin (`ALLOWED_ORIGINS`), mensagens recebidas limitadas
a 4 KB, 90 mensagens/s por conexão, desconexão após 30 s sem mensagens, entrada validada em
`setInput`, nomes filtrados.

## Estado atual (v0.1)

Feito e testado (21 testes passando):
- Modo offline completo: 1 jogador + 3 bots, tiro, zona que fecha, placar, kill feed.
- Controles de computador (WASD + mouse) e de celular (dois joysticks).
- Servidor multiplayer autoritativo com bots de preenchimento (1 humano → 2 bots).
- Cliente online com interpolação de 100 ms (sem predição: há atraso de entrada = ping + ~100 ms).

Ainda não verificado: o jogo rodando de verdade em um navegador/celular e o servidor
hospedado na internet (só foi testado por testes automáticos e conexões locais).

## Publicar o servidor (Render, plano gratuito)

1. Criar conta em https://render.com (login com o GitHub facilita).
2. New → Web Service → conectar o repositório `YAGOBLOX/CAOS-BR`.
3. Runtime Node; Build Command `echo ok`; Start Command `node server/server.js`;
   Instance Type Free; região mais próxima do Brasil (EUA Leste).
4. Variável de ambiente: `ALLOWED_ORIGINS=https://yagoblox.github.io`.
5. Health Check Path: `/health`.
6. Quando o deploy terminar, copiar a URL (ex.: `https://caos-br-server.onrender.com`) e
   colocar em `client/config.js` como `wss://caos-br-server.onrender.com`, depois commit e push.

Limitação do plano gratuito: o serviço "dorme" após ~15 min sem uso e a primeira conexão
demora cerca de um minuto para acordar.

## Próximos passos (sugestão de ordem)

1. Testar no celular e no computador; ajustar sensibilidade, tamanho da arena e dificuldade dos bots.
2. Publicar o servidor e ligar o modo online (seção acima).
3. Predição no cliente para o próprio jogador (tira o atraso de movimento).
4. Mais arenas (layouts de `WALLS` por mapa), armas e itens, partidas com fim e placar final.
5. Som, efeitos visuais, menu melhor; domínio próprio e cadastro no Google Search Console.

## Convenções

- Commits em português, mensagens curtas e claras. Rodar `node --test` antes de enviar.
- Mudou regra do jogo? Atualize este arquivo e os testes em `test/`.
