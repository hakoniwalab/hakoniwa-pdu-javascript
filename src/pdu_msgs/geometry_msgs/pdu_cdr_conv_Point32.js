import { Point32 } from './pdu_jstype_Point32.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduPoint32Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Point32 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float32(src.x);
        writer.write_float32(src.y);
        writer.write_float32(src.z);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Point32 } dst
     * @returns { Point32 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.x = reader.read_float32();
        dst.y = reader.read_float32();
        dst.z = reader.read_float32();
        return dst;
    }

    /**
     * @param { Point32 } src
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
     * @returns { Point32 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Point32());
    }
}
