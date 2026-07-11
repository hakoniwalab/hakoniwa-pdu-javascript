import { MagneticField } from './pdu_jstype_MagneticField.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduMagneticFieldConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MagneticField } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduVector3Converter.to_cdr_body(writer, src.magnetic_field);
        {
            const values = src.magnetic_field_covariance;
            for (let i = 0; i < 9; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MagneticField } dst
     * @returns { MagneticField }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduVector3Converter.cdr_body_to_js(reader, dst.magnetic_field);
        dst.magnetic_field_covariance = Array.from({ length: 9 }, () => reader.read_float64());
        return dst;
    }

    /**
     * @param { MagneticField } src
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
     * @returns { MagneticField }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MagneticField());
    }
}
