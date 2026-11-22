// Entrada do jogador: teclado + mouse no computador, dois joysticks virtuais no celular.
// read() devolve { mx, my, aim, shoot } no mesmo formato que sim.setInput() espera.

const STICK_RADIUS = 60;
const GAME_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space',
]);

export class Input {
  constructor(canvas) {
    this.enabled = false;
    this.keys = new Set();
    this.mouse = { x: 0, y: 0, down: false, seen: false };
    this.touchMode = false;
    this.moveStick = null; // { id, ox, oy, x, y }
    this.aimStick = null;
    this.lastAim = 0;

    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      this.touchMode = false;
      this.keys.add(e.code);
      if (GAME_KEYS.has(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.mouse.down = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.seen = true;
    });
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) this.mouse.down = true;
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouse.down = false;
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    const opts = { passive: false };
    canvas.addEventListener('touchstart', (e) => this.#touchStart(e), opts);
    canvas.addEventListener('touchmove', (e) => this.#touchMove(e), opts);
    canvas.addEventListener('touchend', (e) => this.#touchEnd(e), opts);
    canvas.addEventListener('touchcancel', (e) => this.#touchEnd(e), opts);
  }

  #touchStart(e) {
    e.preventDefault();
    if (!this.enabled) return;
    this.touchMode = true;
    for (const t of e.changedTouches) {
      const stick = { id: t.identifier, ox: t.clientX, oy: t.clientY, x: t.clientX, y: t.clientY };
      if (t.clientX < window.innerWidth / 2) {
        if (!this.moveStick) this.moveStick = stick;
      } else if (!this.aimStick) {
        this.aimStick = stick;
      }
    }
  }

  #touchMove(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      for (const s of [this.moveStick, this.aimStick]) {
        if (s && s.id === t.identifier) {
          s.x = t.clientX;
          s.y = t.clientY;
        }
      }
    }
  }

  #touchEnd(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (this.moveStick && this.moveStick.id === t.identifier) this.moveStick = null;
      if (this.aimStick && this.aimStick.id === t.identifier) this.aimStick = null;
    }
  }

  reset() {
    this.keys.clear();
    this.mouse.down = false;
    this.moveStick = null;
    this.aimStick = null;
  }

  // cx, cy: posição do jogador na tela (a câmera o mantém no centro)
  read(cx, cy) {
    let mx = 0;
    let my = 0;
    let shoot = false;
    let aim = this.lastAim;

    if (this.touchMode) {
      const m = this.moveStick;
      if (m) {
        let dx = (m.x - m.ox) / STICK_RADIUS;
        let dy = (m.y - m.oy) / STICK_RADIUS;
        const len = Math.hypot(dx, dy);
        if (len > 1) {
          dx /= len;
          dy /= len;
        }
        if (len > 0.15) {
          mx = dx;
          my = dy;
        }
      }
      const a = this.aimStick;
      if (a) {
        const dx = a.x - a.ox;
        const dy = a.y - a.oy;
        if (Math.hypot(dx, dy) > 12) {
          aim = Math.atan2(dy, dx);
          shoot = true;
        }
      }
    } else {
      const k = this.keys;
      mx = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
      my = (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) - (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0);
      if (this.mouse.seen) aim = Math.atan2(this.mouse.y - cy, this.mouse.x - cx);
      shoot = this.mouse.down || k.has('Space');
    }

    this.lastAim = aim;
    return { mx, my, aim, shoot };
  }
}

export const STICK = { radius: STICK_RADIUS };
