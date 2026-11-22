// Servidor multiplayer do CAOS BR (Node >= 20, sem dependências).
// O servidor é a autoridade: recebe a entrada dos jogadores, roda a simulação
// de shared/sim.js e envia snapshots a 30 Hz.
//
// Variáveis de ambiente (todas opcionais):
//   PORT             porta HTTP/WebSocket (o Render define sozinho)
//   ALLOWED_ORIGINS  origens de navegador permitidas, separadas por vírgula ('*' = todas)
//   MAX_PLAYERS      limite de jogadores humanos (padrão 16)
//   BOTS             bots de preenchimento quando há poucos humanos (padrão 2)

import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { CONFIG, PROTOCOL_VERSION } from '../shared/config.js';
import { createState, addPlayer, removePlayer, setInput, step, snapshot } from '../shared/sim.js';
import { updateBots } from '../shared/bots.js';
import { handleUpgrade } from './ws.js';

const DEFAULT_ORIGINS = [
  'https://yagoblox.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:8080',
  'http://localhost:3000',
];

function parseOrigins(raw) {
  if (!raw) return DEFAULT_ORIGINS;
  const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return list.includes('*') ? null : list;
}

function sanitizeName(raw) {
  const clean = String(raw ?? '')
    .normalize('NFC')
    .replace(/[^\p{L}\p{N} _-]/gu, '')
    .trim()
    .slice(0, 16);
  return clean || 'Jogador';
}

export async function startServer({
  port = Number(process.env.PORT) || 8080,
  allowedOrigins = parseOrigins(process.env.ALLOWED_ORIGINS),
  maxPlayers = Number(process.env.MAX_PLAYERS) || 16,
  botCount = process.env.BOTS !== undefined ? Number(process.env.BOTS) : 2,
} = {}) {
  const state = createState();
  const clients = new Map(); // id do jogador -> client (apenas quem já entrou)
  const conns = new Set(); // todas as conexões abertas

  const server = http.createServer((req, res) => {
    const url = (req.url || '/').split('?')[0];
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(url === '/health' ? 'ok' : 'CAOS-BR server\n');
  });

  const send = (conn, obj) => conn.send(JSON.stringify(obj));

  // Mantém bots só quando há poucos humanos: 1 humano -> botCount bots, e assim por diante.
  function syncBots() {
    const humans = clients.size;
    const want = humans === 0 ? 0 : Math.max(0, botCount - (humans - 1));
    const bots = Object.values(state.players).filter((p) => p.isBot);
    for (let i = bots.length; i < want; i++) addPlayer(state, `Bot ${state.nextId}`, { isBot: true });
    for (let i = bots.length - 1; i >= want; i--) removePlayer(state, bots[i].id);
  }

  function attach(conn) {
    const client = { conn, id: null, tokens: 90, lastMsg: Date.now() };
    conns.add(client);

    conn.on('message', (text) => {
      client.lastMsg = Date.now();
      if (--client.tokens < 0) {
        if (client.tokens < -200) conn.close(1008);
        return;
      }
      let msg;
      try {
        msg = JSON.parse(text);
      } catch {
        return;
      }
      if (!msg || typeof msg !== 'object') return;

      switch (msg.t) {
        case 'join': {
          if (client.id) break;
          if (clients.size >= maxPlayers) {
            send(conn, { t: 'full' });
            conn.close(1013);
            break;
          }
          const p = addPlayer(state, sanitizeName(msg.name));
          client.id = p.id;
          clients.set(p.id, client);
          send(conn, { t: 'welcome', id: p.id, v: PROTOCOL_VERSION });
          syncBots();
          break;
        }
        case 'input':
          if (client.id) setInput(state, client.id, msg);
          break;
        case 'ping':
          if (Number.isFinite(msg.ts)) send(conn, { t: 'pong', ts: msg.ts });
          break;
      }
    });

    conn.on('close', () => {
      conns.delete(client);
      if (client.id) {
        removePlayer(state, client.id);
        clients.delete(client.id);
        syncBots();
      }
    });
  }

  server.on('upgrade', (req, socket, head) => {
    handleUpgrade(req, socket, head, { allowedOrigins, onConnection: attach });
  });

  // Laço do jogo
  let last = performance.now();
  const loop = setInterval(() => {
    const now = performance.now();
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (clients.size === 0) return; // sem jogadores: não gasta CPU
    updateBots(state);
    step(state, dt);
    const msg = JSON.stringify({ t: 'snap', ...snapshot(state) });
    for (const c of clients.values()) {
      if (c.conn.bufferedAmount < 1_000_000) c.conn.send(msg);
    }
  }, 1000 / CONFIG.tickRate);

  // Limite de mensagens por segundo e desconexão por inatividade
  const housekeeping = setInterval(() => {
    const now = Date.now();
    for (const c of conns) {
      c.tokens = 90;
      if (now - c.lastMsg > 30000) c.conn.close(1001);
    }
  }, 1000);

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, resolve);
  });

  return {
    server,
    state,
    port: server.address().port,
    close() {
      clearInterval(loop);
      clearInterval(housekeeping);
      for (const c of conns) c.conn.close(1001);
      return new Promise((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections?.();
      });
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().then((s) => {
    console.log(`CAOS-BR server ouvindo na porta ${s.port}`);
    const shutdown = () => s.close().then(() => process.exit(0));
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  });
}
