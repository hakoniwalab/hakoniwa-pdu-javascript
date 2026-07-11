import { UInt32 } from './pdu_jstype_UInt32.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduUInt32Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { UInt32 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { UInt32 } dst
     * @returns { UInt32 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_uint32();
        return dst;
    }

    /**
     * @param { UInt32 } src
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
     * @returns { UInt32 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new UInt32());
    }
}
