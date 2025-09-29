import { ICommunicationService } from './ICommunicationService.js';
import { DataPacket, PDU_DATA, PDU_DATA_RPC_REQUEST, PDU_DATA_RPC_REPLY, DECLARE_PDU_FOR_READ, DECLARE_PDU_FOR_WRITE, REQUEST_PDU_READ, REGISTER_RPC_CLIENT } from './DataPacket.js';
import { pduToJs_ServiceRequestHeader } from '../pdu_msgs/hako_srv_msgs/pdu_conv_ServiceRequestHeader.js';
import { pduToJs_ServiceResponseHeader } from '../pdu_msgs/hako_srv_msgs/pdu_conv_ServiceResponseHeader.js';

/**
 * Base class for WebSocket communication, containing common logic for clients and servers.
 */
export class WebSocketBaseCommunicationService extends ICommunicationService {
    /**
     * @param {string} version - "v1" or "v2"
     */
    constructor(version = "v1") {
        super();
        console.log(`[INFO] WebSocketBaseCommunicationService created with version: ${version}`);
        /** @type {import('ws').WebSocket | null} */
        this.websocket = null;
        this.uri = "";
        this.service_enabled = false;
        /** @type {import('./CommunicationBuffer').CommunicationBuffer | null} */
        this.comm_buffer = null;
        /** @type {NodeJS.Timeout | null} */
        this.receive_task = null;
        this.version = version;
        /** @type {((packet: DataPacket) => Promise<void>) | null} */
        this.handler = null;
        /** @type {((packet: DataPacket) => Promise<void>) | null} */
        this.data_handler = null;
    }

    set_channel_config(config) {
        this.config = config;
    }

    is_service_enabled() {
        return this.service_enabled && this.websocket !== null;
    }

    _pack_pdu(robot_name, channel_id, pdu_data) {
        const packet = new DataPacket(robot_name, channel_id, pdu_data);
        return packet.encode(this.version, PDU_DATA);
    }

    async send_data(robot_name, channel_id, pdu_data) {
        if (!this.is_service_enabled() || !this.websocket) {
            console.warn("WebSocket not connected");
            return false;
        }
        try {
            const encoded = this._pack_pdu(robot_name, channel_id, pdu_data);
            await this.websocket.send(encoded);
            return true;
        } catch (e) {
            console.error(`Failed to send data: ${e}`);
            return false;
        }
    }

    async send_binary(raw_data) {
        if (!this.is_service_enabled() || !this.websocket) {
            console.warn("WebSocket not connected");
            return false;
        }
        try {
            await new Promise((resolve, reject) => {
                this.websocket.send(raw_data, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            return true;
        } catch (e) {
            console.error(`Failed to send binary data: ${e}`);
            return false;
        }
    }

    _start_receive_loop(websocket) {
        const ws = websocket || this.websocket;
        if (!ws) return;

        const loopFn = this.version === 'v1' ? this._receive_loop_v1.bind(this) : this._receive_loop_v2.bind(this);
        
        ws.on('message', (message) => {
            // Convert Node.js Buffer to ArrayBuffer
            const arrayBuffer = message.buffer.slice(message.byteOffset, message.byteOffset + message.byteLength);
            loopFn(arrayBuffer, ws);
        });

        ws.on('close', () => {
            console.log("WebSocket connection closed.");
            this.service_enabled = false;
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error: ${error}`);
        });
    }

    _receive_loop_v1(message, ws) {
        // Not implemented in detail, following Python example
        console.warn("_receive_loop_v1 is not fully implemented.");
    }

    async _receive_loop_v2(message, ws) {
        try {
            const packet = DataPacket.decode(message, this.version);
            if (!packet || !this.comm_buffer) {
                return;
            }

            const req_type = packet.meta_pdu.meta_request_type;

            if (req_type === PDU_DATA) {
                const pduInfo = this.config.getPduInfoByChannelId(packet.robot_name, packet.channel_id);
                if (pduInfo) {
                    this.comm_buffer.set_buffer(packet.robot_name, pduInfo.org_name, packet.body_data);
                } else {
                    console.warn(`Received PDU_DATA for unknown channel ID: ${packet.channel_id}`);
                }

                if (this.data_handler) {
                    await this.data_handler(packet);
                }
            } else if (req_type === PDU_DATA_RPC_REQUEST) {
                const header = pduToJs_ServiceRequestHeader(packet.get_pdu_data());
                this.comm_buffer.put_rpc_packet(header.service_name, header.client_name, packet.get_pdu_data());
            } else if (req_type === PDU_DATA_RPC_REPLY) {
                const header = pduToJs_ServiceResponseHeader(packet.get_pdu_data());
                this.comm_buffer.put_rpc_packet(header.service_name, header.client_name, packet.get_pdu_data());
            } else if ([DECLARE_PDU_FOR_READ, DECLARE_PDU_FOR_WRITE, REQUEST_PDU_READ, REGISTER_RPC_CLIENT].includes(req_type)) {
                if (this.handler) {
                    await this.handler(packet);
                }
            } else {
                console.warn(`Unknown message type: ${req_type}`);
            }
        } catch (e) {
            console.error(`Receive loop failed: ${e}`);
        }
    }

    register_event_handler(handler) {
        this.handler = handler;
    }

    register_data_event_handler(handler) {
        this.data_handler = handler;
    }
}
