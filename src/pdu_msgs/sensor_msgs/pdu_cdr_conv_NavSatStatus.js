import { NavSatStatus } from './pdu_jstype_NavSatStatus.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduNavSatStatusConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { NavSatStatus } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int8(src.status);
        writer.write_uint16(src.service);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { NavSatStatus } dst
     * @returns { NavSatStatus }
     */
    static cdr_body_to_js(reader, dst) {
        dst.status = reader.read_int8();
        dst.service = reader.read_uint16();
        return dst;
    }

    /**
     * @param { NavSatStatus } src
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
     * @returns { NavSatStatus }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new NavSatStatus());
    }
}
