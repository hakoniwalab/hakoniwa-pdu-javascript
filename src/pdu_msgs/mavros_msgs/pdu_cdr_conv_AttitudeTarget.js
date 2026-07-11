import { AttitudeTarget } from './pdu_jstype_AttitudeTarget.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduAttitudeTargetConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { AttitudeTarget } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_uint8(src.type_mask);
        PduQuaternionConverter.to_cdr_body(writer, src.orientation);
        PduVector3Converter.to_cdr_body(writer, src.body_rate);
        writer.write_float32(src.thrust);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { AttitudeTarget } dst
     * @returns { AttitudeTarget }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.type_mask = reader.read_uint8();
        PduQuaternionConverter.cdr_body_to_js(reader, dst.orientation);
        PduVector3Converter.cdr_body_to_js(reader, dst.body_rate);
        dst.thrust = reader.read_float32();
        return dst;
    }

    /**
     * @param { AttitudeTarget } src
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
     * @returns { AttitudeTarget }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new AttitudeTarget());
    }
}
