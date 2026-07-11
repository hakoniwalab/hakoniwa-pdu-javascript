import { Int16 } from './pdu_jstype_Int16.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduInt16Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Int16 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int16(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Int16 } dst
     * @returns { Int16 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_int16();
        return dst;
    }

    /**
     * @param { Int16 } src
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
     * @returns { Int16 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Int16());
    }
}
