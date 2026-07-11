import { HakoSystemTime } from './pdu_jstype_HakoSystemTime.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoSystemTimeConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoSystemTime } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint64(src.time_unix_usec);
        writer.write_uint64(src.time_boot_ms);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoSystemTime } dst
     * @returns { HakoSystemTime }
     */
    static cdr_body_to_js(reader, dst) {
        dst.time_unix_usec = reader.read_uint64();
        dst.time_boot_ms = reader.read_uint64();
        return dst;
    }

    /**
     * @param { HakoSystemTime } src
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
     * @returns { HakoSystemTime }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoSystemTime());
    }
}
