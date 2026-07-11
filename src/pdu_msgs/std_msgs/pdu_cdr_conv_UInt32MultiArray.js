import { UInt32MultiArray } from './pdu_jstype_UInt32MultiArray.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { MultiArrayDimension } from '../std_msgs/pdu_jstype_MultiArrayDimension.js';
import { PduMultiArrayDimensionConverter } from '../std_msgs/pdu_cdr_conv_MultiArrayDimension.js';
import { MultiArrayLayout } from '../std_msgs/pdu_jstype_MultiArrayLayout.js';
import { PduMultiArrayLayoutConverter } from '../std_msgs/pdu_cdr_conv_MultiArrayLayout.js';


export class PduUInt32MultiArrayConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { UInt32MultiArray } src
     */
    static to_cdr_body(writer, src) {
        PduMultiArrayLayoutConverter.to_cdr_body(writer, src.layout);
        writer.write_sequence_length(src.data);
        for (const elem of src.data) {
            writer.write_uint32(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { UInt32MultiArray } dst
     * @returns { UInt32MultiArray }
     */
    static cdr_body_to_js(reader, dst) {
        PduMultiArrayLayoutConverter.cdr_body_to_js(reader, dst.layout);
        dst.data = Array.from({ length: reader.read_uint32() }, () => reader.read_uint32());
        return dst;
    }

    /**
     * @param { UInt32MultiArray } src
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
     * @returns { UInt32MultiArray }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new UInt32MultiArray());
    }
}
