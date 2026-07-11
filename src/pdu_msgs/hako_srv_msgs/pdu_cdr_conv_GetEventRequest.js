import { GetEventRequest } from './pdu_jstype_GetEventRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduGetEventRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GetEventRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.name);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GetEventRequest } dst
     * @returns { GetEventRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.name = reader.read_string();
        return dst;
    }

    /**
     * @param { GetEventRequest } src
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
     * @returns { GetEventRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GetEventRequest());
    }
}
