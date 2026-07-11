import { Empty } from './pdu_jstype_Empty.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduEmptyConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Empty } src
     */
    static to_cdr_body(writer, src) {
        return;
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Empty } dst
     * @returns { Empty }
     */
    static cdr_body_to_js(reader, dst) {
        return dst;
        return dst;
    }

    /**
     * @param { Empty } src
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
     * @returns { Empty }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Empty());
    }
}
