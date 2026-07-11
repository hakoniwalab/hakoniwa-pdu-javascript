import { Header } from './pdu_jstype_Header.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduHeaderConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Header } src
     */
    static to_cdr_body(writer, src) {
        PduTimeConverter.to_cdr_body(writer, src.stamp);
        writer.write_string(src.frame_id);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Header } dst
     * @returns { Header }
     */
    static cdr_body_to_js(reader, dst) {
        PduTimeConverter.cdr_body_to_js(reader, dst.stamp);
        dst.frame_id = reader.read_string();
        return dst;
    }

    /**
     * @param { Header } src
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
     * @returns { Header }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Header());
    }
}
