import { HakoHeartbeat } from './pdu_jstype_HakoHeartbeat.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoHeartbeatConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoHeartbeat } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint8(src.type);
        writer.write_uint8(src.autopilot);
        writer.write_uint8(src.base_mode);
        writer.write_uint32(src.custom_mode);
        writer.write_uint8(src.system_status);
        writer.write_uint8(src.mavlink_version);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoHeartbeat } dst
     * @returns { HakoHeartbeat }
     */
    static cdr_body_to_js(reader, dst) {
        dst.type = reader.read_uint8();
        dst.autopilot = reader.read_uint8();
        dst.base_mode = reader.read_uint8();
        dst.custom_mode = reader.read_uint32();
        dst.system_status = reader.read_uint8();
        dst.mavlink_version = reader.read_uint8();
        return dst;
    }

    /**
     * @param { HakoHeartbeat } src
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
     * @returns { HakoHeartbeat }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoHeartbeat());
    }
}
