import { JoinRequest } from './pdu_jstype_JoinRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduJoinRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { JoinRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.name);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { JoinRequest } dst
     * @returns { JoinRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.name = reader.read_string();
        return dst;
    }

    /**
     * @param { JoinRequest } src
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
     * @returns { JoinRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new JoinRequest());
    }
}
