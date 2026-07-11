import { ChannelFloat32 } from './pdu_jstype_ChannelFloat32.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduChannelFloat32Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ChannelFloat32 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.name);
        writer.write_sequence_length(src.values);
        for (const elem of src.values) {
            writer.write_float32(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ChannelFloat32 } dst
     * @returns { ChannelFloat32 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.name = reader.read_string();
        dst.values = Array.from({ length: reader.read_uint32() }, () => reader.read_float32());
        return dst;
    }

    /**
     * @param { ChannelFloat32 } src
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
     * @returns { ChannelFloat32 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ChannelFloat32());
    }
}
