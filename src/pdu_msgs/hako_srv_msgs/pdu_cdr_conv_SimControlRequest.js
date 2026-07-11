import { SimControlRequest } from './pdu_jstype_SimControlRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduSimControlRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SimControlRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.name);
        writer.write_uint32(src.op);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SimControlRequest } dst
     * @returns { SimControlRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.name = reader.read_string();
        dst.op = reader.read_uint32();
        return dst;
    }

    /**
     * @param { SimControlRequest } src
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
     * @returns { SimControlRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SimControlRequest());
    }
}
