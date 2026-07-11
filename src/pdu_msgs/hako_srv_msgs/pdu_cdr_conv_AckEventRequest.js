import { AckEventRequest } from './pdu_jstype_AckEventRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduAckEventRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { AckEventRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.name);
        writer.write_uint32(src.event_code);
        writer.write_uint32(src.result_code);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { AckEventRequest } dst
     * @returns { AckEventRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.name = reader.read_string();
        dst.event_code = reader.read_uint32();
        dst.result_code = reader.read_uint32();
        return dst;
    }

    /**
     * @param { AckEventRequest } src
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
     * @returns { AckEventRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new AckEventRequest());
    }
}
