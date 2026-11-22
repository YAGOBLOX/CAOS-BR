import test from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG as C } from '../shared/config.js';
import { createState, addPlayer, removePlayer, setInput, step, snapshot, zoneRadius } from '../shared/sim.js';
import { updateBots } from '../shared/bots.js';

const DT = 1 / C.tickRate;
function run(state, seconds) {
  for (let i = 0; i < Math.round(seconds * C.tickRate); i++) step(state, DT);
}
function place(p, x, y) {
  p.x = x;
  p.y = y;
}

test('jogador se move na direção da entrada', () => {
  const s = createState();
  const p = addPlayer(s, 'A');
  place(p, 200, 100);
  setInput(s, p.id, { mx: 1, my: 0, aim: 0, shoot: false });
  run(s, 1);
  assert.ok(Math.abs(p.x - (200 + C.player.speed)) < 1);
  assert.equal(Math.round(p.y), 100);
});

test('movimento diagonal não é mais rápido', () => {
  const s = createState();
  const p = addPlayer(s, 'A');
  place(p, 200, 100);
  setInput(s, p.id, { mx: 1, my: 1, aim: 0, shoot: false });
  run(s, 0.5);
  const dist = Math.hypot(p.x - 200, p.y - 100);
  assert.ok(Math.abs(dist - C.player.speed * 0.5) < 1);
});

test('paredes bloqueiam o jogador e a arena tem limites', () => {
  const s = createState();
  const p = addPlayer(s, 'A');
  place(p, 470, 165); // à esquerda da parede em x=500
  setInput(s, p.id, { mx: 1, my: 0, aim: 0, shoot: false });
  run(s, 1);
  assert.ok(p.x <= 500 - C.player.radius + 0.01, `x=${p.x}`);
  place(p, 30, 30);
  setInput(s, p.id, { mx: -1, my: -1, aim: 0, shoot: false });
  run(s, 1);
  assert.ok(p.x >= C.player.radius - 0.01 && p.y >= C.player.radius - 0.01);
});

test('entrada inválida da rede é sanitizada', () => {
  const s = createState();
  const p = addPlayer(s, 'A');
  setInput(s, p.id, { mx: 9999, my: NaN, aim: 'oi', shoot: 'sim' });
  assert.equal(p.input.mx, 1);
  assert.equal(p.input.my, 0);
  assert.equal(p.input.shoot, false);
  assert.ok(Number.isFinite(p.aim));
});

test('tiro causa dano, mata, conta abate e renasce', () => {
  const s = createState();
  const a = addPlayer(s, 'A');
  const b = addPlayer(s, 'B');
  place(a, 200, 100);
  place(b, 320, 100);
  setInput(s, a.id, { mx: 0, my: 0, aim: 0, shoot: true });
  run(s, 0.4);
  assert.ok(b.hp < C.player.maxHp, 'B deveria ter levado dano');
  run(s, 2);
  assert.equal(b.alive, false);
  assert.equal(a.kills, 1);
  assert.equal(b.deaths, 1);
  const snap = snapshot(s);
  assert.equal(snap.e.length, 1);
  assert.equal(snap.e[0].killerName, 'A');
  assert.equal(snapshot(s).e.length, 0, 'eventos são consumidos');
  setInput(s, a.id, { mx: 0, my: 0, aim: 0, shoot: false });
  run(s, C.player.respawnSec + 0.2);
  assert.equal(b.alive, true);
  assert.equal(b.hp, C.player.maxHp);
});

test('balas param nas paredes', () => {
  const s = createState();
  const a = addPlayer(s, 'A');
  place(a, 400, 165);
  setInput(s, a.id, { mx: 0, my: 0, aim: 0, shoot: true });
  run(s, 0.1);
  assert.ok(s.bullets.length > 0);
  setInput(s, a.id, { mx: 0, my: 0, aim: 0, shoot: false });
  run(s, 0.5);
  assert.equal(s.bullets.length, 0);
});

test('ninguém se acerta com a própria bala', () => {
  const s = createState();
  const a = addPlayer(s, 'A');
  place(a, 200, 100);
  setInput(s, a.id, { mx: 0, my: 0, aim: 0, shoot: true });
  run(s, 1);
  assert.equal(a.hp, C.player.maxHp);
});

test('zona: raio segue o ciclo e a tempestade causa dano', () => {
  assert.equal(zoneRadius(0), C.zone.maxRadius);
  assert.equal(zoneRadius(C.zone.holdOpen + C.zone.shrink + 1), C.zone.minRadius);
  const cycle = C.zone.holdOpen + C.zone.shrink + C.zone.holdClosed + C.zone.grow;
  assert.equal(zoneRadius(cycle + 1), C.zone.maxRadius);

  const s = createState();
  const p = addPlayer(s, 'A');
  s.time = C.zone.holdOpen + C.zone.shrink + 1;
  place(p, 50, 50);
  setInput(s, p.id, { mx: 0, my: 0, aim: 0, shoot: false });
  run(s, 1);
  assert.ok(p.hp < C.player.maxHp - C.zone.dps * 0.8);
});

test('bots jogam sem quebrar a simulação', () => {
  const s = createState();
  addPlayer(s, 'Humano');
  for (let i = 0; i < 3; i++) addPlayer(s, `Bot ${i}`, { isBot: true });
  for (let i = 0; i < 30 * 30; i++) {
    updateBots(s);
    step(s, DT);
  }
  for (const p of Object.values(s.players)) {
    assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), 'posição válida');
    assert.ok(p.x >= 0 && p.x <= C.arena.width && p.y >= 0 && p.y <= C.arena.height);
  }
  const total = Object.values(s.players).reduce((n, p) => n + p.kills + p.deaths, 0);
  assert.ok(total > 0, 'houve combate');
});

test('removePlayer remove o jogador', () => {
  const s = createState();
  const a = addPlayer(s, 'A');
  removePlayer(s, a.id);
  assert.equal(Object.keys(s.players).length, 0);
});
