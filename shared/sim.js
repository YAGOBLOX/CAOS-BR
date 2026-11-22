// Simulação do jogo. Código puro (sem DOM, sem rede), usado:
//  - pelo servidor Node (autoridade no modo online)
//  - pelo navegador (modo offline contra bots)
// Mantenha este arquivo determinístico quanto às regras: o que está aqui é a "lei" do jogo.

import { CONFIG as C } from './config.js';

// Obstáculos fixos da arena (retângulos). Espessura mínima de 30px.
export const WALLS = Object.freeze(
  [
    { x: 760, y: 440, w: 80, h: 120 }, // bloco central
    { x: 300, y: 250, w: 60, h: 60 }, // pilares
    { x: 1240, y: 250, w: 60, h: 60 },
    { x: 300, y: 690, w: 60, h: 60 },
    { x: 1240, y: 690, w: 60, h: 60 },
    { x: 500, y: 150, w: 600, h: 30 }, // paredes longas
    { x: 500, y: 820, w: 600, h: 30 },
  ].map((w) => Object.freeze(w)),
);

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (x) => x * x * (3 - 2 * x);

export function createState() {
  return { time: 0, nextId: 1, nextBulletId: 1, players: {}, bullets: [], events: [] };
}

// Raio da zona segura no instante t (segundos).
export function zoneRadius(t) {
  const z = C.zone;
  const cycle = z.holdOpen + z.shrink + z.holdClosed + z.grow;
  let m = ((t % cycle) + cycle) % cycle;
  if (m < z.holdOpen) return z.maxRadius;
  m -= z.holdOpen;
  if (m < z.shrink) return lerp(z.maxRadius, z.minRadius, smooth(m / z.shrink));
  m -= z.shrink;
  if (m < z.holdClosed) return z.minRadius;
  m -= z.holdClosed;
  return lerp(z.minRadius, z.maxRadius, m / z.grow);
}

function circleRectOverlap(cx, cy, r, rect) {
  const nx = clamp(cx, rect.x, rect.x + rect.w);
  const ny = clamp(cy, rect.y, rect.y + rect.h);
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy < r * r;
}

// Empurra o círculo (p.x, p.y, r) para fora do retângulo.
function pushOutCircleRect(p, r, rect) {
  const nx = clamp(p.x, rect.x, rect.x + rect.w);
  const ny = clamp(p.y, rect.y, rect.y + rect.h);
  const dx = p.x - nx;
  const dy = p.y - ny;
  const d2 = dx * dx + dy * dy;
  if (d2 >= r * r) return;
  if (d2 === 0) {
    // centro dentro do retângulo: sai pelo lado mais próximo
    const left = p.x - rect.x;
    const right = rect.x + rect.w - p.x;
    const top = p.y - rect.y;
    const bottom = rect.y + rect.h - p.y;
    const m = Math.min(left, right, top, bottom);
    if (m === left) p.x = rect.x - r;
    else if (m === right) p.x = rect.x + rect.w + r;
    else if (m === top) p.y = rect.y - r;
    else p.y = rect.y + rect.h + r;
    return;
  }
  const d = Math.sqrt(d2);
  const push = r - d;
  p.x += (dx / d) * push;
  p.y += (dy / d) * push;
}

function findSpawn(state) {
  const r = C.player.radius + 10;
  const others = Object.values(state.players).filter((p) => p.alive);
  const zr = zoneRadius(state.time);
  for (let i = 0; i < 40; i++) {
    const x = r + Math.random() * (C.arena.width - 2 * r);
    const y = r + Math.random() * (C.arena.height - 2 * r);
    if (WALLS.some((w) => circleRectOverlap(x, y, r + 8, w))) continue;
    if (Math.hypot(x - C.zone.cx, y - C.zone.cy) > zr - 60) continue;
    if (i < 30 && others.some((p) => Math.hypot(p.x - x, p.y - y) < 250)) continue;
    return { x, y };
  }
  return { x: 600, y: 330 };
}

export function addPlayer(state, name, { isBot = false } = {}) {
  const id = String(state.nextId++);
  const p = {
    id,
    name,
    isBot,
    x: 0,
    y: 0,
    aim: 0,
    hp: C.player.maxHp,
    alive: true,
    respawnAt: 0,
    kills: 0,
    deaths: 0,
    lastShot: -10,
    input: { mx: 0, my: 0, shoot: false },
  };
  Object.assign(p, findSpawn(state));
  state.players[id] = p;
  return p;
}

export function removePlayer(state, id) {
  delete state.players[id];
}

// inp: { mx, my (-1..1), aim (radianos), shoot (bool) }. Valida tudo (vem da rede).
export function setInput(state, id, inp) {
  const p = state.players[id];
  if (!p || !inp) return;
  const num = (v) => (Number.isFinite(v) ? v : 0);
  p.input.mx = clamp(num(inp.mx), -1, 1);
  p.input.my = clamp(num(inp.my), -1, 1);
  p.input.shoot = inp.shoot === true;
  if (Number.isFinite(inp.aim)) p.aim = Math.atan2(Math.sin(inp.aim), Math.cos(inp.aim));
}

