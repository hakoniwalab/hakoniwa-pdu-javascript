import { DroneVisualState } from './pdu_jstype_DroneVisualState.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduDroneVisualStateConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneVisualState } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float32(src.x);
        writer.write_float32(src.y);
        writer.write_float32(src.z);
        writer.write_float32(src.roll);
        writer.write_float32(src.pitch);
        writer.write_float32(src.yaw);
        writer.write_sequence_length(src.pwm_duty);
        for (const elem of src.pwm_duty) {
            writer.write_float32(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneVisualState } dst
     * @returns { DroneVisualState }
     */
    static cdr_body_to_js(reader, dst) {
        dst.x = reader.read_float32();
        dst.y = reader.read_float32();
        dst.z = reader.read_float32();
        dst.roll = reader.read_float32();
        dst.pitch = reader.read_float32();
        dst.yaw = reader.read_float32();
        dst.pwm_duty = Array.from({ length: reader.read_uint32() }, () => reader.read_float32());
        return dst;
    }

    /**
     * @param { DroneVisualState } src
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
     * @returns { DroneVisualState }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneVisualState());
    }
}
