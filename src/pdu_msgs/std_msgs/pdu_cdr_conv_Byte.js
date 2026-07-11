import { Byte } from './pdu_jstype_Byte.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduByteConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Byte } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint8(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Byte } dst
     * @returns { Byte }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_uint8();
        return dst;
    }

    /**
     * @param { Byte } src
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
     * @returns { Byte }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Byte());
    }
}
