// Ponto de entrada do cliente: menu, laço principal e ligação entre as peças.

import { SERVER_URL } from './config.js';
import { Input } from './input.js';
import { render } from './render.js';
import { OfflineGame, OnlineGame } from './game.js';

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const ctx = canvas.getContext('2d');
const input = new Input(canvas);

let dpr = 1;
let W = 0;
let H = 0;
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
}
window.addEventListener('resize', resize);
resize();

// ---- menu ----
const serverUrl = new URLSearchParams(location.search).get('server') || SERVER_URL;
const nameInput = $('name');
try {
  nameInput.value = localStorage.getItem('caos-name') || '';
} catch {
  /* sem armazenamento */
}

if (!serverUrl) {
  $('btnOnline').disabled = true;
  $('onlineNote').textContent = 'Modo online em breve (servidor ainda não configurado).';
}

function playerName() {
  const n = nameInput.value.trim().slice(0, 16) || 'Jogador';
  try {
    localStorage.setItem('caos-name', n);
  } catch {
    /* ignora */
  }
  return n;
}

let game = null;
let feed = [];

function startGame(g) {
  game = g;
  feed = [];
  input.reset();
  input.enabled = true;
  $('menu').hidden = true;
  $('exit').hidden = false;
}

function stopGame() {
  if (game) game.stop();
  game = null;
  input.enabled = false;
  input.reset();
  $('menu').hidden = false;
  $('exit').hidden = true;
}

$('btnOffline').addEventListener('click', () => startGame(new OfflineGame(playerName())));
$('btnOnline').addEventListener('click', () => startGame(new OnlineGame(serverUrl, playerName())));
$('exit').addEventListener('click', stopGame);
window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && game) stopGame();
});

// ---- laço principal ----
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!game) return;

  const inp = input.read(W / 2, H / 2);
  game.update(dt, inp);
  const view = game.getView(now);

  for (const e of game.drainEvents()) {
    const text = e.killerName ? `${e.killerName} eliminou ${e.victimName}` : `${e.victimName} caiu na tempestade`;
    feed.push({ text, until: now + 5000 });
  }
  feed = feed.filter((f) => f.until > now).slice(-5);

  render(ctx, dpr, W, H, view, game.myId, input, {
    mode: game.mode,
    ping: game.ping,
    status: game.status,
    feed,
  });
}
requestAnimationFrame(frame);
