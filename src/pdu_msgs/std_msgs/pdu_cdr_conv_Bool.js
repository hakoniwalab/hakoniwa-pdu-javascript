import { Bool } from './pdu_jstype_Bool.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduBoolConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Bool } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Bool } dst
     * @returns { Bool }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_bool();
        return dst;
    }

    /**
     * @param { Bool } src
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
     * @returns { Bool }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Bool());
    }
}
