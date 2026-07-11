import { HakoAHRS2 } from './pdu_jstype_HakoAHRS2.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoAHRS2Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoAHRS2 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float32(src.roll);
        writer.write_float32(src.pitch);
        writer.write_float32(src.yaw);
        writer.write_float32(src.altitude);
        writer.write_int32(src.lat);
        writer.write_int32(src.lng);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoAHRS2 } dst
     * @returns { HakoAHRS2 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.roll = reader.read_float32();
        dst.pitch = reader.read_float32();
        dst.yaw = reader.read_float32();
        dst.altitude = reader.read_float32();
        dst.lat = reader.read_int32();
        dst.lng = reader.read_int32();
        return dst;
    }

    /**
     * @param { HakoAHRS2 } src
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
     * @returns { HakoAHRS2 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoAHRS2());
    }
}
