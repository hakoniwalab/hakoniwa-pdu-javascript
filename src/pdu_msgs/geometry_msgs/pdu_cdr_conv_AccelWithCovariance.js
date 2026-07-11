import { AccelWithCovariance } from './pdu_jstype_AccelWithCovariance.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Accel } from '../geometry_msgs/pdu_jstype_Accel.js';
import { PduAccelConverter } from '../geometry_msgs/pdu_cdr_conv_Accel.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduAccelWithCovarianceConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { AccelWithCovariance } src
     */
    static to_cdr_body(writer, src) {
        PduAccelConverter.to_cdr_body(writer, src.accel);
        {
            const values = src.covariance;
            for (let i = 0; i < 36; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { AccelWithCovariance } dst
     * @returns { AccelWithCovariance }
     */
    static cdr_body_to_js(reader, dst) {
        PduAccelConverter.cdr_body_to_js(reader, dst.accel);
        dst.covariance = Array.from({ length: 36 }, () => reader.read_float64());
        return dst;
    }

    /**
     * @param { AccelWithCovariance } src
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
     * @returns { AccelWithCovariance }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new AccelWithCovariance());
    }
}
