import { DroneLandResponse } from './pdu_jstype_DroneLandResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduDroneLandResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneLandResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.ok);
        writer.write_string(src.message);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneLandResponse } dst
     * @returns { DroneLandResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.ok = reader.read_bool();
        dst.message = reader.read_string();
        return dst;
    }

    /**
     * @param { DroneLandResponse } src
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
     * @returns { DroneLandResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneLandResponse());
    }
}
