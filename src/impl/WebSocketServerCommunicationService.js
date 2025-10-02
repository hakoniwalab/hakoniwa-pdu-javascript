// import { WebSocketServer } from 'ws'; // ←使わない（ブラウザバンドル回避）
import { WebSocketBaseCommunicationService } from './WebSocketBaseCommunicationService.js';

function isNodeEnv() {
  return (typeof window === 'undefined') && (typeof process !== 'undefined') && !!process.versions?.node;
}

async function resolveWsServerCtor() {
  if (!isNodeEnv()) {
    throw new Error('WebSocketServerCommunicationService is only available in Node.js runtime.');
  }
  const mod = await import('ws'); // ESM: package.json に "type": "module" が必要
  // ws@8+: Server は named export。環境差吸収。
  return mod.WebSocketServer || mod.Server || mod.default?.Server;
}

/**
 * WebSocket server communication service (単一クライアント想定)
 */
export class WebSocketServerCommunicationService extends WebSocketBaseCommunicationService {
  constructor(version = 'v1') {
    super(version);
    /** @type {any | null} */
    this.server = null;
    console.log('[INFO] WebSocketServerCommunicationService created');
  }

  /**
   * Start WebSocket server
   * @param {import('./CommunicationBuffer').CommunicationBuffer} commBuffer
   * @param {string} uri e.g. "ws://localhost:8773" or "ws://0.0.0.0:8773/ws"
   * @returns {Promise<boolean>}
   */
  async start_service(commBuffer, uri) {
    if (!isNodeEnv()) {
      throw new Error('start_service() is not supported in browsers. Use the client service instead.');
    }

    this.comm_buffer = commBuffer;
    this.uri = uri;

    const u = new URL(uri);
    const host = u.hostname || '0.0.0.0';
    const port = Number(u.port || 0);
    const path = u.pathname && u.pathname !== '/' ? u.pathname : undefined; // ws は path を受け取れる
    // ws サーバのオプション（必要に応じて調整）
    const wsOptions = {
      host,
      port,
      path,
      // 安全・互換
      perMessageDeflate: false,
      clientTracking: true,
      maxPayload: 10 * 1024 * 1024 // 10MB
    };

    try {
      const WSServerCtor = await resolveWsServerCtor();
      this.server = new WSServerCtor(wsOptions);

      return await new Promise((resolve) => {
        const onListening = () => {
          console.log(`[INFO] WebSocket server started at ${host}:${port}${path ? path : ''}`);
          this.service_enabled = true;
          resolve(true);
        };
        const onConnection = (ws, req) => {
          // 1クライアント限定：すでに接続中なら新規を閉じる
          if (this.websocket) {
            console.warn('[WARN] Another client tried to connect. Closing new connection (single-client mode).');
            try { ws.close(); } catch {}
            return;
          }
          // 受信フォーマット：Base 側で ArrayBuffer に正規化するが、念のため
          if (typeof ws.binaryType === 'string') ws.binaryType = 'arraybuffer';
          this._client_handler(ws, req);
        };
        const onError = (err) => {
          console.error(`[ERROR] Failed to start WebSocket server: ${err?.message || err}`);
          this.service_enabled = false;
          resolve(false);
        };

        this.server.on('listening', onListening);
        this.server.on('connection', onConnection);
        this.server.on('error', onError);
      });
    } catch (e) {
      console.error(`[ERROR] Exception during server startup: ${e?.message || e}`);
      this.service_enabled = false;
      return false;
    }
  }

  /**
   * Handle a client connection (single client)
   * @private
   */
  _client_handler(websocket /*, req */) {
    console.log('[INFO] Client connected.');
    this.websocket = websocket;
    // 受信ループ開始（Base 側がブラウザ/Nodeの差異を吸収）
    this._start_receive_loop(this.websocket);

    this.websocket.on('close', () => {
      console.log('[INFO] Client disconnected.');
      this.websocket = null; // 次のクライアントを受け入れ可能に
    });
  }

  /**
   * Stop server
   * @returns {Promise<boolean>}
   */
  async stop_service() {
    this.service_enabled = false;

    if (this.websocket) {
      try { this.websocket.close(); } catch {}
      this.websocket = null;
    }

    if (this.server) {
      return await new Promise((resolve) => {
        try {
          this.server.close(() => {
            console.log('[INFO] WebSocket server stopped.');
            this.server = null;
            resolve(true);
          });
        } catch {
          this.server = null;
          resolve(true);
        }
      });
    }
    return true;
  }
}
