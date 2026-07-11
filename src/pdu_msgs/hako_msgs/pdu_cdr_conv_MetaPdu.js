import { MetaPdu } from './pdu_jstype_MetaPdu.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduMetaPduConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MetaPdu } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.total_len);
        writer.write_uint32(src.magicno);
        writer.write_uint16(src.version);
        writer.write_uint16(src.flags);
        writer.write_uint32(src.meta_request_type);
        writer.write_uint64(src.hako_time_us);
        writer.write_uint64(src.asset_time_us);
        writer.write_uint64(src.real_time_us);
        writer.write_string(src.robot_name);
        writer.write_int32(src.channel_id);
        writer.write_uint32(src.body_len);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MetaPdu } dst
     * @returns { MetaPdu }
     */
    static cdr_body_to_js(reader, dst) {
        dst.total_len = reader.read_uint32();
        dst.magicno = reader.read_uint32();
        dst.version = reader.read_uint16();
        dst.flags = reader.read_uint16();
        dst.meta_request_type = reader.read_uint32();
        dst.hako_time_us = reader.read_uint64();
        dst.asset_time_us = reader.read_uint64();
        dst.real_time_us = reader.read_uint64();
        dst.robot_name = reader.read_string();
        dst.channel_id = reader.read_int32();
        dst.body_len = reader.read_uint32();
        return dst;
    }

    /**
     * @param { MetaPdu } src
     * @returns {ArrayBuffer}
     */
    static to_cdr(src) {
        const writer = new PduCdrWriter();
        writer.write_encapsulation();
        this.to_cdr_body(writer, src);
        return writer.get_buf();
    }

    /**
     * @param {ArrayBuffer|ArrayBufferView} cdrPayload
     * @returns { MetaPdu }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MetaPdu());
    }
}
