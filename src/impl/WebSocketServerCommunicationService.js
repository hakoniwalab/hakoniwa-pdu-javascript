// import { WebSocketServer } from 'ws'; // ←削除！
// import { parse } from 'url';          // ←削除！

import { WebSocketBaseCommunicationService } from './WebSocketBaseCommunicationService.js';

function isNodeEnv() {
  return (typeof window === 'undefined') && (typeof process !== 'undefined') && !!process.versions?.node;
}

async function resolveWsServerCtor() {
  if (!isNodeEnv()) {
    throw new Error('WebSocketServerCommunicationService is only available in Node.js runtime.');
  }
  const mod = await import('ws');
  // ws@8 以降は default に WebSocket クラス、Server は named export
  return mod.WebSocketServer || mod.Server || mod.default?.Server;
}

/**
 * WebSocket server communication service.
 * This implementation allows only one client to be connected at a time.
 */
export class WebSocketServerCommunicationService extends WebSocketBaseCommunicationService {
  constructor(version = 'v1') {
    super(version);
    /** @type {any | null} */
    this.server = null;
    console.log('[INFO] WebSocketServerCommunicationService created');
  }

  /**
   * Starts the WebSocket server.
   * @param {import('./CommunicationBuffer').CommunicationBuffer} commBuffer
   * @param {string} uri e.g. "ws://localhost:8773"
   * @returns {Promise<boolean>}
   */
  async start_service(commBuffer, uri) {
    if (!isNodeEnv()) {
      throw new Error('start_service() is not supported in browsers. Use the client service instead.');
    }

    this.comm_buffer = commBuffer;
    this.uri = uri;

    // URL は Node/ブラウザ両対応（ただしここは Node 想定）
    const u = new URL(uri);
    const host = u.hostname || '0.0.0.0';
    const port = Number(u.port || 0);

    try {
      const WSServerCtor = await resolveWsServerCtor();
      this.server = new WSServerCtor({ host, port });

      return await new Promise((resolve) => {
        this.server.on('listening', () => {
          console.log(`[INFO] WebSocket server started at ${host}:${port}`);
          this.service_enabled = true;
          resolve(true);
        });

        this.server.on('connection', (ws) => {
          this._client_handler(ws);
        });

        this.server.on('error', (err) => {
          console.error(`[ERROR] Failed to start WebSocket server: ${err?.message || err}`);
          this.service_enabled = false;
          resolve(false);
        });
      });
    } catch (e) {
      console.error(`[ERROR] Exception during server startup: ${e?.message || e}`);
      this.service_enabled = false;
      return false;
    }
  }

  /**
   * Handles a new client connection.
   * @private
   * @param {any} websocket  // 型参照に ws を使わないことでブラウザバンドルを回避
   */
  _client_handler(websocket) {
    if (this.websocket) {
      console.warn('[WARN] Another client tried to connect. Closing new connection as only one client is allowed.');
      try { websocket.close(); } catch {}
      return;
    }

    console.log('[INFO] Client connected.');
    this.websocket = websocket;
    this._start_receive_loop(this.websocket);

    this.websocket.on('close', () => {
      console.log('[INFO] Client disconnected.');
      this.websocket = null; // Allow a new client to connect
    });
  }

  /**
   * Stops the WebSocket server.
   * @returns {Promise<boolean>}
   */
  async stop_service() {
    this.service_enabled = false;

    // Close the active client connection if it exists
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
