import { CompressedImage } from './pdu_jstype_CompressedImage.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduCompressedImageConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { CompressedImage } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_string(src.format);
        writer.write_sequence_length(src.data);
        for (const elem of src.data) {
            writer.write_uint8(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { CompressedImage } dst
     * @returns { CompressedImage }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.format = reader.read_string();
        dst.data = Array.from({ length: reader.read_uint32() }, () => reader.read_uint8());
        return dst;
    }

    /**
     * @param { CompressedImage } src
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
     * @returns { CompressedImage }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new CompressedImage());
    }
}
