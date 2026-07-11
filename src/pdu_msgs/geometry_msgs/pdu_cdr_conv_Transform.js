import { Transform } from './pdu_jstype_Transform.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduTransformConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Transform } src
     */
    static to_cdr_body(writer, src) {
        PduVector3Converter.to_cdr_body(writer, src.translation);
        PduQuaternionConverter.to_cdr_body(writer, src.rotation);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Transform } dst
     * @returns { Transform }
     */
    static cdr_body_to_js(reader, dst) {
        PduVector3Converter.cdr_body_to_js(reader, dst.translation);
        PduQuaternionConverter.cdr_body_to_js(reader, dst.rotation);
        return dst;
    }

    /**
     * @param { Transform } src
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
     * @returns { Transform }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Transform());
    }
}
