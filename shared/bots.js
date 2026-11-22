// IA simples dos bots. Chamar uma vez por tick, antes de step().

import { CONFIG as C } from './config.js';
import { setInput, zoneRadius } from './sim.js';

export function updateBots(state) {
  const all = Object.values(state.players);
  const zr = zoneRadius(state.time);
  for (const p of all) {
    if (!p.isBot || !p.alive) continue;

    if (!p.ai || state.time >= p.ai.nextThink) {
      p.ai = {
        jitter: (Math.random() - 0.5) * 0.3,
        strafe: Math.random() < 0.5 ? -1 : 1,
        nextThink: state.time + 0.4 + Math.random() * 0.6,
      };
    }

    // alvo: o jogador vivo mais próximo
    let target = null;
    let best = Infinity;
    for (const q of all) {
      if (q === p || !q.alive) continue;
      const d = Math.hypot(q.x - p.x, q.y - p.y);
      if (d < best) {
        best = d;
        target = q;
      }
    }

    let mx = 0;
    let my = 0;
    let aim = p.aim;
    let shoot = false;

    if (target) {
      const dx = target.x - p.x;
      const dy = target.y - p.y;
      const d = Math.hypot(dx, dy) || 1;
      const ux = dx / d;
      const uy = dy / d;
      aim = Math.atan2(dy, dx) + p.ai.jitter;
      if (d > 320) {
        mx = ux;
        my = uy;
      } else if (d < 180) {
        mx = -ux;
        my = -uy;
      }
      mx += -uy * p.ai.strafe * 0.7;
      my += ux * p.ai.strafe * 0.7;
      // rajadas: atira ~50% do tempo quando o alvo está ao alcance
      shoot = d < 650 && Math.sin(state.time * 2.5 + Number(p.id)) > 0;
    }

    // fugir da tempestade
    const zd = Math.hypot(p.x - C.zone.cx, p.y - C.zone.cy);
    if (zd > zr - 80) {
      mx = ((C.zone.cx - p.x) / zd) * 1.5;
      my = ((C.zone.cy - p.y) / zd) * 1.5;
    }

    setInput(state, p.id, { mx, my, aim, shoot });
  }
}
