import { HakoCmdHeader } from './pdu_jstype_HakoCmdHeader.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoCmdHeaderConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoCmdHeader } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.request);
        writer.write_bool(src.result);
        writer.write_int32(src.result_code);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoCmdHeader } dst
     * @returns { HakoCmdHeader }
     */
    static cdr_body_to_js(reader, dst) {
        dst.request = reader.read_bool();
        dst.result = reader.read_bool();
        dst.result_code = reader.read_int32();
        return dst;
    }

    /**
     * @param { HakoCmdHeader } src
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
     * @returns { HakoCmdHeader }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoCmdHeader());
    }
}
