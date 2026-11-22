// Configuração compartilhada entre cliente (navegador) e servidor (Node).
// Qualquer mudança aqui afeta os dois lados. Se mudar o formato das mensagens
// de rede, aumente PROTOCOL_VERSION.

export const PROTOCOL_VERSION = 1;

export const CONFIG = {
  tickRate: 30, // atualizações do servidor por segundo
  arena: { width: 1600, height: 1000 },
  player: { radius: 16, speed: 240, maxHp: 100, respawnSec: 2 },
  bullet: {
    speed: 720,
    radius: 4,
    damage: 20,
    ttl: 1.2, // segundos de vida
    cooldown: 0.18, // segundos entre tiros
    maxStep: 12, // px máximos por sub-passo (evita atravessar paredes)
  },
  // Arena dinâmica: a zona segura abre, fecha e reabre num ciclo.
  zone: {
    cx: 800,
    cy: 500,
    maxRadius: 960,
    minRadius: 260,
    holdOpen: 20, // segundos com a zona aberta
    shrink: 15, // segundos fechando
    holdClosed: 10, // segundos fechada
    grow: 5, // segundos reabrindo
    dps: 12, // dano por segundo fora da zona
  },
};
