// WebSocket mínimo (RFC 6455), sem dependências externas.
// Suporta mensagens de texto, fragmentação, ping/pong e fechamento.
// Só aceita quadros mascarados do cliente (como exige o protocolo).

import { createHash } from 'node:crypto';
import { EventEmitter } from 'node:events';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const MAX_PAYLOAD = 4096; // nossas mensagens recebidas são JSON minúsculos
const MAX_BUFFER = 64 * 1024;

export class WSConnection extends EventEmitter {
  constructor(socket) {
    super();
    this.socket = socket;
    this.buf = Buffer.alloc(0);
    this.fragments = [];
    this.fragOpcode = 0;
    this.fragSize = 0;
    this.closed = false;
    this.finished = false;
    socket.setNoDelay(true);
    socket.setKeepAlive(true, 30000);
    socket.on('data', (d) => this._onData(d));
    socket.on('close', () => this._finish());
    socket.on('error', () => this._finish());
  }

  get bufferedAmount() {
    return this.socket.writableLength;
  }

  send(text) {
    this._write(0x1, Buffer.from(text, 'utf8'));
  }

  close(code = 1000) {
    if (this.closed) return;
    this.closed = true;
    const payload = Buffer.alloc(2);
    payload.writeUInt16BE(code, 0);
    this._write(0x8, payload);
    this.socket.end();
    // se o cliente não responder, derruba depois de um tempo
    setTimeout(() => this.socket.destroy(), 2000).unref();
  }

  _finish() {
    if (this.finished) return;
    this.finished = true;
    this.closed = true;
    this.emit('close');
  }

  _write(opcode, payload) {
    if (this.finished || this.socket.destroyed) return;
    if (this.closed && opcode !== 0x8) return;
    const len = payload.length;
    let header;
    if (len < 126) {
      header = Buffer.from([0x80 | opcode, len]);
    } else if (len < 65536) {
      header = Buffer.alloc(4);
      header[0] = 0x80 | opcode;
      header[1] = 126;
      header.writeUInt16BE(len, 2);
    } else {
      header = Buffer.alloc(10);
      header[0] = 0x80 | opcode;
      header[1] = 127;
      header.writeUInt32BE(0, 2);
      header.writeUInt32BE(len, 6);
    }
    this.socket.write(Buffer.concat([header, payload]));
  }

  _onData(chunk) {
    if (this.closed) return;
    this.buf = this.buf.length ? Buffer.concat([this.buf, chunk]) : chunk;
    if (this.buf.length > MAX_BUFFER) return this.close(1009);
    while (!this.closed) {
      const frame = this._parseFrame();
      if (!frame) break;
      this._handleFrame(frame);
    }
  }

  _parseFrame() {
    const b = this.buf;
    if (b.length < 2) return null;
    const fin = (b[0] & 0x80) !== 0;
    const opcode = b[0] & 0x0f;
    const masked = (b[1] & 0x80) !== 0;
    let len = b[1] & 0x7f;
    let off = 2;
    if (len === 126) {
      if (b.length < 4) return null;
      len = b.readUInt16BE(2);
      off = 4;
    } else if (len === 127) {
      if (b.length < 10) return null;
      if (b.readUInt32BE(2) !== 0) {
        this.close(1009);
        return null;
      }
      len = b.readUInt32BE(6);
      off = 10;
    }
    if (len > MAX_PAYLOAD) {
      this.close(1009);
      return null;
    }
    if (!masked) {
      this.close(1002);
      return null;
    }
    if (b.length < off + 4 + len) return null;
    const mask = b.subarray(off, off + 4);
    const payload = Buffer.allocUnsafe(len);
    for (let i = 0; i < len; i++) payload[i] = b[off + 4 + i] ^ mask[i & 3];
    this.buf = b.subarray(off + 4 + len);
    return { fin, opcode, payload };
  }

  _handleFrame({ fin, opcode, payload }) {
    if (opcode >= 0x8) {
      // quadros de controle
      if (!fin || payload.length > 125) return this.close(1002);
      if (opcode === 0x8) return this.close(1000);
      if (opcode === 0x9) return this._write(0xa, payload);
      return; // pong: ignora
    }
    if (opcode === 0x0) {
      if (!this.fragments.length) return this.close(1002);
    } else if (opcode === 0x1 || opcode === 0x2) {
      if (this.fragments.length) return this.close(1002);
      this.fragOpcode = opcode;
    } else {
      return this.close(1002);
    }
    this.fragSize += payload.length;
    if (this.fragSize > MAX_PAYLOAD) return this.close(1009);
    this.fragments.push(payload);
    if (!fin) return;
    const msg = Buffer.concat(this.fragments);
    this.fragments = [];
    this.fragSize = 0;
    if (this.fragOpcode === 0x1) this.emit('message', msg.toString('utf8'));
  }
}

function reject(socket, status, text) {
  socket.write(`HTTP/1.1 ${status} ${text}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`);
  socket.destroy();
}

// Use no evento 'upgrade' do http.Server.
// allowedOrigins: array de origens permitidas, ou null para aceitar qualquer uma.
// Requisições sem cabeçalho Origin (não vindas de navegador) são aceitas.
export function handleUpgrade(req, socket, head, { allowedOrigins, onConnection }) {
  const key = req.headers['sec-websocket-key'];
  const upgrade = String(req.headers.upgrade || '').toLowerCase();
  if (upgrade !== 'websocket' || !key || req.headers['sec-websocket-version'] !== '13') {
    return reject(socket, 400, 'Bad Request');
  }
  const origin = req.headers.origin;
  if (allowedOrigins && origin && !allowedOrigins.includes(origin)) {
    return reject(socket, 403, 'Forbidden');
  }
  const accept = createHash('sha1').update(key + GUID).digest('base64');
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
      'Upgrade: websocket\r\n' +
      'Connection: Upgrade\r\n' +
      `Sec-WebSocket-Accept: ${accept}\r\n\r\n`,
  );
  const conn = new WSConnection(socket);
  onConnection(conn);
  if (head && head.length) conn._onData(head);
}
