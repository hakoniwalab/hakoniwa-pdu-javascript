import { SimTime } from './pdu_jstype_SimTime.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduSimTimeConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SimTime } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint64(src.time_usec);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SimTime } dst
     * @returns { SimTime }
     */
    static cdr_body_to_js(reader, dst) {
        dst.time_usec = reader.read_uint64();
        return dst;
    }

    /**
     * @param { SimTime } src
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
     * @returns { SimTime }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SimTime());
    }
}
