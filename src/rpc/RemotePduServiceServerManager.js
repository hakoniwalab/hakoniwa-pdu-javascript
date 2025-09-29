import { RemotePduServiceBaseManager } from './RemotePduServiceBaseManager.js';
import { 
    DataPacket,
    DECLARE_PDU_FOR_READ,
    DECLARE_PDU_FOR_WRITE,
    REQUEST_PDU_READ,
    REGISTER_RPC_CLIENT,
    PDU_DATA_RPC_REPLY
} from '../impl/data_packet.js';
import { pdu_to_js_RegisterClientRequestPacket } from '../pdu_msgs/hako_srv_msgs/pdu_conv_RegisterClientRequestPacket.js';
import { js_to_pdu_RegisterClientResponsePacket } from '../pdu_msgs/hako_srv_msgs/pdu_conv_RegisterClientResponsePacket.js';
import { createRegisterClientResponsePacket } from '../pdu_msgs/hako_srv_msgs/pdu_jstype_RegisterClientResponsePacket.js';
import { 
    API_RESULT_CODE_OK,
    API_STATUS_DONE,
    API_RESULT_CODE_CANCELED,
    CLIENT_API_OPCODE_CANCEL,
    SERVER_API_EVENT_REQUEST_IN,
    SERVER_API_EVENT_REQUEST_CANCEL,
    SERVER_API_EVENT_NONE
} from './codes.js';

class ClientHandle {
    constructor(clientId, requestChannelId, responseChannelId, transportClientId) {
        this.client_id = clientId;
        this.request_channel_id = requestChannelId;
        this.response_channel_id = responseChannelId;
        this.transport_client_id = transportClientId;
    }
}

class ClientRegistry {
    constructor() {
        this.clients = new Map();
    }
}

export class RemotePduServiceServerManager extends RemotePduServiceBaseManager {
    constructor(asset_name, pdu_config_path, comm_service, uri) {
        super(asset_name, pdu_config_path, comm_service, uri);
        this.service_registries = new Map();
        this.current_service_name = null;
        this.current_client_name = null;
        this.request_id = 0;
        this.req_decoders = new Map();
        this._declared_read = new Map();
        this._read_index = new Map();
        
        comm_service.register_event_handler(this.handler.bind(this));
        if (typeof comm_service.register_data_event_handler === 'function') {
            comm_service.register_data_event_handler(this._on_pdu_data.bind(this));
        }
        comm_service.on_disconnect = this.on_disconnect.bind(this);
        
        this._pdu_data_handler = null;
        this.topic_service_started = false;
        this.rpc_service_started = false;
        this.pdu_for_read_handler = null;
        this.pdu_for_write_handler = null;
        this.request_pdu_read_handler = null;
    }

    async _handler_register_client(packet, transport_client_id) {
        const body_pdu_data = pdu_to_js_RegisterClientRequestPacket(packet.body_data);
        const service_name = body_pdu_data.header.service_name;
        // get_service_index is not available in JS ServiceConfig, assuming it's not critical for JS version
        // const service_id = this.service_config.get_service_index(service_name);

        if (!this.service_registries.has(service_name)) {
            this.service_registries.set(service_name, new ClientRegistry());
        }
        const registry = this.service_registries.get(service_name);

        if (registry.clients.has(body_pdu_data.header.client_name)) {
            throw new Error(`Client registry for service '${service_name}' already exists`);
        }

        const client_id = registry.clients.size;
        const request_channel_id = client_id * 2;
        const response_channel_id = client_id * 2 + 1;
        const client_handle = new ClientHandle(
            client_id,
            request_channel_id,
            response_channel_id,
            transport_client_id
        );
        registry.clients.set(body_pdu_data.header.client_name, client_handle);

        console.debug(`Registered RPC client: ${body_pdu_data.header.client_name}`);
        
        const register_client_res_packet = createRegisterClientResponsePacket();
        register_client_res_packet.header.request_id = 0;
        register_client_res_packet.header.service_name = body_pdu_data.header.service_name;
        register_client_res_packet.header.client_name = body_pdu_data.header.client_name;
        register_client_res_packet.header.result_code = API_RESULT_CODE_OK;
        register_client_res_packet.body.client_id = client_handle.client_id;
        // register_client_res_packet.body.service_id = service_id;
        register_client_res_packet.body.request_channel_id = client_handle.request_channel_id;
        register_client_res_packet.body.response_channel_id = client_handle.response_channel_id;

        const pdu_data = js_to_pdu_RegisterClientResponsePacket(register_client_res_packet);
        const raw_data = this._build_binary(
            PDU_DATA_RPC_REPLY,
            service_name,
            client_handle.response_channel_id,
            pdu_data
        );

        if (!await this.comm_service.send_binary(raw_data)) {
            throw new Error("Failed to send register client response");
        }
        console.debug(`Sent register client response: ${body_pdu_data.header.client_name}`);
    }

