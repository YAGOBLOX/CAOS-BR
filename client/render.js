// Desenho do jogo no canvas. render() recebe um snapshot (formato de shared/sim.js).

import { CONFIG as C } from '../shared/config.js';
import { WALLS } from '../shared/sim.js';
import { STICK } from './input.js';

const colorOf = (id) => `hsl(${(Number(id) * 67) % 360} 70% 55%)`;
let lastCam = { x: C.arena.width / 2, y: C.arena.height / 2 };

// Escala da câmera: mostra bastante da arena em telas grandes e pequenas.
export function cameraScale(w, h) {
  return Math.max(0.45, Math.min(1.1, Math.min(w / 900, h / 600)));
}

export function render(ctx, dpr, w, h, view, myId, input, meta) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#0b0d12';
  ctx.fillRect(0, 0, w, h);

  if (!view) {
    drawCenterText(ctx, w, h, meta.status || 'Carregando...');
    return;
  }

  const me = view.p.find((p) => p.id === myId) || null;
  if (me) lastCam = { x: me.x, y: me.y };
  const scale = cameraScale(w, h);

  // ---- mundo ----
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(scale, scale);
  ctx.translate(-lastCam.x, -lastCam.y);
  drawWorld(ctx, view);
  ctx.restore();

  // ---- interface ----
  drawHud(ctx, w, h, view, me, meta);
  if (input && input.touchMode) drawSticks(ctx, w, h, input);
  if (meta.status) drawCenterText(ctx, w, h, meta.status);
}

function drawWorld(ctx, view) {
  const W = C.arena.width;
  const H = C.arena.height;

  ctx.fillStyle = '#14171f';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 100) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
  }
  for (let y = 0; y <= H; y += 100) {
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
  }
  ctx.stroke();

  // tempestade: tudo fora do círculo da zona
  const z = view.z;
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.moveTo(z.x + z.r, z.y);
  ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,40,40,0.22)';
  ctx.fill('evenodd');
  ctx.beginPath();
  ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,90,90,0.9)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.strokeStyle = '#5a6272';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, W, H);

  for (const w of WALLS) {
    ctx.fillStyle = '#394150';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = '#566074';
    ctx.lineWidth = 2;
    ctx.strokeRect(w.x, w.y, w.w, w.h);
  }

  ctx.fillStyle = '#ffd54a';
  for (const b of view.b) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, C.bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const R = C.player.radius;
  ctx.textAlign = 'center';
  ctx.font = '12px system-ui, sans-serif';
  for (const p of view.p) {
    if (!p.al) continue;
    ctx.strokeStyle = '#d9dde6';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + Math.cos(p.a) * (R + 10), p.y + Math.sin(p.a) * (R + 10));
    ctx.stroke();

    ctx.fillStyle = colorOf(p.id);
    ctx.beginPath();
    ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = p.b ? '#7a7f8c' : '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#e8ebf2';
    ctx.fillText(p.n, p.x, p.y - R - 8);
    ctx.fillStyle = '#2a2e38';
    ctx.fillRect(p.x - 18, p.y + R + 6, 36, 4);
    ctx.fillStyle = p.hp > 40 ? '#4cd07d' : '#e5534b';
    ctx.fillRect(p.x - 18, p.y + R + 6, (36 * p.hp) / C.player.maxHp, 4);
  }
}

function drawHud(ctx, w, h, view, me, meta) {
  ctx.textAlign = 'left';
  ctx.font = '14px system-ui, sans-serif';

  if (me) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(12, 12, 184, 14);
    ctx.fillStyle = me.hp > 40 ? '#4cd07d' : '#e5534b';
    ctx.fillRect(12, 12, (184 * me.hp) / C.player.maxHp, 14);
    ctx.fillStyle = '#fff';
    ctx.fillText(`Vida ${me.hp}`, 18, 24);
    ctx.fillStyle = '#e8ebf2';
    ctx.fillText(`Abates ${me.k}  ·  Mortes ${me.d}`, 12, 46);
  }

  // placar
  const top = [...view.p].sort((a, b) => b.k - a.k || a.d - b.d).slice(0, 5);
  ctx.textAlign = 'right';
  ctx.font = '13px system-ui, sans-serif';
  top.forEach((p, i) => {
    ctx.fillStyle = me && p.id === me.id ? '#ffd54a' : '#c9cedb';
    ctx.fillText(`${p.n}  ${p.k}`, w - 12, 22 + i * 18);
  });

  // feed de abates
  ctx.textAlign = 'left';
  ctx.font = '13px system-ui, sans-serif';
  (meta.feed || []).forEach((f, i) => {
    ctx.fillStyle = 'rgba(232,235,242,0.9)';
    ctx.fillText(f.text, 12, 70 + i * 17);
  });

  // modo / ping
  ctx.textAlign = 'right';
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(200,205,220,0.6)';
  const label = meta.mode === 'online' ? `Online${meta.ping != null ? ` · ${meta.ping} ms` : ''}` : 'Offline · bots';
  ctx.fillText(label, w - 12, h - 10);

  if (me && !me.al) {
    drawCenterText(ctx, w, h, 'Eliminado — renascendo...');
  } else if (me) {
    const out = Math.hypot(me.x - view.z.x, me.y - view.z.y) > view.z.r;
    if (out) {
      ctx.textAlign = 'center';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.fillStyle = '#ff6b6b';
      ctx.fillText('Fora da zona! Volte para o centro', w / 2, 40);
    }
  }
}

function drawCenterText(ctx, w, h, text) {
  ctx.textAlign = 'center';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  const tw = ctx.measureText(text).width;
  ctx.fillRect(w / 2 - tw / 2 - 14, h / 2 - 22, tw + 28, 40);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, w / 2, h / 2 + 7);
}

function drawSticks(ctx, w, h, input) {
  const R = STICK.radius;
  const draw = (stick, hx, hy) => {
    const ox = stick ? stick.ox : hx;
    const oy = stick ? stick.oy : hy;
    ctx.strokeStyle = stick ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ox, oy, R, 0, Math.PI * 2);
    ctx.stroke();
    if (stick) {
      let dx = stick.x - stick.ox;
      let dy = stick.y - stick.oy;
      const len = Math.hypot(dx, dy);
      if (len > R) {
        dx = (dx / len) * R;
        dy = (dy / len) * R;
      }
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(ox + dx, oy + dy, 24, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  draw(input.moveStick, 100, h - 100);
  draw(input.aimStick, w - 100, h - 100);
}
