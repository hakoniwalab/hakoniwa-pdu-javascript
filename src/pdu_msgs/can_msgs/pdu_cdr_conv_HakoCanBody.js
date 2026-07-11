import { HakoCanBody } from './pdu_jstype_HakoCanBody.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoCanBodyConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoCanBody } src
     */
    static to_cdr_body(writer, src) {
        {
            const values = src.data;
            for (let i = 0; i < 8; i++) {
                writer.write_uint8(i < values.length ? values[i] : 0);
            }
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoCanBody } dst
     * @returns { HakoCanBody }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = Array.from({ length: 8 }, () => reader.read_uint8());
        return dst;
    }

    /**
     * @param { HakoCanBody } src
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
     * @returns { HakoCanBody }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoCanBody());
    }
}
