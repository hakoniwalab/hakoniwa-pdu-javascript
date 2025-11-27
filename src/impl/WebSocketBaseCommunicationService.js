import { ICommunicationService } from './ICommunicationService.js';
import {
  DataPacket,
  PDU_DATA,
  PDU_DATA_RPC_REQUEST,
  PDU_DATA_RPC_REPLY,
  DECLARE_PDU_FOR_READ,
  DECLARE_PDU_FOR_WRITE,
  REQUEST_PDU_READ,
  REGISTER_RPC_CLIENT
} from './DataPacket.js';

/**
 * WebSocket共通: クライアント/サーバの共有ロジック（ブラウザ/Node両対応）
 */
export class WebSocketBaseCommunicationService extends ICommunicationService {
  /**
   * @param {string} version - "v1" or "v2"
   */
  constructor(version = 'v1') {
    super();
    console.log(`[INFO] WebSocketBaseCommunicationService created with version: ${version}`);

    /** @type {any|null} WebSocketインスタンス（ブラウザ or ws） */
    this.websocket = null;
    /** @type {string} */
    this.uri = '';
    /** @type {boolean} */
    this.service_enabled = false;
    /** @type {any|null} CommunicationBuffer（set_buffer/push_recv/set_rpc_channel_buffer等を想定） */
    this.comm_buffer = null;
    /** @type {any|null} 受信タスク(未使用:互換のため残置) */
    this.receive_task = null;
    /** @type {string} */
    this.version = version;
    /** @type {((packet: DataPacket) => Promise<void>) | null} */
    this.handler = null;
    /** @type {((packet: DataPacket) => Promise<void>) | null} */
    this.data_handler = null;

    /** @type {any} チャンネル設定（getPduInfoByChannelId(robot, channel_id) を持つ想定） */
    this.config = null;
  }

  set_channel_config(config) {
    this.config = config;
  }

  is_service_enabled() {
    return this.service_enabled && this.websocket !== null;
  }

  // ---------- 環境吸収ヘルパ ----------

  _isBrowser(ws) {
    return typeof window !== 'undefined' && typeof ws?.addEventListener === 'function';
  }

  /** イベント購読（戻り値は解除関数） */
  _onCompat(ws, type, handler) {
    if (this._isBrowser(ws)) {
      // ブラウザ: message は ev.data
      const wrap = (ev) => handler(type === 'message' ? ev?.data : ev);
      ws.addEventListener(type, wrap);
      return () => ws.removeEventListener(type, wrap);
    } else {
      // Node(ws)
      ws.on(type, handler);
      return () => ws.off?.(type, handler);
    }
  }

