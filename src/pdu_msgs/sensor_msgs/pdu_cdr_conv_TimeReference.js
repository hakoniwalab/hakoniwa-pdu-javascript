import { TimeReference } from './pdu_jstype_TimeReference.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduTimeReferenceConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { TimeReference } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduTimeConverter.to_cdr_body(writer, src.time_ref);
        writer.write_string(src.source);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { TimeReference } dst
     * @returns { TimeReference }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduTimeConverter.cdr_body_to_js(reader, dst.time_ref);
        dst.source = reader.read_string();
        return dst;
    }

    /**
     * @param { TimeReference } src
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
     * @returns { TimeReference }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new TimeReference());
    }
}
