import { Ev3PduMotor } from './pdu_jstype_Ev3PduMotor.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduEv3PduMotorConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Ev3PduMotor } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int32(src.power);
        writer.write_uint32(src.stop);
        writer.write_uint32(src.reset_angle);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Ev3PduMotor } dst
     * @returns { Ev3PduMotor }
     */
    static cdr_body_to_js(reader, dst) {
        dst.power = reader.read_int32();
        dst.stop = reader.read_uint32();
        dst.reset_angle = reader.read_uint32();
        return dst;
    }

    /**
     * @param { Ev3PduMotor } src
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
     * @returns { Ev3PduMotor }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Ev3PduMotor());
    }
}
