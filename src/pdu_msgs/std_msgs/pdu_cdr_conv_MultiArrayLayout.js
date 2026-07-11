import { MultiArrayLayout } from './pdu_jstype_MultiArrayLayout.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { MultiArrayDimension } from '../std_msgs/pdu_jstype_MultiArrayDimension.js';
import { PduMultiArrayDimensionConverter } from '../std_msgs/pdu_cdr_conv_MultiArrayDimension.js';


export class PduMultiArrayLayoutConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MultiArrayLayout } src
     */
    static to_cdr_body(writer, src) {
        writer.write_sequence_length(src.dim);
        for (const elem of src.dim) {
            PduMultiArrayDimensionConverter.to_cdr_body(writer, elem);
        }
        writer.write_uint32(src.data_offset);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MultiArrayLayout } dst
     * @returns { MultiArrayLayout }
     */
    static cdr_body_to_js(reader, dst) {
        dst.dim = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.dim.push(PduMultiArrayDimensionConverter.cdr_body_to_js(reader, new MultiArrayDimension()));
        }
        dst.data_offset = reader.read_uint32();
        return dst;
    }

    /**
     * @param { MultiArrayLayout } src
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
     * @returns { MultiArrayLayout }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MultiArrayLayout());
    }
}
