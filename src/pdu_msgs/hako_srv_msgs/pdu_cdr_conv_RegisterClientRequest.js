import { RegisterClientRequest } from './pdu_jstype_RegisterClientRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduRegisterClientRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { RegisterClientRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.dummy);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { RegisterClientRequest } dst
     * @returns { RegisterClientRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.dummy = reader.read_uint32();
        return dst;
    }

    /**
     * @param { RegisterClientRequest } src
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
     * @returns { RegisterClientRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new RegisterClientRequest());
    }
}
