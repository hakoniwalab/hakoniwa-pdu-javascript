import { SimpleStructVarray } from './pdu_jstype_SimpleStructVarray.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { SimpleVarray } from '../hako_msgs/pdu_jstype_SimpleVarray.js';
import { PduSimpleVarrayConverter } from '../hako_msgs/pdu_cdr_conv_SimpleVarray.js';


export class PduSimpleStructVarrayConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SimpleStructVarray } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int32(src.aaa);
        {
            const values = src.fixed_str;
            for (let i = 0; i < 2; i++) {
                writer.write_string(i < values.length ? values[i] : "");
            }
        }
        writer.write_sequence_length(src.varray_str);
        for (const elem of src.varray_str) {
            writer.write_string(elem);
        }
        {
            const values = src.fixed_array;
            for (let i = 0; i < 5; i++) {
                PduSimpleVarrayConverter.to_cdr_body(writer, i < values.length ? values[i] : new SimpleVarray());
            }
        }
        writer.write_sequence_length(src.data);
        for (const elem of src.data) {
            PduSimpleVarrayConverter.to_cdr_body(writer, elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SimpleStructVarray } dst
     * @returns { SimpleStructVarray }
     */
    static cdr_body_to_js(reader, dst) {
        dst.aaa = reader.read_int32();
        dst.fixed_str = Array.from({ length: 2 }, () => reader.read_string());
        dst.varray_str = Array.from({ length: reader.read_uint32() }, () => reader.read_string());
        dst.fixed_array = [];
        for (let i = 0; i < 5; i++) {
            dst.fixed_array.push(PduSimpleVarrayConverter.cdr_body_to_js(reader, new SimpleVarray()));
        }
        dst.data = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.data.push(PduSimpleVarrayConverter.cdr_body_to_js(reader, new SimpleVarray()));
        }
        return dst;
    }

    /**
     * @param { SimpleStructVarray } src
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
     * @returns { SimpleStructVarray }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SimpleStructVarray());
    }
}
