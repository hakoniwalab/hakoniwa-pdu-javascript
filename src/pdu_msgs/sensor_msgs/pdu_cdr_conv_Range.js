import { Range } from './pdu_jstype_Range.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduRangeConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Range } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_uint8(src.radiation_type);
        writer.write_float32(src.field_of_view);
        writer.write_float32(src.min_range);
        writer.write_float32(src.max_range);
        writer.write_float32(src.range);
        writer.write_float32(src.variance);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Range } dst
     * @returns { Range }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.radiation_type = reader.read_uint8();
        dst.field_of_view = reader.read_float32();
        dst.min_range = reader.read_float32();
        dst.max_range = reader.read_float32();
        dst.range = reader.read_float32();
        dst.variance = reader.read_float32();
        return dst;
    }

    /**
     * @param { Range } src
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
     * @returns { Range }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Range());
    }
}
