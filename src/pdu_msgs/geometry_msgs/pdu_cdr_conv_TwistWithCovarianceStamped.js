import { TwistWithCovarianceStamped } from './pdu_jstype_TwistWithCovarianceStamped.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';
import { Twist } from '../geometry_msgs/pdu_jstype_Twist.js';
import { PduTwistConverter } from '../geometry_msgs/pdu_cdr_conv_Twist.js';
import { TwistWithCovariance } from '../geometry_msgs/pdu_jstype_TwistWithCovariance.js';
import { PduTwistWithCovarianceConverter } from '../geometry_msgs/pdu_cdr_conv_TwistWithCovariance.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduTwistWithCovarianceStampedConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { TwistWithCovarianceStamped } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduTwistWithCovarianceConverter.to_cdr_body(writer, src.twist);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { TwistWithCovarianceStamped } dst
     * @returns { TwistWithCovarianceStamped }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduTwistWithCovarianceConverter.cdr_body_to_js(reader, dst.twist);
        return dst;
    }

    /**
     * @param { TwistWithCovarianceStamped } src
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
     * @returns { TwistWithCovarianceStamped }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new TwistWithCovarianceStamped());
    }
}
