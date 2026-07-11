import { SimControlResponse } from './pdu_jstype_SimControlResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduSimControlResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SimControlResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.status_code);
        writer.write_string(src.message);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SimControlResponse } dst
     * @returns { SimControlResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.status_code = reader.read_uint32();
        dst.message = reader.read_string();
        return dst;
    }

    /**
     * @param { SimControlResponse } src
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
     * @returns { SimControlResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SimControlResponse());
    }
}
