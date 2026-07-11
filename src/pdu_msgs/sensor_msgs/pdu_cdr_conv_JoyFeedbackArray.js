import { JoyFeedbackArray } from './pdu_jstype_JoyFeedbackArray.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { JoyFeedback } from '../sensor_msgs/pdu_jstype_JoyFeedback.js';
import { PduJoyFeedbackConverter } from '../sensor_msgs/pdu_cdr_conv_JoyFeedback.js';


export class PduJoyFeedbackArrayConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { JoyFeedbackArray } src
     */
    static to_cdr_body(writer, src) {
        writer.write_sequence_length(src.array);
        for (const elem of src.array) {
            PduJoyFeedbackConverter.to_cdr_body(writer, elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { JoyFeedbackArray } dst
     * @returns { JoyFeedbackArray }
     */
    static cdr_body_to_js(reader, dst) {
        dst.array = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.array.push(PduJoyFeedbackConverter.cdr_body_to_js(reader, new JoyFeedback()));
        }
        return dst;
    }

    /**
     * @param { JoyFeedbackArray } src
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
     * @returns { JoyFeedbackArray }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new JoyFeedbackArray());
    }
}
