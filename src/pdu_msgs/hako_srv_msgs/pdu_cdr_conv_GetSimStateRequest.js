import { GetSimStateRequest } from './pdu_jstype_GetSimStateRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduGetSimStateRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GetSimStateRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.name);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GetSimStateRequest } dst
     * @returns { GetSimStateRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.name = reader.read_string();
        return dst;
    }

    /**
     * @param { GetSimStateRequest } src
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
     * @returns { GetSimStateRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GetSimStateRequest());
    }
}
