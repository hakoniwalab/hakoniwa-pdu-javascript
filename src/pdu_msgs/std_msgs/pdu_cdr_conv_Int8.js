import { Int8 } from './pdu_jstype_Int8.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduInt8Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Int8 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int8(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Int8 } dst
     * @returns { Int8 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_int8();
        return dst;
    }

    /**
     * @param { Int8 } src
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
     * @returns { Int8 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Int8());
    }
}
