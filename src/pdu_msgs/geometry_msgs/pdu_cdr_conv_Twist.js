import { Twist } from './pdu_jstype_Twist.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduTwistConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Twist } src
     */
    static to_cdr_body(writer, src) {
        PduVector3Converter.to_cdr_body(writer, src.linear);
        PduVector3Converter.to_cdr_body(writer, src.angular);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Twist } dst
     * @returns { Twist }
     */
    static cdr_body_to_js(reader, dst) {
        PduVector3Converter.cdr_body_to_js(reader, dst.linear);
        PduVector3Converter.cdr_body_to_js(reader, dst.angular);
        return dst;
    }

    /**
     * @param { Twist } src
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
     * @returns { Twist }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Twist());
    }
}
