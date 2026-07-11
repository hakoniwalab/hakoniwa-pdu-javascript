import { GetEventResponse } from './pdu_jstype_GetEventResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduGetEventResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GetEventResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.event_code);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GetEventResponse } dst
     * @returns { GetEventResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.event_code = reader.read_uint32();
        return dst;
    }

    /**
     * @param { GetEventResponse } src
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
     * @returns { GetEventResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GetEventResponse());
    }
}
