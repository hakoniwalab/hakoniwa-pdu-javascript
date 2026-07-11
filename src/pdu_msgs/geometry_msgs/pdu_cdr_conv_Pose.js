import { Pose } from './pdu_jstype_Pose.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';


export class PduPoseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Pose } src
     */
    static to_cdr_body(writer, src) {
        PduPointConverter.to_cdr_body(writer, src.position);
        PduQuaternionConverter.to_cdr_body(writer, src.orientation);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Pose } dst
     * @returns { Pose }
     */
    static cdr_body_to_js(reader, dst) {
        PduPointConverter.cdr_body_to_js(reader, dst.position);
        PduQuaternionConverter.cdr_body_to_js(reader, dst.orientation);
        return dst;
    }

    /**
     * @param { Pose } src
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
     * @returns { Pose }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Pose());
    }
}