    register_handler_pdu_for_read(handler) {
        this.pdu_for_read_handler = handler;
    }

    register_handler_pdu_for_write(handler) {
        this.pdu_for_write_handler = handler;
    }

    register_handler_request_pdu_read(handler) {
        this.request_pdu_read_handler = handler;
    }

    async handler(packet, client_id) {
        const meta = packet.meta_pdu;
        switch (meta.meta_request_type) {
            case DECLARE_PDU_FOR_READ: {
                const robot = meta.robot_name;
                const ch = meta.channel_id;
                const key = `${robot},${ch}`;

                if (!this._declared_read.has(client_id)) {
                    this._declared_read.set(client_id, new Set());
                }
                const s = this._declared_read.get(client_id);

                if (!s.has(key)) {
                    s.add(key);
                    if (!this._read_index.has(key)) {
                        this._read_index.set(key, new Set());
                    }
                    this._read_index.get(key).add(client_id);
                    console.debug(`declared_for_read: client=${client_id} (${robot}, ${ch})`);
                }
                if (this.pdu_for_read_handler) {
                    this.pdu_for_read_handler(client_id, packet);
                }
                break;
            }
            case DECLARE_PDU_FOR_WRITE:
                console.info(`Declare PDU for write: ${packet.robot_name}, channel_id=${packet.channel_id}`);
                if (this.pdu_for_write_handler) {
                    this.pdu_for_write_handler(packet);
                }
                break;
            case REQUEST_PDU_READ: {
                const robot = meta.robot_name;
                const ch = meta.channel_id;
                if (this.request_pdu_read_handler) {
                    this.request_pdu_read_handler(client_id, packet);
                } else {
                    console.debug(`REQUEST_PDU_READ: no handler; client=${client_id} (${robot},${ch})`);
                }
                break;
            }
            case REGISTER_RPC_CLIENT:
                console.info(`Register RPC client: ${packet.robot_name}, channel_id=${packet.channel_id}`);
                await this._handler_register_client(packet, client_id);
                break;
            default:
                throw new Error("Unknown packet type");
        }
    }

    register_handler_pdu_data(handler) {
        this._pdu_data_handler = handler;
    }

    async _on_pdu_data(packet, client_id) {
        if (this._pdu_data_handler) {
            try {
                this._pdu_data_handler(client_id, packet);
            } catch (e) {
                console.warn(`pdu_data_handler raised: ${e}`);
            }
        }
    }

    on_disconnect(client_id) {
        const topics = this._declared_read.get(client_id);
        if (topics) {
            this._declared_read.delete(client_id);
            for (const key of topics) {
                const idx = this._read_index.get(key);
                if (idx) {
                    idx.delete(client_id);
                    if (idx.size === 0) {
                        this._read_index.delete(key);
                    }
                }
            }
            console.debug(`removed declarations for client=${client_id}`);
        }

        for (const [svc, registry] of this.service_registries.entries()) {
            for (const [cname, handle] of registry.clients.entries()) {
                if (handle.transport_client_id === client_id) {
                    registry.clients.delete(cname);
                    console.debug(`removed RPC client '${cname}' from service '${svc}' on disconnect`);
                }
            }
        }
    }

    async send_pdu_to(client_id, robot_name, channel_id, pdu_data) {
        try {
            return await this.comm_service.send_data_to(client_id, robot_name, channel_id, Buffer.from(pdu_data));
        } catch (e) {
            console.error(`send_pdu_to: failed to send to ${client_id} (${robot_name},${channel_id}): ${e}`);
            return false;
        }
    }

    async reply_latest_to(client_id, robot_name, channel_id) {
        if (!this.comm_buffer) {
            console.debug(`reply_latest_to: no buffer for (${robot_name},${channel_id})`);
            return false;
        }
        const pdu_name = this.comm_buffer.get_pdu_name(robot_name, channel_id);
        if (pdu_name === null || !this.comm_buffer.contains_buffer(robot_name, pdu_name)) {
            console.debug(`reply_latest_to: no buffer for (${robot_name},${channel_id})`);
            return false;
        }
        const data = this.comm_buffer.get_buffer(robot_name, pdu_name);
        return await this.send_pdu_to(client_id, robot_name, channel_id, data);
    }

