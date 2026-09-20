// Browser-facing core API: WebSocket PDU transport and PDU conversion.
// Node-only WebSocket server and RPC helpers intentionally stay in `index.js`.
export { BrowserPduManager as PduManager } from './browser/BrowserPduManager.js';
export { PduEncoding } from './PduEncoding.js';
export { ICommunicationService } from './impl/ICommunicationService.js';
export { WebSocketCommunicationService } from './impl/WebSocketCommunicationService.js';
export { PduChannelConfig } from './impl/PduChannelConfig.js';
export { BrowserPduConvertor as PduConvertor } from './browser/BrowserPduConvertor.js';
export * as pdu_utils from './pdu_msgs/pdu_utils.js';
export * as pdu_constants from './impl/DataPacket.js';
