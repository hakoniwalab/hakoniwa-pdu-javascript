import { AckEventResponse } from './pdu_jstype_AckEventResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduAckEventResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { AckEventResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.ack_code);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { AckEventResponse } dst
     * @returns { AckEventResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.ack_code = reader.read_uint32();
        return dst;
    }

    /**
     * @param { AckEventResponse } src
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
     * @returns { AckEventResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new AckEventResponse());
    }
}
