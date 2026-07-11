import { Time } from './pdu_jstype_Time.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduTimeConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Time } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int32(src.sec);
        writer.write_uint32(src.nanosec);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Time } dst
     * @returns { Time }
     */
    static cdr_body_to_js(reader, dst) {
        dst.sec = reader.read_int32();
        dst.nanosec = reader.read_uint32();
        return dst;
    }

    /**
     * @param { Time } src
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
     * @returns { Time }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Time());
    }
}
