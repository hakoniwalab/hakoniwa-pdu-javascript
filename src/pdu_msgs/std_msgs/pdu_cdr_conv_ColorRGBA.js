import { ColorRGBA } from './pdu_jstype_ColorRGBA.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduColorRGBAConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ColorRGBA } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float32(src.r);
        writer.write_float32(src.g);
        writer.write_float32(src.b);
        writer.write_float32(src.a);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ColorRGBA } dst
     * @returns { ColorRGBA }
     */
    static cdr_body_to_js(reader, dst) {
        dst.r = reader.read_float32();
        dst.g = reader.read_float32();
        dst.b = reader.read_float32();
        dst.a = reader.read_float32();
        return dst;
    }

    /**
     * @param { ColorRGBA } src
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
     * @returns { ColorRGBA }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ColorRGBA());
    }
}
