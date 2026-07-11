import { TFMessage } from './pdu_jstype_TFMessage.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';
import { Transform } from '../geometry_msgs/pdu_jstype_Transform.js';
import { PduTransformConverter } from '../geometry_msgs/pdu_cdr_conv_Transform.js';
import { TransformStamped } from '../geometry_msgs/pdu_jstype_TransformStamped.js';
import { PduTransformStampedConverter } from '../geometry_msgs/pdu_cdr_conv_TransformStamped.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduTFMessageConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { TFMessage } src
     */
    static to_cdr_body(writer, src) {
        writer.write_sequence_length(src.transforms);
        for (const elem of src.transforms) {
            PduTransformStampedConverter.to_cdr_body(writer, elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { TFMessage } dst
     * @returns { TFMessage }
     */
    static cdr_body_to_js(reader, dst) {
        dst.transforms = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.transforms.push(PduTransformStampedConverter.cdr_body_to_js(reader, new TransformStamped()));
        }
        return dst;
    }

    /**
     * @param { TFMessage } src
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
     * @returns { TFMessage }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new TFMessage());
    }
}
