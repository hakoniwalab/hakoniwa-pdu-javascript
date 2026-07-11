import { SystemControlResponse } from './pdu_jstype_SystemControlResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduSystemControlResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SystemControlResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.status_code);
        writer.write_string(src.message);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SystemControlResponse } dst
     * @returns { SystemControlResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.status_code = reader.read_uint32();
        dst.message = reader.read_string();
        return dst;
    }

    /**
     * @param { SystemControlResponse } src
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
     * @returns { SystemControlResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SystemControlResponse());
    }
}
