import { JointState } from './pdu_jstype_JointState.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduJointStateConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { JointState } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_sequence_length(src.name);
        for (const elem of src.name) {
            writer.write_string(elem);
        }
        writer.write_sequence_length(src.position);
        for (const elem of src.position) {
            writer.write_float64(elem);
        }
        writer.write_sequence_length(src.velocity);
        for (const elem of src.velocity) {
            writer.write_float64(elem);
        }
        writer.write_sequence_length(src.effort);
        for (const elem of src.effort) {
            writer.write_float64(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { JointState } dst
     * @returns { JointState }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.name = Array.from({ length: reader.read_uint32() }, () => reader.read_string());
        dst.position = Array.from({ length: reader.read_uint32() }, () => reader.read_float64());
        dst.velocity = Array.from({ length: reader.read_uint32() }, () => reader.read_float64());
        dst.effort = Array.from({ length: reader.read_uint32() }, () => reader.read_float64());
        return dst;
    }

    /**
     * @param { JointState } src
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
     * @returns { JointState }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new JointState());
    }
}
