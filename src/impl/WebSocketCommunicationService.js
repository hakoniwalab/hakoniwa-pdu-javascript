// ★ ここでは 'ws' をトップレベル import しない！
// import WebSocket from 'ws'; // ←削除

import { WebSocketBaseCommunicationService } from './WebSocketBaseCommunicationService.js';

// 実行環境判定
function isNodeEnv() {
  return (typeof window === 'undefined') && (typeof process !== 'undefined') && !!process.versions?.node;
}

// WebSocket コンストラクタを実行時に解決
async function resolveWebSocketCtor() {
  if (isNodeEnv()) {
    // Node: 'ws' を動的 import（ブラウザバンドルから除外される）
    const mod = await import('ws');
    return mod.WebSocket || mod.default; // ws@8 以降は default
  }
  // Browser: ネイティブ WebSocket
  return window.WebSocket;
}

/**
 * WebSocket client communication service.
 */
export class WebSocketCommunicationService extends WebSocketBaseCommunicationService {
  constructor(version = 'v1') {
    super(version);
    console.log('[INFO] WebSocketCommunicationService created');
    /** @type {WebSocket|null} */
    this.websocket = null;
  }

  /**
   * Starts the client and connects to the WebSocket server.
   * @param {import('./CommunicationBuffer').CommunicationBuffer} commBuffer
   * @param {string} uri
   * @returns {Promise<boolean>}
   */
  async start_service(commBuffer, uri) {
    this.comm_buffer = commBuffer;
    this.uri = uri;

    try {
      const WS = await resolveWebSocketCtor();
      console.log(`[INFO] Connecting to WebSocket at ${uri}...`);
      this.websocket = new WS(this.uri);

      // ブラウザではバイナリを ArrayBuffer で受ける
      if (!isNodeEnv() && this.websocket && 'binaryType' in this.websocket) {
        this.websocket.binaryType = 'arraybuffer';
      }

      return await new Promise((resolve) => {
        const onOpen = () => {
          console.log('[INFO] WebSocket connected and receive loop started');
          this.service_enabled = true;
          this._start_receive_loop(this.websocket);
          cleanup();
          resolve(true);
        };
        const onError = (err) => {
          console.error(`[ERROR] Failed to connect WebSocket: ${err?.message || err}`);
          this.service_enabled = false;
          cleanup();
          resolve(false);
        };
        const onClose = () => {
          this.service_enabled = false;
          console.log('[INFO] WebSocket connection closed.');
        };

        const useAddEvent = typeof this.websocket.addEventListener === 'function';
        const cleanup = () => {
          if (!this.websocket) return;
          if (useAddEvent) {
            this.websocket.removeEventListener('open', onOpen);
            this.websocket.removeEventListener('error', onError);
          } else {
            this.websocket.off?.('open', onOpen);
            this.websocket.off?.('error', onError);
          }
        };

        if (useAddEvent) {
          this.websocket.addEventListener('open', onOpen);
          this.websocket.addEventListener('error', onError);
          this.websocket.addEventListener('close', onClose);
        } else {
          // Node(ws)
          this.websocket.on('open', onOpen);
          this.websocket.on('error', onError);
          this.websocket.on('close', onClose);
        }
      });
    } catch (e) {
      console.error(`[ERROR] Exception during WebSocket connection: ${e?.message || e}`);
      this.service_enabled = false;
      return false;
    }
  }

  /**
   * Stops the client and disconnects from the WebSocket server.
   * @returns {Promise<boolean>}
   */
  async stop_service() {
    this.service_enabled = false;
    if (this.websocket) {
      return await new Promise((resolve) => {
        const ws = this.websocket;
        const useAddEvent = typeof ws.addEventListener === 'function';
        const onClosed = () => {
          console.log('[INFO] WebSocket closed successfully.');
          if (useAddEvent) ws.removeEventListener('close', onClosed);
          else ws.off?.('close', onClosed);
          this.websocket = null;
          resolve(true);
        };
        if (useAddEvent) ws.addEventListener('close', onClosed);
        else ws.on('close', onClosed);
        try { ws.close(); } catch { /* ignore */ }
      });
    }
    return true;
  }
}
