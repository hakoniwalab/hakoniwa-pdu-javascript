import { CommunicationBuffer } from './impl/CommunicationBuffer.js';
import { DataPacket, DECLARE_PDU_FOR_READ, DECLARE_PDU_FOR_WRITE, PDU_DATA, REQUEST_PDU_READ } from './impl/DataPacket.js';
import { PduChannelConfig } from './impl/PduChannelConfig.js';
import { PduConvertor } from './impl/PduConvertor.js';

/**
 * PduManager is the core interface for PDU communication in the Hakoniwa simulation framework.
 */
export class PduManager {
    /**
     * @param {string} wire_version - "v1" or "v2"
     */
    constructor({ wire_version = "v1" } = {}) {
        /** @type {CommunicationBuffer | null} */
        this.comm_buffer = null;
        /** @type {import('./impl/ICommunicationService').ICommunicationService | null} */
        this.comm_service = null;
        /** @type {PduChannelConfig | null} */
        this.pdu_config = null;
        /** @type {PduConvertor | null} */
        this.pdu_convertor = null;

        this.b_is_initialized = false;
        this.b_last_known_service_state = false;
        this.wire_version = wire_version;
        console.log(`[INFO] PduManager created with wire version: ${this.wire_version}`);
    }

    /**
     * Initializes the PDU manager.
     * @param {string} config_path - Path to the JSON file defining the PDU channel configuration.
     * @param {import('./impl/ICommunicationService').ICommunicationService} comm_service - An instance of a communication service.
     */
    async initialize(config_path, comm_service) {
        if (!comm_service) {
            throw new Error("CommService is null or undefined");
        }

        this.pdu_config = await PduChannelConfig.load(config_path);
        comm_service.set_channel_config(this.pdu_config);

        this.comm_buffer = new CommunicationBuffer(this.pdu_config);
        this.comm_service = comm_service;
        
        // In JS, the path to offset files is not needed as conversion logic is in generated code.
        // We pass an empty string for API consistency.
        this.pdu_convertor = new PduConvertor("", this.pdu_config);

        this.b_is_initialized = true;
        console.log("[INFO] PduManager initialized");
    }

    is_service_enabled() {
        if (!this.b_is_initialized || !this.comm_service) {
            console.error("[ERROR] PduManager is not initialized or CommService is None");
            return false;
        }
        const current_state = this.comm_service.is_service_enabled();
        this.b_last_known_service_state = current_state;
        return current_state;
    }

    async start_service(uri = "") {
        if (!this.b_is_initialized || !this.comm_service) {
            console.error("[ERROR] PduManager is not initialized or CommService is None");
            return false;
        }
        if (this.comm_service.is_service_enabled()) {
            console.log("[INFO] Service is already running");
            return false;
        }
        const result = await this.comm_service.start_service(this.comm_buffer, uri);
        this.b_last_known_service_state = result;
        if (result) {
            console.log(`[INFO] Service started successfully at ${uri}`);
        } else {
            console.error("[ERROR] Failed to start service");
        }
        return result;
    }

    async stop_service() {
        if (!this.b_is_initialized || !this.comm_service) {
            return false;
        }
        const result = await this.comm_service.stop_service();
        this.b_last_known_service_state = !result;
        return result;
    }

    get_pdu_channel_id(robot_name, pdu_name) {
        return this.comm_buffer.get_pdu_channel_id(robot_name, pdu_name);
    }

    get_pdu_size(robot_name, pdu_name) {
        return this.comm_buffer.get_pdu_size(robot_name, pdu_name);
    }

    async flush_pdu_raw_data(robot_name, pdu_name, pdu_raw_data) {
        if (!this.is_service_enabled() || !this.comm_service) {
            return false;
        }
        const channel_id = this.comm_buffer.get_pdu_channel_id(robot_name, pdu_name);
        if (channel_id < 0) {
            return false;
        }

        if (this.wire_version === "v1") {
            return await this.comm_service.send_data(robot_name, channel_id, pdu_raw_data);
        } else {
            const raw_data = this._build_binary("v2", PDU_DATA, robot_name, channel_id, pdu_raw_data);
            return await this.comm_service.send_binary(raw_data);
        }
    }

    read_pdu_raw_data(robot_name, pdu_name) {
        if (!this.is_service_enabled()) {
            return null;
        }
        return this.comm_buffer.get_buffer(robot_name, pdu_name);
    }

    async request_pdu_read(robot_name, pdu_name, timeout = 1000) {
        if (!this.is_service_enabled() || !this.comm_service) {
            return null;
        }
        const channel_id = this.comm_buffer.get_pdu_channel_id(robot_name, pdu_name);
        if (channel_id < 0) {
            return null;
        }

        if (this.wire_version === "v1") {
            const req_data = new ArrayBuffer(4);
            new DataView(req_data).setUint32(0, REQUEST_PDU_READ, true);
            if (!await this.comm_service.send_data(robot_name, channel_id, req_data)) {
                return null;
            }
        } else {
            const raw_data = this._build_binary("v2", REQUEST_PDU_READ, robot_name, channel_id, null);
            if (!await this.comm_service.send_binary(raw_data)) {
                return null;
            }
        }

        // Wait for buffer to be filled
        const end_time = Date.now() + timeout;
        while (Date.now() < end_time) {
            if (this.comm_buffer.contains_buffer(robot_name, pdu_name)) {
                return this.comm_buffer.get_buffer(robot_name, pdu_name);
            }
            await new Promise(resolve => setTimeout(resolve, 50)); // sleep 50ms
        }
        return null; // timeout
    }

    async declare_pdu_for_read(robot_name, pdu_name) {
        return await this._declare_pdu(robot_name, pdu_name, true);
    }

    async declare_pdu_for_write(robot_name, pdu_name) {
        return await this._declare_pdu(robot_name, pdu_name, false);
    }

    async declare_pdu_for_readwrite(robot_name, pdu_name) {
        const read_result = await this.declare_pdu_for_read(robot_name, pdu_name);
        const write_result = await this.declare_pdu_for_write(robot_name, pdu_name);
        return read_result && write_result;
    }

    async _declare_pdu(robot_name, pdu_name, is_read) {
        if (!this.is_service_enabled()) {
            console.warn("[WARN] Service is not enabled");
            return false;
        }
        const channel_id = this.comm_buffer.get_pdu_channel_id(robot_name, pdu_name);
        if (channel_id < 0) {
            console.warn(`[WARN] Unknown PDU: ${robot_name}/${pdu_name}`);
            return false;
        }

        const meta_request_type = is_read ? DECLARE_PDU_FOR_READ : DECLARE_PDU_FOR_WRITE;
        if (this.wire_version === "v1") {
            const meta_request_type_binary_data = new ArrayBuffer(4);
            new DataView(meta_request_type_binary_data).setUint32(0, meta_request_type, true);
            const raw_data = this._build_binary("v1", meta_request_type, robot_name, channel_id, meta_request_type_binary_data);
            return await this.comm_service.send_binary(raw_data);
        } else {
            const raw_data = this._build_binary("v2", meta_request_type, robot_name, channel_id, null);
            return await this.comm_service.send_binary(raw_data);
        }
    }

    _build_binary(version, meta_request_type, robot_name, channel_id, pdu_data) {
        //console.log(`[DEBUG] Building binary packet: type=${meta_request_type}, robot=${robot_name}, channel=${channel_id}, pdu_data_length=${pdu_data ? pdu_data.byteLength : 0}`);
        const packet = new DataPacket(robot_name, channel_id, pdu_data);
        return packet.encode(version, meta_request_type);
    }
}
