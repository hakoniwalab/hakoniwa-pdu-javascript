import { DisturbanceUserCustom } from './pdu_jstype_DisturbanceUserCustom.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduDisturbanceUserCustomConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DisturbanceUserCustom } src
     */
    static to_cdr_body(writer, src) {
        writer.write_sequence_length(src.data);
        for (const elem of src.data) {
            writer.write_float64(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DisturbanceUserCustom } dst
     * @returns { DisturbanceUserCustom }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = Array.from({ length: reader.read_uint32() }, () => reader.read_float64());
        return dst;
    }

    /**
     * @param { DisturbanceUserCustom } src
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
     * @returns { DisturbanceUserCustom }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DisturbanceUserCustom());
    }
}
