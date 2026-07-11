import { DroneTakeOffRequest } from './pdu_jstype_DroneTakeOffRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduDroneTakeOffRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneTakeOffRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float64(src.alt_m);
        writer.write_string(src.drone_name);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneTakeOffRequest } dst
     * @returns { DroneTakeOffRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.alt_m = reader.read_float64();
        dst.drone_name = reader.read_string();
        return dst;
    }

    /**
     * @param { DroneTakeOffRequest } src
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
     * @returns { DroneTakeOffRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneTakeOffRequest());
    }
}
