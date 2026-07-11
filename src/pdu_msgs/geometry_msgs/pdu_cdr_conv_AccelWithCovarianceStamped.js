import { AccelWithCovarianceStamped } from './pdu_jstype_AccelWithCovarianceStamped.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Accel } from '../geometry_msgs/pdu_jstype_Accel.js';
import { PduAccelConverter } from '../geometry_msgs/pdu_cdr_conv_Accel.js';
import { AccelWithCovariance } from '../geometry_msgs/pdu_jstype_AccelWithCovariance.js';
import { PduAccelWithCovarianceConverter } from '../geometry_msgs/pdu_cdr_conv_AccelWithCovariance.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduAccelWithCovarianceStampedConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { AccelWithCovarianceStamped } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduAccelWithCovarianceConverter.to_cdr_body(writer, src.accel);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { AccelWithCovarianceStamped } dst
     * @returns { AccelWithCovarianceStamped }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduAccelWithCovarianceConverter.cdr_body_to_js(reader, dst.accel);
        return dst;
    }

    /**
     * @param { AccelWithCovarianceStamped } src
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
     * @returns { AccelWithCovarianceStamped }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new AccelWithCovarianceStamped());
    }
}
