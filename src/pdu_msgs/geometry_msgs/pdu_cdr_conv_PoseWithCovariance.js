import { PoseWithCovariance } from './pdu_jstype_PoseWithCovariance.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Pose } from '../geometry_msgs/pdu_jstype_Pose.js';
import { PduPoseConverter } from '../geometry_msgs/pdu_cdr_conv_Pose.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';


export class PduPoseWithCovarianceConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { PoseWithCovariance } src
     */
    static to_cdr_body(writer, src) {
        PduPoseConverter.to_cdr_body(writer, src.pose);
        {
            const values = src.covariance;
            for (let i = 0; i < 36; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { PoseWithCovariance } dst
     * @returns { PoseWithCovariance }
     */
    static cdr_body_to_js(reader, dst) {
        PduPoseConverter.cdr_body_to_js(reader, dst.pose);
        dst.covariance = Array.from({ length: 36 }, () => reader.read_float64());
        return dst;
    }

    /**
     * @param { PoseWithCovariance } src
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
     * @returns { PoseWithCovariance }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new PoseWithCovariance());
    }
}