function damage(state, victim, amount, attackerId) {
  if (!victim.alive) return;
  victim.hp -= amount;
  if (victim.hp > 0) return;
  victim.hp = 0;
  victim.alive = false;
  victim.deaths++;
  victim.respawnAt = state.time + C.player.respawnSec;
  const killer = attackerId != null ? state.players[attackerId] : null;
  if (killer && killer !== victim) killer.kills++;
  state.events.push({
    type: 'kill',
    killer: killer ? killer.id : null,
    victim: victim.id,
    killerName: killer ? killer.name : null,
    victimName: victim.name,
  });
}

function respawn(state, p) {
  Object.assign(p, findSpawn(state), { hp: C.player.maxHp, alive: true });
}

function fire(state, p) {
  p.lastShot = state.time;
  const dx = Math.cos(p.aim);
  const dy = Math.sin(p.aim);
  const off = C.player.radius + 6;
  state.bullets.push({
    id: state.nextBulletId++,
    owner: p.id,
    x: p.x + dx * off,
    y: p.y + dy * off,
    vx: dx * C.bullet.speed,
    vy: dy * C.bullet.speed,
    ttl: C.bullet.ttl,
  });
}

function stepBullets(state, dt, list) {
  const keep = [];
  const W = C.arena.width;
  const H = C.arena.height;
  const hitR = C.player.radius + C.bullet.radius;
  for (const b of state.bullets) {
    b.ttl -= dt;
    if (b.ttl <= 0) continue;
    const n = Math.max(1, Math.ceil((C.bullet.speed * dt) / C.bullet.maxStep));
    const sdt = dt / n;
    let dead = false;
    for (let i = 0; i < n && !dead; i++) {
      b.x += b.vx * sdt;
      b.y += b.vy * sdt;
      if (b.x < 0 || b.y < 0 || b.x > W || b.y > H) {
        dead = true;
        break;
      }
      for (const w of WALLS) {
        if (circleRectOverlap(b.x, b.y, C.bullet.radius, w)) {
          dead = true;
          break;
        }
      }
      if (dead) break;
      for (const p of list) {
        if (!p.alive || p.id === b.owner) continue;
        if (Math.hypot(p.x - b.x, p.y - b.y) < hitR) {
          damage(state, p, C.bullet.damage, b.owner);
          dead = true;
          break;
        }
      }
    }
    if (!dead) keep.push(b);
  }
  state.bullets = keep;
}

export function step(state, dt) {
  state.time += dt;
  const zr = zoneRadius(state.time);
  const list = Object.values(state.players);
  const r = C.player.radius;
  for (const p of list) {
    if (!p.alive) {
      if (state.time >= p.respawnAt) respawn(state, p);
      continue;
    }
    let { mx, my } = p.input;
    const len = Math.hypot(mx, my);
    if (len > 1) {
      mx /= len;
      my /= len;
    }
    p.x += mx * C.player.speed * dt;
    p.y += my * C.player.speed * dt;
    for (const w of WALLS) pushOutCircleRect(p, r, w);
    p.x = clamp(p.x, r, C.arena.width - r);
    p.y = clamp(p.y, r, C.arena.height - r);

    if (p.input.shoot && state.time - p.lastShot >= C.bullet.cooldown) fire(state, p);

    if (Math.hypot(p.x - C.zone.cx, p.y - C.zone.cy) > zr) {
      damage(state, p, C.zone.dps * dt, null);
    }
  }
  stepBullets(state, dt, list);
}

// Formato compacto enviado pela rede e usado pelo renderizador.
//  tm: tempo | p: jogadores | b: balas | z: zona | e: eventos
//  jogador: id, n(ome), x, y, a(ngulo), hp, al(ive), k(ills), d(eaths), b(ot)
//  bala: id, o(wner), x, y
export function snapshot(state) {
  const r1 = (v) => Math.round(v * 10) / 10;
  return {
    tm: Math.round(state.time * 1000) / 1000,
    p: Object.values(state.players).map((p) => ({
      id: p.id,
      n: p.name,
      x: r1(p.x),
      y: r1(p.y),
      a: Math.round(p.aim * 100) / 100,
      hp: Math.ceil(p.hp),
      al: p.alive ? 1 : 0,
      k: p.kills,
      d: p.deaths,
      b: p.isBot ? 1 : 0,
    })),
    b: state.bullets.map((b) => ({ id: b.id, o: b.owner, x: r1(b.x), y: r1(b.y) })),
    z: { x: C.zone.cx, y: C.zone.cy, r: Math.round(zoneRadius(state.time)) },
    e: state.events.splice(0),
  };
}
