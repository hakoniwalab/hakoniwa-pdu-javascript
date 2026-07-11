import { NavSatFix } from './pdu_jstype_NavSatFix.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { NavSatStatus } from '../sensor_msgs/pdu_jstype_NavSatStatus.js';
import { PduNavSatStatusConverter } from '../sensor_msgs/pdu_cdr_conv_NavSatStatus.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduNavSatFixConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { NavSatFix } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduNavSatStatusConverter.to_cdr_body(writer, src.status);
        writer.write_float64(src.latitude);
        writer.write_float64(src.longitude);
        writer.write_float64(src.altitude);
        {
            const values = src.position_covariance;
            for (let i = 0; i < 9; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
        writer.write_uint8(src.position_covariance_type);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { NavSatFix } dst
     * @returns { NavSatFix }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduNavSatStatusConverter.cdr_body_to_js(reader, dst.status);
        dst.latitude = reader.read_float64();
        dst.longitude = reader.read_float64();
        dst.altitude = reader.read_float64();
        dst.position_covariance = Array.from({ length: 9 }, () => reader.read_float64());
        dst.position_covariance_type = reader.read_uint8();
        return dst;
    }

    /**
     * @param { NavSatFix } src
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
     * @returns { NavSatFix }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new NavSatFix());
    }
}
