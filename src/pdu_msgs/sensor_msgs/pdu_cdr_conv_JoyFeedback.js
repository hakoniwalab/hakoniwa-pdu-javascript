import { JoyFeedback } from './pdu_jstype_JoyFeedback.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduJoyFeedbackConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { JoyFeedback } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint8(src.type);
        writer.write_uint8(src.id);
        writer.write_float32(src.intensity);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { JoyFeedback } dst
     * @returns { JoyFeedback }
     */
    static cdr_body_to_js(reader, dst) {
        dst.type = reader.read_uint8();
        dst.id = reader.read_uint8();
        dst.intensity = reader.read_float32();
        return dst;
    }

    /**
     * @param { JoyFeedback } src
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
     * @returns { JoyFeedback }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new JoyFeedback());
    }
}
