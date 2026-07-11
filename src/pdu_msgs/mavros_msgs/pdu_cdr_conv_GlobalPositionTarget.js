import { GlobalPositionTarget } from './pdu_jstype_GlobalPositionTarget.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduGlobalPositionTargetConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GlobalPositionTarget } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_uint8(src.coordinate_frame);
        writer.write_uint16(src.type_mask);
        writer.write_float64(src.latitude);
        writer.write_float64(src.longitude);
        writer.write_float32(src.altitude);
        PduVector3Converter.to_cdr_body(writer, src.velocity);
        PduVector3Converter.to_cdr_body(writer, src.acceleration_or_force);
        writer.write_float32(src.yaw);
        writer.write_float32(src.yaw_rate);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GlobalPositionTarget } dst
     * @returns { GlobalPositionTarget }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.coordinate_frame = reader.read_uint8();
        dst.type_mask = reader.read_uint16();
        dst.latitude = reader.read_float64();
        dst.longitude = reader.read_float64();
        dst.altitude = reader.read_float32();
        PduVector3Converter.cdr_body_to_js(reader, dst.velocity);
        PduVector3Converter.cdr_body_to_js(reader, dst.acceleration_or_force);
        dst.yaw = reader.read_float32();
        dst.yaw_rate = reader.read_float32();
        return dst;
    }

    /**
     * @param { GlobalPositionTarget } src
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
     * @returns { GlobalPositionTarget }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GlobalPositionTarget());
    }
}
