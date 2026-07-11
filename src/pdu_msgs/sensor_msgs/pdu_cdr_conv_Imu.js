import { Imu } from './pdu_jstype_Imu.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduImuConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Imu } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduQuaternionConverter.to_cdr_body(writer, src.orientation);
        {
            const values = src.orientation_covariance;
            for (let i = 0; i < 9; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
        PduVector3Converter.to_cdr_body(writer, src.angular_velocity);
        {
            const values = src.angular_velocity_covariance;
            for (let i = 0; i < 9; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
        PduVector3Converter.to_cdr_body(writer, src.linear_acceleration);
        {
            const values = src.linear_acceleration_covariance;
            for (let i = 0; i < 9; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Imu } dst
     * @returns { Imu }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduQuaternionConverter.cdr_body_to_js(reader, dst.orientation);
        dst.orientation_covariance = Array.from({ length: 9 }, () => reader.read_float64());
        PduVector3Converter.cdr_body_to_js(reader, dst.angular_velocity);
        dst.angular_velocity_covariance = Array.from({ length: 9 }, () => reader.read_float64());
        PduVector3Converter.cdr_body_to_js(reader, dst.linear_acceleration);
        dst.linear_acceleration_covariance = Array.from({ length: 9 }, () => reader.read_float64());
        return dst;
    }

    /**
     * @param { Imu } src
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
     * @returns { Imu }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Imu());
    }
}
