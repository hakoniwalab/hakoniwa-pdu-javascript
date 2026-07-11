import { Accel } from './pdu_jstype_Accel.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduAccelConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Accel } src
     */
    static to_cdr_body(writer, src) {
        PduVector3Converter.to_cdr_body(writer, src.linear);
        PduVector3Converter.to_cdr_body(writer, src.angular);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Accel } dst
     * @returns { Accel }
     */
    static cdr_body_to_js(reader, dst) {
        PduVector3Converter.cdr_body_to_js(reader, dst.linear);
        PduVector3Converter.cdr_body_to_js(reader, dst.angular);
        return dst;
    }

    /**
     * @param { Accel } src
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
     * @returns { Accel }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Accel());
    }
}
