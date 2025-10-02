import { RemotePduServiceBaseManager } from './RemotePduServiceBaseManager.js';
import * as codes from './codes.js';
import {
    REGISTER_RPC_CLIENT,
    PDU_DATA_RPC_REQUEST
} from '../impl/DataPacket.js';
import { RegisterClientRequestPacket } from '../pdu_msgs/hako_srv_msgs/pdu_jstype_RegisterClientRequestPacket.js';
import { jsToPdu_RegisterClientRequestPacket } from '../pdu_msgs/hako_srv_msgs/pdu_conv_RegisterClientRequestPacket.js';
import { pduToJs_RegisterClientResponsePacket } from '../pdu_msgs/hako_srv_msgs/pdu_conv_RegisterClientResponsePacket.js';

/**
 * Client-side implementation for remote RPC.
 */
export class RemotePduServiceClientManager extends RemotePduServiceBaseManager {
    constructor(asset_name, pdu_config_path, comm_service, uri) {
        super(asset_name, pdu_config_path, comm_service, uri);
        this.request_id = 0;
        this.service_name = null;
        this.client_name = null;
        this.timeout_msec = null;
        this.call_start_time_msec = null;
        this.request_buffer = null;
        this.poll_interval_msec = null;
    }

    async start_client_service() {
        return await super.start_service(this.uri);
    }

    /**
     * Registers this client with a remote RPC service.
     * @param {string} service_name 
     * @param {string} client_name 
     * @param {number} timeout - Timeout in seconds
     * @returns {Promise<object | null>} - The client_id object from the response, or null.
     */
    async register_client(service_name, client_name, timeout = 1.0) {
        if (!this.service_config_path) {
            throw new Error("service_config_path is not set. Call initialize_services() first.");
        }
        this.service_name = service_name;
        this.client_name = client_name;

        // The complex PDU definition merging from Python is not needed in the same way,
        // as we assume the config is pre-generated and complete.

        const packet = new RegisterClientRequestPacket();
        packet.header.request_id = 0;
        packet.header.service_name = service_name;
        packet.header.client_name = client_name;
        packet.header.opcode = 0;
        packet.header.status_poll_interval_msec = 0;
        packet.body.dummy = 0;

        const pdu_data = jsToPdu_RegisterClientRequestPacket(packet);
        const raw_data = this._build_binary(REGISTER_RPC_CLIENT, service_name, -1, pdu_data);

        if (this.comm_buffer) {
            this.comm_buffer.register_pending_rpc(service_name, client_name);
        }

        if (!await this.comm_service.send_binary(raw_data)) {
            return null;
        }

        // Wait for response
        const end_time = Date.now() + (timeout * 1000);
        let response_buffer = null;
        while (Date.now() < end_time) {
            // In Python, the response is put in the regular comm_buffer with a special name.
            // We will use service_name and client_name to identify the response.
            if (this.comm_buffer.has_rpc_packet(service_name, client_name)) {
                response_buffer = this.comm_buffer.get_rpc_packet(service_name, client_name);
                break;
            }
            await this.sleep(0.05);
        }

        if (response_buffer === null) {
            console.error("Timeout waiting for register_client response.");
            return null;
        }

        const response = pduToJs_RegisterClientResponsePacket(response_buffer);
        if (response.header.result_code !== codes.API_RESULT_CODE_OK) {
            console.error(`Failed to register client '${client_name}' to service '${service_name}': ${response.header.result_code}`);
            return null;
        }
        if (this.comm_buffer) {
            this.comm_buffer.register_rpc_channel(service_name, response.body.request_channel_id, client_name);
            this.comm_buffer.register_rpc_channel(service_name, response.body.response_channel_id, client_name);
        }
        return response.body; // This is the ClientId
    }

    /**
     * Calls a remote service with the given PDU data.
     * @param {object} client_id - The client ID object received from register_client.
     * @param {ArrayBuffer} pdu_data - The request PDU data.
     * @param {number} timeout_msec 
     * @returns {Promise<boolean>}
     */
    async call_request(client_id, pdu_data, timeout_msec) {
        if (this.request_buffer !== null) {
            throw new Error("A request is already in progress.");
        }
        this.timeout_msec = timeout_msec;
        this.call_start_time_msec = Date.now();
        
        const client_info = client_id; // In JS, client_id is the response body object
        const raw_data = this._build_binary(
            PDU_DATA_RPC_REQUEST,
            this.service_name,
            client_info.request_channel_id,
            pdu_data
        );

        if (!await this.comm_service.send_binary(raw_data)) {
            return false;
        }
        this.request_buffer = pdu_data;
        return true;
    }

    /**
     * Polls for a response event.
     * @param {object} client_id 
     * @returns {number} - An event code from codes.js (e.g., CLIENT_API_EVENT_RESPONSE_IN)
     */
    poll_response(client_id) {
        // The response is expected in the regular comm_buffer, keyed by service_name/client_name
        if (this.comm_buffer.has_rpc_packet(this.service_name, this.client_name)) {
            // In Python, peek_buffer is used. Here we just check for existence.
            // The actual data is retrieved with get_response.
            this.request_buffer = null; // Clear request buffer on response
            return codes.CLIENT_API_EVENT_RESPONSE_IN;
        }

        if (this.timeout_msec > 0) {
            if ((Date.now() - this.call_start_time_msec) > this.timeout_msec) {
                return codes.CLIENT_API_EVENT_REQUEST_TIMEOUT;
            }
        }
        return codes.CLIENT_API_EVENT_NONE;
    }

    /**
     * Retrieves the response data after poll_response indicated a response is in.
     * @param {string} service_name 
     * @param {object} client_id 
     * @returns {ArrayBuffer}
     */
    get_response(service_name, client_id) {
        const data = this.comm_buffer.get_rpc_packet(this.service_name, this.client_name);
        if (data) {
            // Unlike Python, we don't need to manage the buffer removal manually here
            // as get_buffer just returns the data. Let's assume it's consumed.
            return data;
        }
        throw new Error("No response data available. Call poll_response() first.");
    }

    // Other helper methods from the interface
    is_client_event_response_in(event) { return event === codes.CLIENT_API_EVENT_RESPONSE_IN; }
    is_client_event_timeout(event) { return event === codes.CLIENT_API_EVENT_REQUEST_TIMEOUT; }
    is_client_event_cancel_done(event) { return event === codes.CLIENT_API_EVENT_REQUEST_CANCEL_DONE; }
    is_client_event_none(event) { return event === codes.CLIENT_API_EVENT_NONE; }
}
