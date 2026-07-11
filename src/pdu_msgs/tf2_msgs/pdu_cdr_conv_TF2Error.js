import { TF2Error } from './pdu_jstype_TF2Error.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduTF2ErrorConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { TF2Error } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint8(src.error);
        writer.write_string(src.error_string);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { TF2Error } dst
     * @returns { TF2Error }
     */
    static cdr_body_to_js(reader, dst) {
        dst.error = reader.read_uint8();
        dst.error_string = reader.read_string();
        return dst;
    }

    /**
     * @param { TF2Error } src
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
     * @returns { TF2Error }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new TF2Error());
    }
}
