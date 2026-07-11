import { LaserEcho } from './pdu_jstype_LaserEcho.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduLaserEchoConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { LaserEcho } src
     */
    static to_cdr_body(writer, src) {
        writer.write_sequence_length(src.echoes);
        for (const elem of src.echoes) {
            writer.write_float32(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { LaserEcho } dst
     * @returns { LaserEcho }
     */
    static cdr_body_to_js(reader, dst) {
        dst.echoes = Array.from({ length: reader.read_uint32() }, () => reader.read_float32());
        return dst;
    }

    /**
     * @param { LaserEcho } src
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
     * @returns { LaserEcho }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new LaserEcho());
    }
}
