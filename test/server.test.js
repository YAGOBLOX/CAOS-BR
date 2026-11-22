import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { startServer } from '../server/server.js';
import { PROTOCOL_VERSION } from '../shared/config.js';

function connect(port) {
  const ws = new WebSocket(`ws://127.0.0.1:${port}`);
  const inbox = [];
  const waiters = [];
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    inbox.push(msg);
    for (const w of [...waiters]) w.check();
  });
  const opened = new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
  });
  // resolve com a primeira mensagem (já recebida ou futura) que satisfaça pred
  const waitFor = (pred, ms = 3000) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        waiters.splice(waiters.indexOf(w), 1);
        reject(new Error('timeout esperando mensagem'));
      }, ms);
      const w = {
        check() {
          const m = inbox.find(pred);
          if (m) {
            clearTimeout(timer);
            waiters.splice(waiters.indexOf(w), 1);
            resolve(m);
          }
        },
      };
      waiters.push(w);
      w.check();
    });
  const send = (o) => ws.send(JSON.stringify(o));
  return { ws, opened, waitFor, send, inbox };
}

test('servidor: entrar, snapshots, tiro, ping e saída', async (t) => {
  const srv = await startServer({ port: 0, botCount: 0, allowedOrigins: null });
  t.after(() => srv.close());

  const res = await fetch(`http://127.0.0.1:${srv.port}/health`);
  assert.equal(await res.text(), 'ok');

  const a = connect(srv.port);
  await a.opened;
  a.send({ t: 'join', name: '  Ana<script>  ' });
  const welcome = await a.waitFor((m) => m.t === 'welcome');
  assert.equal(welcome.v, PROTOCOL_VERSION);

  const snap = await a.waitFor((m) => m.t === 'snap' && m.p.some((p) => p.id === welcome.id));
  assert.equal(snap.p.find((p) => p.id === welcome.id).n, 'Anascript', 'nome sanitizado');

  a.send({ t: 'input', mx: 0, my: 0, aim: 0, shoot: true });
  await a.waitFor((m) => m.t === 'snap' && m.b.length > 0);

  a.send({ t: 'ping', ts: 123 });
  assert.equal((await a.waitFor((m) => m.t === 'pong')).ts, 123);

  const b = connect(srv.port);
  await b.opened;
  b.send({ t: 'join', name: 'Beto' });
  const wb = await b.waitFor((m) => m.t === 'welcome');
  await a.waitFor((m) => m.t === 'snap' && m.p.length === 2);

  b.ws.close();
  await a.waitFor((m) => m.t === 'snap' && m.p.length === 1 && m.p[0].id === welcome.id && wb.id !== welcome.id);

  a.ws.close();
});

test('servidor: bots de preenchimento entram e saem', async (t) => {
  const srv = await startServer({ port: 0, botCount: 2, allowedOrigins: null });
  t.after(() => srv.close());
  const a = connect(srv.port);
  await a.opened;
  a.send({ t: 'join', name: 'Solo' });
  await a.waitFor((m) => m.t === 'snap' && m.p.filter((p) => p.b).length === 2);
  a.ws.close();
});

test('servidor: limite de jogadores', async (t) => {
  const srv = await startServer({ port: 0, botCount: 0, maxPlayers: 1, allowedOrigins: null });
  t.after(() => srv.close());
  const a = connect(srv.port);
  await a.opened;
  a.send({ t: 'join', name: 'A' });
  await a.waitFor((m) => m.t === 'welcome');
  const b = connect(srv.port);
  await b.opened;
  b.send({ t: 'join', name: 'B' });
  await b.waitFor((m) => m.t === 'full');
  a.ws.close();
});

test('servidor: mensagem enorme derruba a conexão (1009)', async (t) => {
  const srv = await startServer({ port: 0, botCount: 0, allowedOrigins: null });
  t.after(() => srv.close());
  const a = connect(srv.port);
  await a.opened;
  const closed = new Promise((res) => a.ws.addEventListener('close', (ev) => res(ev.code)));
  a.ws.send('x'.repeat(10000));
  assert.equal(await closed, 1009);
});

test('servidor: lixo JSON é ignorado sem derrubar o servidor', async (t) => {
  const srv = await startServer({ port: 0, botCount: 0, allowedOrigins: null });
  t.after(() => srv.close());
  const a = connect(srv.port);
  await a.opened;
  a.ws.send('isso não é json');
  a.ws.send('null');
  a.ws.send('{"t":"input","mx":"x"}'); // sem join
  a.send({ t: 'join', name: 'Ok' });
  await a.waitFor((m) => m.t === 'welcome');
  a.ws.close();
});

test('servidor: rejeita Origin não permitida', async (t) => {
  const srv = await startServer({ port: 0, allowedOrigins: ['https://yagoblox.github.io'] });
  t.after(() => srv.close());
  const status = await new Promise((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1',
      port: srv.port,
      headers: {
        Connection: 'Upgrade',
        Upgrade: 'websocket',
        'Sec-WebSocket-Version': '13',
        'Sec-WebSocket-Key': Buffer.from('0123456789abcdef').toString('base64'),
        Origin: 'https://site-malicioso.example',
      },
    });
    req.on('response', (r) => resolve(r.statusCode));
    req.on('upgrade', () => resolve(101));
    req.on('error', reject);
    req.end();
  });
  assert.equal(status, 403);
});
