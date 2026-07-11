import { Float64 } from './pdu_jstype_Float64.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduFloat64Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Float64 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float64(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Float64 } dst
     * @returns { Float64 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_float64();
        return dst;
    }

    /**
     * @param { Float64 } src
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
     * @returns { Float64 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Float64());
    }
}
