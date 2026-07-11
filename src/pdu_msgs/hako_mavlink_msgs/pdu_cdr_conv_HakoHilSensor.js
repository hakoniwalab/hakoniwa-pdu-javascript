import { HakoHilSensor } from './pdu_jstype_HakoHilSensor.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoHilSensorConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoHilSensor } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint64(src.time_usec);
        writer.write_float32(src.xacc);
        writer.write_float32(src.yacc);
        writer.write_float32(src.zacc);
        writer.write_float32(src.xgyro);
        writer.write_float32(src.ygyro);
        writer.write_float32(src.zgyro);
        writer.write_float32(src.xmag);
        writer.write_float32(src.ymag);
        writer.write_float32(src.zmag);
        writer.write_float32(src.abs_pressure);
        writer.write_float32(src.diff_pressure);
        writer.write_float32(src.pressure_alt);
        writer.write_float32(src.temperature);
        writer.write_uint32(src.fields_updated);
        writer.write_uint8(src.id);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoHilSensor } dst
     * @returns { HakoHilSensor }
     */
    static cdr_body_to_js(reader, dst) {
        dst.time_usec = reader.read_uint64();
        dst.xacc = reader.read_float32();
        dst.yacc = reader.read_float32();
        dst.zacc = reader.read_float32();
        dst.xgyro = reader.read_float32();
        dst.ygyro = reader.read_float32();
        dst.zgyro = reader.read_float32();
        dst.xmag = reader.read_float32();
        dst.ymag = reader.read_float32();
        dst.zmag = reader.read_float32();
        dst.abs_pressure = reader.read_float32();
        dst.diff_pressure = reader.read_float32();
        dst.pressure_alt = reader.read_float32();
        dst.temperature = reader.read_float32();
        dst.fields_updated = reader.read_uint32();
        dst.id = reader.read_uint8();
        return dst;
    }

    /**
     * @param { HakoHilSensor } src
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
     * @returns { HakoHilSensor }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoHilSensor());
    }
}