  /** send互換（ブラウザは同期、Node(ws)はcallback対応） */
  _sendCompat(ws, data) {
    try {
      // readyState: 1=OPEN
      if (!ws || ws.readyState !== 1) return Promise.reject(new Error('socket not open'));

      // ブラウザの WebSocket#send は同期で例外throw、Node(ws) は send(data, cb)
      if (this._isBrowser(ws) || ws.send.length < 2) {
        ws.send(data);
        console.log('[WSBase] Data sent (sync)');
        return Promise.resolve();
      } else {
        return new Promise((resolve, reject) => {
          ws.send(data, (err) => (err ? reject(err) : resolve()));
        });
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /** 受信データを ArrayBuffer に正規化 */
  async _toArrayBuffer(data) {
    if (data == null) return null;
    if (data instanceof ArrayBuffer) return data;
    if (ArrayBuffer.isView(data)) {
      // Buffer/Uint8Array/DataView等
      return data.buffer.slice(data.byteOffset, data.byteLength + data.byteOffset);
    }
    // Blob（ブラウザ）
    if (typeof Blob !== 'undefined' && data instanceof Blob) {
      return await data.arrayBuffer();
    }
    // string → バイナリ想定なら符号化
    if (typeof data === 'string') {
      return new TextEncoder().encode(data).buffer;
    }
    // それ以外は受け取らない
    return null;
  }

  // ---------- 送信 ----------

  _pack_pdu(robot_name, channel_id, pdu_data) {
    const packet = new DataPacket(robot_name, channel_id, pdu_data);
    return packet.encode(this.version, PDU_DATA);
  }

  async send_data(robot_name, channel_id, pdu_data) {
    if (!this.is_service_enabled() || !this.websocket) {
      console.warn('[WSBase] send_data: WebSocket not connected');
      return false;
    }
    try {
      const encoded = this._pack_pdu(robot_name, channel_id, pdu_data);
      await this._sendCompat(this.websocket, encoded);
      return true;
    } catch (e) {
      console.error(`[WSBase] Failed to send data: ${e?.message || e}`);
      return false;
    }
  }

  async send_binary(raw_data) {
    if (!this.is_service_enabled() || !this.websocket) {
      console.warn('[WSBase] send_binary: WebSocket not connected');
      return false;
    }
    try {
      console.log('[WSBase] Sending binary data...');
      await this._sendCompat(this.websocket, raw_data);
      return true;
    } catch (e) {
      console.error(`[WSBase] Failed to send binary data: ${e?.message || e}`);
      return false;
    }
  }

  // ---------- 受信ループ ----------

  _start_receive_loop(websocket) {
    const ws = websocket || this.websocket;
    if (!ws) return;

    const loopFn = this.version === 'v1'
      ? this._receive_loop_v1.bind(this)
      : this._receive_loop_v2.bind(this);

    const disposeMessage = this._onCompat(ws, 'message', async (message) => {
      try {
        const arrayBuffer = await this._toArrayBuffer(message);
        if (!arrayBuffer) return;
        loopFn(arrayBuffer, ws);
      } catch (e) {
        console.error('[WSBase] message handling error:', e);
      }
    });

    const disposeClose = this._onCompat(ws, 'close', () => {
      this.service_enabled = false;
      console.log('[WSBase] socket closed');
      try { disposeMessage?.(); } catch {}
      try { disposeClose?.(); } catch {}
      try { disposeError?.(); } catch {}
    });

    const disposeError = this._onCompat(ws, 'error', (err) => {
      console.error('[WSBase] socket error:', err?.message || err);
    });
  }

  async _receive_loop_v1(message, _ws) {
      const packet = DataPacket.decode(message, this.version);
      if (!packet || !this.comm_buffer) return;
      console.log(`[WSBase] Received packet: robot=${packet.robot_name}, channel_id=${packet.channel_id}, req_type=${packet.meta_pdu?.meta_request_type}`);
      try {
        const pduInfo = this.config?.getPduInfoByChannelId?.(packet.robot_name, packet.channel_id);
        if (pduInfo) {
          this.comm_buffer.set_buffer(packet.robot_name, pduInfo.org_name, packet.body_data);
        } else {
          console.warn(`[WSBase] Received PDU_DATA for unknown channel ID: ${packet.channel_id}`);
        }
        if (this.data_handler) await this.data_handler(packet);
      } catch (e) {
        console.error(`[WSBase] Receive loop failed: ${e?.message || e}`);
      }

  }

  async _receive_loop_v2(message, _ws) {
    console.log('[WSBase] _receive_loop_v2');
    try {
      const packet = DataPacket.decode(message, this.version);
      if (!packet || !this.comm_buffer) return;
      console.log(`[WSBase] Received packet: robot=${packet.robot_name}, channel_id=${packet.channel_id}, req_type=${packet.meta_pdu?.meta_request_type}`);
      const req_type = packet.meta_pdu.meta_request_type;

      if (req_type === PDU_DATA) {
        // PDUデータをコミュニケーションバッファへ
        const pduInfo = this.config?.getPduInfoByChannelId?.(packet.robot_name, packet.channel_id);
        if (pduInfo) {
          this.comm_buffer.set_buffer(packet.robot_name, pduInfo.org_name, packet.body_data);
        } else {
          console.warn(`[WSBase] Received PDU_DATA for unknown channel ID: ${packet.channel_id}`);
        }
        if (this.data_handler) await this.data_handler(packet);

      } else if (req_type === PDU_DATA_RPC_REQUEST || req_type === PDU_DATA_RPC_REPLY) {
        console.log(`[WSBase] Received RPC ${req_type === PDU_DATA_RPC_REQUEST ? 'REQUEST' : 'REPLY'} for channel ID: ${packet.channel_id}`);
        this.comm_buffer.set_rpc_channel_buffer(packet.robot_name, packet.channel_id, packet.get_pdu_data());
      } else if (
        req_type === DECLARE_PDU_FOR_READ ||
        req_type === DECLARE_PDU_FOR_WRITE ||
        req_type === REQUEST_PDU_READ ||
        req_type === REGISTER_RPC_CLIENT
      ) {
        if (this.handler) await this.handler(packet);

      } else {
        console.warn(`[WSBase] Unknown message type: ${req_type}`);
      }
    } catch (e) {
      console.error(`[WSBase] Receive loop failed: ${e?.message || e}`);
    }
  }

  register_event_handler(handler) {
    this.handler = handler;
  }

  register_data_event_handler(handler) {
    this.data_handler = handler;
  }
}
