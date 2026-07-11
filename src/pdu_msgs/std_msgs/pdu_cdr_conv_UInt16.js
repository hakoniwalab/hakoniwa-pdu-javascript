import { UInt16 } from './pdu_jstype_UInt16.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduUInt16Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { UInt16 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint16(src.data);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { UInt16 } dst
     * @returns { UInt16 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = reader.read_uint16();
        return dst;
    }

    /**
     * @param { UInt16 } src
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
     * @returns { UInt16 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new UInt16());
    }
}
