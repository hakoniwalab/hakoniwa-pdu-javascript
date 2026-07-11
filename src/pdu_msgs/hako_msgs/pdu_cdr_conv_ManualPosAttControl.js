import { ManualPosAttControl } from './pdu_jstype_ManualPosAttControl.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Twist } from '../geometry_msgs/pdu_jstype_Twist.js';
import { PduTwistConverter } from '../geometry_msgs/pdu_cdr_conv_Twist.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduManualPosAttControlConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ManualPosAttControl } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.do_operation);
        PduTwistConverter.to_cdr_body(writer, src.posatt);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ManualPosAttControl } dst
     * @returns { ManualPosAttControl }
     */
    static cdr_body_to_js(reader, dst) {
        dst.do_operation = reader.read_bool();
        PduTwistConverter.cdr_body_to_js(reader, dst.posatt);
        return dst;
    }

    /**
     * @param { ManualPosAttControl } src
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
     * @returns { ManualPosAttControl }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ManualPosAttControl());
    }
}
