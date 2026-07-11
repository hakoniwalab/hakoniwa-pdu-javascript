import { AddTwoIntsRequest } from './pdu_jstype_AddTwoIntsRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduAddTwoIntsRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { AddTwoIntsRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int64(src.a);
        writer.write_int64(src.b);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { AddTwoIntsRequest } dst
     * @returns { AddTwoIntsRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.a = reader.read_int64();
        dst.b = reader.read_int64();
        return dst;
    }

    /**
     * @param { AddTwoIntsRequest } src
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
     * @returns { AddTwoIntsRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new AddTwoIntsRequest());
    }
}
