import { SimpleVarray } from './pdu_jstype_SimpleVarray.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduSimpleVarrayConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SimpleVarray } src
     */
    static to_cdr_body(writer, src) {
        writer.write_sequence_length(src.data);
        for (const elem of src.data) {
            writer.write_int8(elem);
        }
        {
            const values = src.fixed_array;
            for (let i = 0; i < 10; i++) {
                writer.write_int8(i < values.length ? values[i] : 0);
            }
        }
        writer.write_int32(src.p_mem1);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SimpleVarray } dst
     * @returns { SimpleVarray }
     */
    static cdr_body_to_js(reader, dst) {
        dst.data = Array.from({ length: reader.read_uint32() }, () => reader.read_int8());
        dst.fixed_array = Array.from({ length: 10 }, () => reader.read_int8());
        dst.p_mem1 = reader.read_int32();
        return dst;
    }

    /**
     * @param { SimpleVarray } src
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
     * @returns { SimpleVarray }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SimpleVarray());
    }
}
