import { Int64 } from './pdu_jstype_Int64.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduInt64Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Int64 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int64(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Int64 } dst
     * @returns { Int64 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_int64();
        return dst;
    }

    /**
     * @param { Int64 } src
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
     * @returns { Int64 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Int64());
    }
}
