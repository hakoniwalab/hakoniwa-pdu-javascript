import { Ev3PduActuator } from './pdu_jstype_Ev3PduActuator.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Ev3PduActuatorHeader } from '../ev3_msgs/pdu_jstype_Ev3PduActuatorHeader.js';
import { PduEv3PduActuatorHeaderConverter } from '../ev3_msgs/pdu_cdr_conv_Ev3PduActuatorHeader.js';
import { Ev3PduMotor } from '../ev3_msgs/pdu_jstype_Ev3PduMotor.js';
import { PduEv3PduMotorConverter } from '../ev3_msgs/pdu_cdr_conv_Ev3PduMotor.js';


export class PduEv3PduActuatorConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Ev3PduActuator } src
     */
    static to_cdr_body(writer, src) {
        PduEv3PduActuatorHeaderConverter.to_cdr_body(writer, src.head);
        {
            const values = src.leds;
            for (let i = 0; i < 1; i++) {
                writer.write_uint8(i < values.length ? values[i] : 0);
            }
        }
        {
            const values = src.motors;
            for (let i = 0; i < 3; i++) {
                PduEv3PduMotorConverter.to_cdr_body(writer, i < values.length ? values[i] : new Ev3PduMotor());
            }
        }
        writer.write_uint32(src.gyro_reset);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Ev3PduActuator } dst
     * @returns { Ev3PduActuator }
     */
    static cdr_body_to_js(reader, dst) {
        PduEv3PduActuatorHeaderConverter.cdr_body_to_js(reader, dst.head);
        dst.leds = Array.from({ length: 1 }, () => reader.read_uint8());
        dst.motors = [];
        for (let i = 0; i < 3; i++) {
            dst.motors.push(PduEv3PduMotorConverter.cdr_body_to_js(reader, new Ev3PduMotor()));
        }
        dst.gyro_reset = reader.read_uint32();
        return dst;
    }

    /**
     * @param { Ev3PduActuator } src
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
     * @returns { Ev3PduActuator }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Ev3PduActuator());
    }
}
