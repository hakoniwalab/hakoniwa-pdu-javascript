import { Image } from './pdu_jstype_Image.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduImageConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Image } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_uint32(src.height);
        writer.write_uint32(src.width);
        writer.write_string(src.encoding);
        writer.write_uint8(src.is_bigendian);
        writer.write_uint32(src.step);
        writer.write_sequence_length(src.data);
        for (const elem of src.data) {
            writer.write_uint8(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Image } dst
     * @returns { Image }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.height = reader.read_uint32();
        dst.width = reader.read_uint32();
        dst.encoding = reader.read_string();
        dst.is_bigendian = reader.read_uint8();
        dst.step = reader.read_uint32();
        dst.data = Array.from({ length: reader.read_uint32() }, () => reader.read_uint8());
        return dst;
    }

    /**
     * @param { Image } src
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
     * @returns { Image }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Image());
    }
}
