import { PoseWithCovarianceStamped } from './pdu_jstype_PoseWithCovarianceStamped.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Pose } from '../geometry_msgs/pdu_jstype_Pose.js';
import { PduPoseConverter } from '../geometry_msgs/pdu_cdr_conv_Pose.js';
import { PoseWithCovariance } from '../geometry_msgs/pdu_jstype_PoseWithCovariance.js';
import { PduPoseWithCovarianceConverter } from '../geometry_msgs/pdu_cdr_conv_PoseWithCovariance.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduPoseWithCovarianceStampedConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { PoseWithCovarianceStamped } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduPoseWithCovarianceConverter.to_cdr_body(writer, src.pose);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { PoseWithCovarianceStamped } dst
     * @returns { PoseWithCovarianceStamped }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduPoseWithCovarianceConverter.cdr_body_to_js(reader, dst.pose);
        return dst;
    }

    /**
     * @param { PoseWithCovarianceStamped } src
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
     * @returns { PoseWithCovarianceStamped }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new PoseWithCovarianceStamped());
    }
}
