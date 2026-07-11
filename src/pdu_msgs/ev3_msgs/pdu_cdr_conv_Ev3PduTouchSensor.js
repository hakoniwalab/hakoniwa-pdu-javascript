import { Ev3PduTouchSensor } from './pdu_jstype_Ev3PduTouchSensor.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduEv3PduTouchSensorConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Ev3PduTouchSensor } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.value);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Ev3PduTouchSensor } dst
     * @returns { Ev3PduTouchSensor }
     */
    static cdr_body_to_js(reader, dst) {
        dst.value = reader.read_uint32();
        return dst;
    }

    /**
     * @param { Ev3PduTouchSensor } src
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
     * @returns { Ev3PduTouchSensor }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Ev3PduTouchSensor());
    }
}
