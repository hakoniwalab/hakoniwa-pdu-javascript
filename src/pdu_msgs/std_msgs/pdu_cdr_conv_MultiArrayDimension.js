import { MultiArrayDimension } from './pdu_jstype_MultiArrayDimension.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduMultiArrayDimensionConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MultiArrayDimension } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.label);
        writer.write_uint32(src.size);
        writer.write_uint32(src.stride);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MultiArrayDimension } dst
     * @returns { MultiArrayDimension }
     */
    static cdr_body_to_js(reader, dst) {
        dst.label = reader.read_string();
        dst.size = reader.read_uint32();
        dst.stride = reader.read_uint32();
        return dst;
    }

    /**
     * @param { MultiArrayDimension } src
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
     * @returns { MultiArrayDimension }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MultiArrayDimension());
    }
}
