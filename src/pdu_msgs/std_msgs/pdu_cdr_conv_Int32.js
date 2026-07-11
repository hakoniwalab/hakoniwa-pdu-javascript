import { Int32 } from './pdu_jstype_Int32.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduInt32Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Int32 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int32(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Int32 } dst
     * @returns { Int32 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_int32();
        return dst;
    }

    /**
     * @param { Int32 } src
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
     * @returns { Int32 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Int32());
    }
}
