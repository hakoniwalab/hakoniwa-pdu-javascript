import { HakoGLOBAL_POSITION_INT } from './pdu_jstype_HakoGLOBAL_POSITION_INT.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoGLOBAL_POSITION_INTConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoGLOBAL_POSITION_INT } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.time_boot_ms);
        writer.write_int32(src.lat);
        writer.write_int32(src.lon);
        writer.write_int32(src.alt);
        writer.write_int32(src.relative_alt);
        writer.write_int16(src.vx);
        writer.write_int16(src.vy);
        writer.write_int16(src.vz);
        writer.write_uint16(src.hdg);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoGLOBAL_POSITION_INT } dst
     * @returns { HakoGLOBAL_POSITION_INT }
     */
    static cdr_body_to_js(reader, dst) {
        dst.time_boot_ms = reader.read_uint32();
        dst.lat = reader.read_int32();
        dst.lon = reader.read_int32();
        dst.alt = reader.read_int32();
        dst.relative_alt = reader.read_int32();
        dst.vx = reader.read_int16();
        dst.vy = reader.read_int16();
        dst.vz = reader.read_int16();
        dst.hdg = reader.read_uint16();
        return dst;
    }

    /**
     * @param { HakoGLOBAL_POSITION_INT } src
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
     * @returns { HakoGLOBAL_POSITION_INT }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoGLOBAL_POSITION_INT());
    }
}
