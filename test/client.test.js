// Testes de fumaça do cliente fora do navegador: o modo offline roda e o
// renderizador desenha sem erros usando um contexto 2D falso.
import test from 'node:test';
import assert from 'node:assert/strict';
import { OfflineGame, interpolate } from '../client/game.js';
import { render, cameraScale } from '../client/render.js';

function fakeCtx() {
  const calls = [];
  const target = {};
  return new Proxy(target, {
    get(_, prop) {
      if (prop === 'calls') return calls;
      if (prop === 'measureText') return (s) => ({ width: String(s).length * 8 });
      if (prop in target) return target[prop];
      return (...args) => calls.push([prop, args]);
    },
    set(_, prop, value) {
      target[prop] = value;
      return true;
    },
  });
}

test('modo offline: roda, desenha e gera eventos', () => {
  const g = new OfflineGame('Teste');
  const ctx = fakeCtx();
  const input = { touchMode: true, moveStick: { ox: 100, oy: 100, x: 130, y: 90 }, aimStick: null };
  for (let i = 0; i < 60 * 10; i++) {
    g.update(1 / 60, { mx: 1, my: 0, aim: 0.5, shoot: true });
    const view = g.getView(i * 16);
    g.drainEvents();
    render(ctx, 1, 800, 600, view, g.myId, input, { mode: 'offline', ping: null, status: '', feed: [{ text: 'a eliminou b' }] });
  }
  assert.ok(ctx.calls.length > 100);
  assert.equal(g.getView(0).p.length, 4);
});

test('render lida com estado vazio e com status', () => {
  render(fakeCtx(), 1, 800, 600, null, null, null, { status: 'Conectando...' });
});

test('cameraScale fica dentro dos limites', () => {
  for (const [w, h] of [[360, 780], [1920, 1080], [320, 240], [4000, 3000]]) {
    const s = cameraScale(w, h);
    assert.ok(s >= 0.45 && s <= 1.1);
  }
});

test('interpolate mistura posições e preserva o resto', () => {
  const a = { tm: 1, p: [{ id: '1', n: 'A', x: 0, y: 0, a: 0, hp: 100, al: 1, k: 0, d: 0, b: 0 }], b: [{ id: 5, o: '1', x: 0, y: 0 }], z: { x: 0, y: 0, r: 10 }, e: [] };
  const b = { tm: 2, p: [{ id: '1', n: 'A', x: 10, y: 20, a: 1, hp: 80, al: 1, k: 1, d: 0, b: 0 }], b: [{ id: 5, o: '1', x: 100, y: 0 }, { id: 6, o: '1', x: 7, y: 7 }], z: { x: 0, y: 0, r: 10 }, e: [] };
  const m = interpolate(a, b, 0.5);
  assert.equal(m.p[0].x, 5);
  assert.equal(m.p[0].y, 10);
  assert.equal(m.p[0].hp, 80);
  assert.equal(m.b[0].x, 50);
  assert.equal(m.b[1].x, 7);
});

test('interpolate não desliza jogador que acabou de renascer', () => {
  const dead = { p: [{ id: '1', x: 0, y: 0, a: 0, al: 0 }], b: [], z: {}, e: [] };
  const alive = { p: [{ id: '1', x: 900, y: 900, a: 0, al: 1 }], b: [], z: {}, e: [] };
  assert.equal(interpolate(dead, alive, 0.5).p[0].x, 900);
});
