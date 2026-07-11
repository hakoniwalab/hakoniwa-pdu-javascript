import { SystemControlRequest } from './pdu_jstype_SystemControlRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduSystemControlRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SystemControlRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.opcode);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SystemControlRequest } dst
     * @returns { SystemControlRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.opcode = reader.read_uint32();
        return dst;
    }

    /**
     * @param { SystemControlRequest } src
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
     * @returns { SystemControlRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SystemControlRequest());
    }
}
