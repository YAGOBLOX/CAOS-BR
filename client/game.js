// Dois "modos" de jogo com a mesma interface:
//   update(dt, inp)  – aplica a entrada local e avança o jogo
//   getView(now)     – devolve um snapshot (formato de shared/sim.js) para desenhar
//   drainEvents()    – eventos novos (kills) desde a última chamada
//   stop()           – encerra
// Propriedades: myId, mode, status (texto de aviso ou ''), ping (ms ou null)

import { PROTOCOL_VERSION } from '../shared/config.js';
import { createState, addPlayer, setInput, step, snapshot } from '../shared/sim.js';
import { updateBots } from '../shared/bots.js';

const INTERP_DELAY_MS = 100;

const lerp = (a, b, t) => a + (b - a) * t;
function lerpAngle(a, b, t) {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * t;
}

// Interpola dois snapshots (a antes, b depois) com t em [0,1].
export function interpolate(a, b, t) {
  const pa = new Map(a.p.map((p) => [p.id, p]));
  const ba = new Map(a.b.map((x) => [x.id, x]));
  return {
    ...b,
    p: b.p.map((pb) => {
      const q = pa.get(pb.id);
      if (!q || !q.al || !pb.al) return pb;
      return { ...pb, x: lerp(q.x, pb.x, t), y: lerp(q.y, pb.y, t), a: lerpAngle(q.a, pb.a, t) };
    }),
    b: b.b.map((xb) => {
      const q = ba.get(xb.id);
      return q ? { ...xb, x: lerp(q.x, xb.x, t), y: lerp(q.y, xb.y, t) } : xb;
    }),
  };
}

export class OfflineGame {
  constructor(name) {
    this.mode = 'offline';
    this.status = '';
    this.ping = null;
    this.state = createState();
    this.myId = addPlayer(this.state, name).id;
    for (let i = 1; i <= 3; i++) addPlayer(this.state, `Bot ${i}`, { isBot: true });
    this.pending = [];
  }

  update(dt, inp) {
    setInput(this.state, this.myId, inp);
    updateBots(this.state);
    step(this.state, dt);
  }

  getView() {
    const view = snapshot(this.state);
    this.pending.push(...view.e);
    return view;
  }

  drainEvents() {
    return this.pending.splice(0);
  }

  stop() {}
}

export class OnlineGame {
  constructor(url, name) {
    this.mode = 'online';
    this.status = 'Conectando ao servidor...';
    this.ping = null;
    this.myId = null;
    this.snaps = [];
    this.pending = [];
    this.lastSend = 0;
    this.closedByUs = false;

    this.ws = new WebSocket(url);
    this.ws.onopen = () => this.#send({ t: 'join', name });
    this.ws.onmessage = (ev) => this.#onMessage(ev.data);
    this.ws.onerror = () => {
      if (!this.closedByUs) this.status = 'Falha ao conectar ao servidor';
    };
    this.ws.onclose = () => {
      if (!this.closedByUs && !this.status.startsWith('Falha')) this.status = 'Desconectado do servidor';
    };
    this.pingTimer = setInterval(() => this.#send({ t: 'ping', ts: performance.now() }), 2000);
  }

  #send(obj) {
    if (this.ws.readyState === 1) this.ws.send(JSON.stringify(obj));
  }

  #onMessage(data) {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch {
      return;
    }
    switch (msg.t) {
      case 'welcome':
        this.myId = msg.id;
        this.status = msg.v === PROTOCOL_VERSION ? '' : 'Versão do servidor incompatível';
        break;
      case 'full':
        this.status = 'Servidor cheio, tente de novo em instantes';
        break;
      case 'pong':
        this.ping = Math.round(performance.now() - msg.ts);
        break;
      case 'snap':
        this.snaps.push({ at: performance.now(), s: msg });
        if (this.snaps.length > 10) this.snaps.shift();
        if (msg.e && msg.e.length) this.pending.push(...msg.e);
        break;
    }
  }

  update(dt, inp) {
    const now = performance.now();
    if (this.myId && now - this.lastSend >= 33) {
      this.lastSend = now;
      this.#send({ t: 'input', mx: inp.mx, my: inp.my, aim: inp.aim, shoot: inp.shoot });
    }
  }

  getView(now) {
    const s = this.snaps;
    if (!s.length) return null;
    const rt = now - INTERP_DELAY_MS;
    let a = null;
    let b = null;
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i].at <= rt) {
        a = s[i];
        b = s[i + 1] || null;
        break;
      }
    }
    if (!a) return s[0].s;
    if (!b) return a.s;
    return interpolate(a.s, b.s, (rt - a.at) / (b.at - a.at));
  }

  drainEvents() {
    return this.pending.splice(0);
  }

  stop() {
    this.closedByUs = true;
    clearInterval(this.pingTimer);
    try {
      this.ws.close();
    } catch {
      /* ignora */
    }
  }
}
