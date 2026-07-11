import { Ev3PduColorSensor } from './pdu_jstype_Ev3PduColorSensor.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduEv3PduColorSensorConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Ev3PduColorSensor } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.color);
        writer.write_uint32(src.reflect);
        writer.write_uint32(src.rgb_r);
        writer.write_uint32(src.rgb_g);
        writer.write_uint32(src.rgb_b);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Ev3PduColorSensor } dst
     * @returns { Ev3PduColorSensor }
     */
    static cdr_body_to_js(reader, dst) {
        dst.color = reader.read_uint32();
        dst.reflect = reader.read_uint32();
        dst.rgb_r = reader.read_uint32();
        dst.rgb_g = reader.read_uint32();
        dst.rgb_b = reader.read_uint32();
        return dst;
    }

    /**
     * @param { Ev3PduColorSensor } src
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
     * @returns { Ev3PduColorSensor }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Ev3PduColorSensor());
    }
}
