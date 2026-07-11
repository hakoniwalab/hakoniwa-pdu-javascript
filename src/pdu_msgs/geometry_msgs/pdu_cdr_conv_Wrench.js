import { Wrench } from './pdu_jstype_Wrench.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduWrenchConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Wrench } src
     */
    static to_cdr_body(writer, src) {
        PduVector3Converter.to_cdr_body(writer, src.force);
        PduVector3Converter.to_cdr_body(writer, src.torque);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Wrench } dst
     * @returns { Wrench }
     */
    static cdr_body_to_js(reader, dst) {
        PduVector3Converter.cdr_body_to_js(reader, dst.force);
        PduVector3Converter.cdr_body_to_js(reader, dst.torque);
        return dst;
    }

    /**
     * @param { Wrench } src
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
     * @returns { Wrench }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Wrench());
    }
}
