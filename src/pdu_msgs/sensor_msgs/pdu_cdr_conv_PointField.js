import { PointField } from './pdu_jstype_PointField.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduPointFieldConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { PointField } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.name);
        writer.write_uint32(src.offset);
        writer.write_uint8(src.datatype);
        writer.write_uint32(src.count);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { PointField } dst
     * @returns { PointField }
     */
    static cdr_body_to_js(reader, dst) {
        dst.name = reader.read_string();
        dst.offset = reader.read_uint32();
        dst.datatype = reader.read_uint8();
        dst.count = reader.read_uint32();
        return dst;
    }

    /**
     * @param { PointField } src
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
     * @returns { PointField }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new PointField());
    }
}
