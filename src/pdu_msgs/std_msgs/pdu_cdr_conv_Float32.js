import { Float32 } from './pdu_jstype_Float32.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduFloat32Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Float32 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float32(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Float32 } dst
     * @returns { Float32 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_float32();
        return dst;
    }

    /**
     * @param { Float32 } src
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
     * @returns { Float32 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Float32());
    }
}
