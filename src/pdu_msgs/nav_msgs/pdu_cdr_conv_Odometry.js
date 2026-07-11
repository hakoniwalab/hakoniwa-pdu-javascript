import { Odometry } from './pdu_jstype_Odometry.js';
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
import { Twist } from '../geometry_msgs/pdu_jstype_Twist.js';
import { PduTwistConverter } from '../geometry_msgs/pdu_cdr_conv_Twist.js';
import { TwistWithCovariance } from '../geometry_msgs/pdu_jstype_TwistWithCovariance.js';
import { PduTwistWithCovarianceConverter } from '../geometry_msgs/pdu_cdr_conv_TwistWithCovariance.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduOdometryConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Odometry } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_string(src.child_frame_id);
        PduPoseWithCovarianceConverter.to_cdr_body(writer, src.pose);
        PduTwistWithCovarianceConverter.to_cdr_body(writer, src.twist);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Odometry } dst
     * @returns { Odometry }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.child_frame_id = reader.read_string();
        PduPoseWithCovarianceConverter.cdr_body_to_js(reader, dst.pose);
        PduTwistWithCovarianceConverter.cdr_body_to_js(reader, dst.twist);
        return dst;
    }

    /**
     * @param { Odometry } src
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
     * @returns { Odometry }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Odometry());
    }
}
