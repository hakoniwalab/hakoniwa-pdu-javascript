import { HakoHilActuatorControls } from './pdu_jstype_HakoHilActuatorControls.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoHilActuatorControlsConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoHilActuatorControls } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint64(src.time_usec);
        {
            const values = src.controls;
            for (let i = 0; i < 16; i++) {
                writer.write_float32(i < values.length ? values[i] : 0.0);
            }
        }
        writer.write_uint8(src.mode);
        writer.write_uint64(src.flags);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoHilActuatorControls } dst
     * @returns { HakoHilActuatorControls }
     */
    static cdr_body_to_js(reader, dst) {
        dst.time_usec = reader.read_uint64();
        dst.controls = Array.from({ length: 16 }, () => reader.read_float32());
        dst.mode = reader.read_uint8();
        dst.flags = reader.read_uint64();
        return dst;
    }

    /**
     * @param { HakoHilActuatorControls } src
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
     * @returns { HakoHilActuatorControls }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoHilActuatorControls());
    }
}
