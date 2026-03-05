import { MetaPdu } from '../pdu_msgs/hako_msgs/pdu_jstype_MetaPdu.js';
import { jsToPdu_MetaPdu, pduToJs_MetaPdu } from '../pdu_msgs/hako_msgs/pdu_conv_MetaPdu.js';

// Constants from the Python implementation
export const HAKO_META_MAGIC = 0x48414B4F; // "HAKO"
export const HAKO_META_VER = 0x0002;
export const META_FIXED_SIZE = 176;
export const TOTAL_PDU_META_SIZE = 24 + META_FIXED_SIZE; // PduMetaData.PDU_META_DATA_SIZE is 24
// hakoniwa-pdu-endpoint v2 wire: robot_name(128) + fixed meta(176)
export const ENDPOINT_V2_HEADER_SIZE = 128 + META_FIXED_SIZE; // 304

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

    /**
     * Returns the raw PDU body payload.
     * @returns {ArrayBuffer}
     */
    get_pdu_data() {
        return this.body_data;
    }

    /**
     * Replaces the packet body payload.
     * @param {ArrayBuffer} data
     */
    set_pdu_data(data) {
        this.body_data = data;
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
        if (!frame || frame.byteLength < META_FIXED_SIZE) {
            return null;
        }

        // Accept endpoint-v2 header first (robot_name[128] + fixed meta[176]):
        // this is the format used by hakoniwa-pdu-endpoint bridge.
        let meta = DataPacket._decode_endpoint_v2_meta(frame);
        let headerSize = 0;
        if (meta) {
            headerSize = ENDPOINT_V2_HEADER_SIZE;
        }

        // Accept legacy wrapped header formats:
        // 1) legacy wrapped meta (PduMetaData + MetaPdu: 200 bytes)
        // 2) raw MetaPdu only (176 bytes)
        if (!meta && frame.byteLength >= TOTAL_PDU_META_SIZE) {
            try {
                const wrappedMeta = pduToJs_MetaPdu(frame.slice(0, TOTAL_PDU_META_SIZE));
                if (wrappedMeta && wrappedMeta.version === HAKO_META_VER && wrappedMeta.magicno === HAKO_META_MAGIC) {
                    meta = wrappedMeta;
                    headerSize = TOTAL_PDU_META_SIZE;
                }
            } catch (_) {
                // fallback to raw header parser
            }
        }

        if (!meta) {
            const rawMeta = DataPacket._decode_raw_meta_pdu(frame);
            if (!rawMeta || rawMeta.version !== HAKO_META_VER || rawMeta.magicno !== HAKO_META_MAGIC) {
                return null;
            }
            meta = rawMeta;
            headerSize = META_FIXED_SIZE;
        }

        const declaredBodyLen = Number(meta.body_len) || 0;
        const availableBodyLen = Math.max(0, frame.byteLength - headerSize);
        const bodyLen = declaredBodyLen > 0 ? Math.min(declaredBodyLen, availableBodyLen) : availableBodyLen;
        const body = frame.slice(headerSize, headerSize + bodyLen);

        return new DataPacket(meta.robot_name, meta.channel_id, body, { meta: meta });
    }

    static _decode_endpoint_v2_meta(frame) {
        if (!frame || frame.byteLength < ENDPOINT_V2_HEADER_SIZE) {
            return null;
        }
        const view = new DataView(frame, 0, ENDPOINT_V2_HEADER_SIZE);

        const robotNameBytes = new Uint8Array(frame, 0, 128);
        const zeroIndex = robotNameBytes.indexOf(0);
        const end = zeroIndex >= 0 ? zeroIndex : robotNameBytes.length;
        const robotName = new TextDecoder().decode(robotNameBytes.slice(0, end));

        const magic = view.getUint32(128, true);
        const version = view.getUint16(132, true);
        if (magic !== HAKO_META_MAGIC || version !== HAKO_META_VER) {
            return null;
        }

        const meta = new MetaPdu();
        meta.robot_name = robotName;
        meta.magicno = magic;
        meta.version = version;
        meta.flags = view.getUint32(136, true);
        meta.meta_request_type = view.getUint32(140, true);
        meta.total_len = view.getUint32(144, true);
        meta.body_len = view.getUint32(148, true);
        meta.hako_time_us = view.getBigInt64(152, true);
        meta.asset_time_us = view.getBigInt64(160, true);
        meta.real_time_us = view.getBigInt64(168, true);
        meta.channel_id = view.getUint32(176, true);
        return meta;
    }

    static _decode_raw_meta_pdu(frame) {
        if (!frame || frame.byteLength < META_FIXED_SIZE) {
            return null;
        }
        const meta = new MetaPdu();
        const view = new DataView(frame, 0, META_FIXED_SIZE);
        meta.total_len = view.getUint32(0, true);
        meta.magicno = view.getUint32(4, true);
        meta.version = view.getUint16(8, true);
        meta.flags = view.getUint16(10, true);
        meta.meta_request_type = view.getUint32(12, true);
        meta.hako_time_us = view.getBigUint64(16, true);
        meta.asset_time_us = view.getBigUint64(24, true);
        meta.real_time_us = view.getBigUint64(32, true);

        const robotNameBytes = new Uint8Array(frame, 40, 128);
        const zeroIndex = robotNameBytes.indexOf(0);
        const end = zeroIndex >= 0 ? zeroIndex : robotNameBytes.length;
        meta.robot_name = new TextDecoder().decode(robotNameBytes.slice(0, end));

        meta.channel_id = view.getInt32(168, true);
        meta.body_len = view.getUint32(172, true);
        return meta;
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
