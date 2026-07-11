import { AddTwoIntsResponse } from './pdu_jstype_AddTwoIntsResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduAddTwoIntsResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { AddTwoIntsResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int64(src.sum);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { AddTwoIntsResponse } dst
     * @returns { AddTwoIntsResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.sum = reader.read_int64();
        return dst;
    }

    /**
     * @param { AddTwoIntsResponse } src
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
     * @returns { AddTwoIntsResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new AddTwoIntsResponse());
    }
}