    async publish_pdu(robot_name, channel_id, pdu_data) {
        const key = `${robot_name},${channel_id}`;
        const cids = Array.from(this._read_index.get(key) || new Set());
        if (cids.length === 0) {
            console.debug(`publish_pdu: no subscribers for (${robot_name}, ${channel_id})`);
            return 0;
        }

        let sent = 0;
        for (const cid of cids) {
            try {
                const ok = await this.comm_service.send_data_to(cid, robot_name, channel_id, Buffer.from(pdu_data));
                if (ok) {
                    sent++;
                } else {
                    console.warn(`publish_pdu: failed to send to ${cid} (${robot_name},${channel_id})`);
                }
            } catch (e) {
                console.error(`publish_pdu: exception sending to ${cid}: ${e}`);
            }
        }
        return sent;
    }

    async start_topic_service() {
        if (this.rpc_service_started) {
            throw new Error("Cannot start topic service after RPC service has started");
        }
        if (!this.service_config) {
            throw new Error("Services not initialized. Call initialize_services() first.");
        }
        console.info("Service PDU definitions prepared.");
        if (this.topic_service_started || !await super.start_service(this.uri)) {
            return false;
        }
        this.topic_service_started = true;
        return true;
    }

    async start_rpc_service(service_name, max_clients) {
        if (this.topic_service_started) {
            throw new Error("Cannot start RPC service after topic service has started");
        }
        if (!this.service_config) {
            throw new Error("Services not initialized. Call initialize_services() first.");
        }
        this.rpc_service_started = true;
        if (!await super.start_service(this.uri)) {
            return false;
        }
        if (!this.service_registries.has(service_name)) {
            this.service_registries.set(service_name, new ClientRegistry());
        }
        return true;
    }

    get_response_buffer(client_id, status, result_code) {
        const py_pdu_data = new this.cls_res_packet();
        py_pdu_data.header.request_id = this.request_id;
        py_pdu_data.header.service_name = this.current_service_name;
        py_pdu_data.header.client_name = this.current_client_name;
        py_pdu_data.header.status = status;
        py_pdu_data.header.processing_percentage = 100;
        py_pdu_data.header.result_code = result_code;
        console.debug(`Sending response: ${JSON.stringify(py_pdu_data)}`);
        return this.res_encoder(py_pdu_data);
    }

    async poll_request() {
        if (this.current_client_name !== null) {
            return [this.current_service_name, SERVER_API_EVENT_NONE];
        }
        for (const [service_name, registry] of this.service_registries.entries()) {
            for (const [client_name, _handle] of registry.clients.entries()) {
                if (this.comm_buffer.contains_buffer(service_name, client_name)) {
                    const raw_data = this.comm_buffer.peek_buffer(service_name, client_name);
                    const decoder = this.req_decoders.get(service_name) || this.req_decoder;
                    const request = decoder(raw_data);
                    this.current_client_name = client_name;
                    this.current_service_name = service_name;
                    this.request_id = request.header.request_id;
                    if (request.header.opcode === CLIENT_API_OPCODE_CANCEL) {
                        return [service_name, SERVER_API_EVENT_REQUEST_CANCEL];
                    }
                    return [service_name, SERVER_API_EVENT_REQUEST_IN];
                }
            }
        }
        return [null, SERVER_API_EVENT_NONE];
    }

    get_request() {
        if (
            this.current_service_name &&
            this.current_client_name &&
            this.comm_buffer.contains_buffer(this.current_service_name, this.current_client_name)
        ) {
            const raw_data = this.comm_buffer.get_buffer(this.current_service_name, this.current_client_name);
            const client_handle = this.service_registries.get(this.current_service_name).clients.get(this.current_client_name);
            return [client_handle, raw_data];
        }
        throw new Error("No response data available. Call poll_request() first.");
    }

    async put_response(client_id, pdu_data) {
        const client_handle = client_id;
        const raw_data = this._build_binary(
            PDU_DATA_RPC_REPLY,
            this.current_service_name,
            client_handle.response_channel_id,
            pdu_data
        );
        let send_ok = false;
        if (typeof this.comm_service.send_binary_to === 'function' && client_handle.transport_client_id) {
            send_ok = await this.comm_service.send_binary_to(client_handle.transport_client_id, raw_data);
        } else {
            send_ok = await this.comm_service.send_binary(raw_data);
        }

        this.current_client_name = null;
        this.current_service_name = null;
        this.request_id = null;

        return send_ok;
    }

    async put_cancel_response(client_id, pdu_data) {
        // TODO
        throw new Error("put_cancel_response is not implemented yet.");
    }

    is_server_event_request_in(event) {
        return event === SERVER_API_EVENT_REQUEST_IN;
    }

    is_server_event_cancel(event) {
        return event === SERVER_API_EVENT_REQUEST_CANCEL;
    }

    is_server_event_none(event) {
        return event === SERVER_API_EVENT_NONE;
    }
}
