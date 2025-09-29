import { MetaPdu } from '../pdu_msgs/hako_msgs/pdu_jstype_MetaPdu.js';
import { jsToPdu_MetaPdu, pduToJs_MetaPdu } from '../pdu_msgs/hako_msgs/pdu_conv_MetaPdu.js';

// Constants from the Python implementation
export const HAKO_META_MAGIC = 0x48414B4F; // "HAKO"
export const HAKO_META_VER = 0x0002;
export const META_FIXED_SIZE = 176;
export const TOTAL_PDU_META_SIZE = 24 + META_FIXED_SIZE; // PduMetaData.PDU_META_DATA_SIZE is 24

// Magic numbers for control packets
export const DECLARE_PDU_FOR_READ = 0x52455044;   // "REPD"
export const DECLARE_PDU_FOR_WRITE = 0x57505044;  // "WPPD"
export const REQUEST_PDU_READ = 0x57505045;
export const PDU_DATA = 0x42555043;   // "CPUB"
export const REGISTER_RPC_CLIENT = 0x43505244;   // "DRPC"
export const PDU_DATA_RPC_REQUEST = 0x43505243;   // "CRPC"
export const PDU_DATA_RPC_REPLY = 0x43505253;   // "SRPC"

/**
 * Represents a data packet for Hakoniwa PDU communication,
 * handling both v1 and v2 wire protocols.
 */
export class DataPacket {

    /**
     * @param {string} robot_name
     * @param {number} channel_id
     * @param {ArrayBuffer} body_data
     * @param {MetaPdu | null} meta
     */
    constructor(robot_name = "", channel_id = 0, body_data = null, { meta = null } = {}) {
        if (meta) {
            /** @type {MetaPdu} */
            this.meta_pdu = meta;
            this.robot_name = meta.robot_name;
            this.channel_id = meta.channel_id;
            /** @type {ArrayBuffer} */
            this.body_data = body_data || new ArrayBuffer(0);
        } else {
            this.meta_pdu = new MetaPdu();
            this.robot_name = robot_name;
            this.channel_id = channel_id;
            this.meta_pdu.robot_name = robot_name;
            this.meta_pdu.channel_id = channel_id;
            this.body_data = body_data || new ArrayBuffer(0);
        }
        this.set_hako_time_usec(0);
        this.set_asset_time_usec(0);
        this.set_real_time_usec(0);
    }

    set_hako_time_usec(time_usec) {
        this.meta_pdu.hako_time_us = time_usec;
    }
    set_asset_time_usec(time_usec) {
        this.meta_pdu.asset_time_us = time_usec;
    }
    set_real_time_usec(time_usec) {
        this.meta_pdu.real_time_us = time_usec;
    }

    /**
     * Encodes the packet into a binary buffer based on the specified wire protocol version.
     * @param {string} version - "v1" or "v2"
     * @param {number | null} meta_request_type
     * @returns {ArrayBuffer}
     */
    encode(version = "v1", meta_request_type = null) {
        if (version === "v1") {
            return this._encode_v1();
        } else {
            return this._encode_v2(meta_request_type);
        }
    }

    _encode_v2(meta_request_type) {
        this.meta_pdu.robot_name = this.robot_name;
        this.meta_pdu.channel_id = this.channel_id;

        const body_len = this.body_data.byteLength;
        this.meta_pdu.magicno = HAKO_META_MAGIC;
        this.meta_pdu.version = HAKO_META_VER;
        this.meta_pdu.flags = 0; // not supported
        this.meta_pdu.meta_request_type = meta_request_type || 0;
        this.meta_pdu.body_len = body_len;
        this.meta_pdu.total_len = (META_FIXED_SIZE - 4) + body_len;

        const encoded_header = jsToPdu_MetaPdu(this.meta_pdu);
        if (encoded_header.byteLength !== TOTAL_PDU_META_SIZE) {
             console.error(`Unexpected meta size: ${encoded_header.byteLength}`);
        }

        const final_buffer = new ArrayBuffer(encoded_header.byteLength + this.body_data.byteLength);
        const final_view = new Uint8Array(final_buffer);
        final_view.set(new Uint8Array(encoded_header), 0);
        final_view.set(new Uint8Array(this.body_data), encoded_header.byteLength);

        return final_buffer;
    }

    _encode_v1() {
        const robot_name_bytes = new TextEncoder().encode(this.robot_name);
        const name_len = robot_name_bytes.length;
        const header_len = 4 + name_len + 4; // name_len(4) + name + channel_id(4)
        
        const total_len = 4 + header_len + this.body_data.byteLength;
        const buffer = new ArrayBuffer(total_len);
        const view = new DataView(buffer);
        const uint8_view = new Uint8Array(buffer);
        let offset = 0;

        view.setUint32(offset, header_len, true); offset += 4;
        view.setUint32(offset, name_len, true); offset += 4;
        uint8_view.set(robot_name_bytes, offset); offset += name_len;
        view.setUint32(offset, this.channel_id, true); offset += 4;
        uint8_view.set(new Uint8Array(this.body_data), offset);

        return buffer;
    }

    /**
     * Decodes a binary buffer into a DataPacket instance.
     * @param {ArrayBuffer} data 
     * @param {string} version 
     * @returns {DataPacket | null}
     */
    static decode(data, version = "v1") {
        if (data.byteLength < 12) {
            console.error("[ERROR] Data too short");
            return null;
        }
        if (version === "v1") {
            return DataPacket._decode_v1(data);
        } else {
            return DataPacket._decode_v2(data);
        }
    }

    static _decode_v2(frame) {
        if (!frame || frame.byteLength < TOTAL_PDU_META_SIZE) {
            return null;
        }
        const meta = pduToJs_MetaPdu(frame.slice(0, TOTAL_PDU_META_SIZE));

        if (!meta || meta.version !== HAKO_META_VER || meta.magicno !== HAKO_META_MAGIC) {
            return null;
        }

        const body = frame.slice(TOTAL_PDU_META_SIZE);

        return new DataPacket(meta.robot_name, meta.channel_id, body, { meta: meta });
    }

    static _decode_v1(data) {
        const view = new DataView(data);
        let offset = 0;

        const header_len = view.getUint32(offset, true); offset += 4;
        const name_len = view.getUint32(offset, true); offset += 4;

        if (offset + name_len + 4 > data.byteLength) {
            console.error("[ERROR] Invalid robot name length");
            return null;
        }

        const robot_name_bytes = new Uint8Array(data, offset, name_len);
        const robot_name = new TextDecoder().decode(robot_name_bytes);
        offset += name_len;

        const channel_id = view.getUint32(offset, true); offset += 4;

        const body = data.slice(offset);

        return new DataPacket(robot_name, channel_id, body);
    }
}
