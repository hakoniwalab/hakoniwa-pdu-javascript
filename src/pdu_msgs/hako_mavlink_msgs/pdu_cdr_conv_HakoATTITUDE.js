import { HakoATTITUDE } from './pdu_jstype_HakoATTITUDE.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoATTITUDEConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoATTITUDE } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.time_boot_ms);
        writer.write_float32(src.roll);
        writer.write_float32(src.pitch);
        writer.write_float32(src.yaw);
        writer.write_float32(src.rollspeed);
        writer.write_float32(src.pitchspeed);
        writer.write_float32(src.yawspeed);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoATTITUDE } dst
     * @returns { HakoATTITUDE }
     */
    static cdr_body_to_js(reader, dst) {
        dst.time_boot_ms = reader.read_uint32();
        dst.roll = reader.read_float32();
        dst.pitch = reader.read_float32();
        dst.yaw = reader.read_float32();
        dst.rollspeed = reader.read_float32();
        dst.pitchspeed = reader.read_float32();
        dst.yawspeed = reader.read_float32();
        return dst;
    }

    /**
     * @param { HakoATTITUDE } src
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
     * @returns { HakoATTITUDE }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoATTITUDE());
    }
}
