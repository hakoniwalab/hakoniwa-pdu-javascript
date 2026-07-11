import { TwistWithCovariance } from './pdu_jstype_TwistWithCovariance.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Twist } from '../geometry_msgs/pdu_jstype_Twist.js';
import { PduTwistConverter } from '../geometry_msgs/pdu_cdr_conv_Twist.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduTwistWithCovarianceConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { TwistWithCovariance } src
     */
    static to_cdr_body(writer, src) {
        PduTwistConverter.to_cdr_body(writer, src.twist);
        {
            const values = src.covariance;
            for (let i = 0; i < 36; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { TwistWithCovariance } dst
     * @returns { TwistWithCovariance }
     */
    static cdr_body_to_js(reader, dst) {
        PduTwistConverter.cdr_body_to_js(reader, dst.twist);
        dst.covariance = Array.from({ length: 36 }, () => reader.read_float64());
        return dst;
    }

    /**
     * @param { TwistWithCovariance } src
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
     * @returns { TwistWithCovariance }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new TwistWithCovariance());
    }
}
