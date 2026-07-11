import { HakoCan } from './pdu_jstype_HakoCan.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { HakoCanBody } from '../can_msgs/pdu_jstype_HakoCanBody.js';
import { PduHakoCanBodyConverter } from '../can_msgs/pdu_cdr_conv_HakoCanBody.js';
import { HakoCanHead } from '../can_msgs/pdu_jstype_HakoCanHead.js';
import { PduHakoCanHeadConverter } from '../can_msgs/pdu_cdr_conv_HakoCanHead.js';


export class PduHakoCanConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoCan } src
     */
    static to_cdr_body(writer, src) {
        PduHakoCanHeadConverter.to_cdr_body(writer, src.head);
        PduHakoCanBodyConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoCan } dst
     * @returns { HakoCan }
     */
    static cdr_body_to_js(reader, dst) {
        PduHakoCanHeadConverter.cdr_body_to_js(reader, dst.head);
        PduHakoCanBodyConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { HakoCan } src
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
     * @returns { HakoCan }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoCan());
    }
}
