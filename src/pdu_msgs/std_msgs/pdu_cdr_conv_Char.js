import { Char } from './pdu_jstype_Char.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduCharConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Char } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint8(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Char } dst
     * @returns { Char }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_uint8();
        return dst;
    }

    /**
     * @param { Char } src
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
     * @returns { Char }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Char());
    }
}
