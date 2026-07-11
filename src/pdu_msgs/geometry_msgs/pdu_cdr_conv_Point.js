import { Point } from './pdu_jstype_Point.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduPointConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Point } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float64(src.x);
        writer.write_float64(src.y);
        writer.write_float64(src.z);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Point } dst
     * @returns { Point }
     */
    static cdr_body_to_js(reader, dst) {
        dst.x = reader.read_float64();
        dst.y = reader.read_float64();
        dst.z = reader.read_float64();
        return dst;
    }

    /**
     * @param { Point } src
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
     * @returns { Point }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Point());
    }
}
