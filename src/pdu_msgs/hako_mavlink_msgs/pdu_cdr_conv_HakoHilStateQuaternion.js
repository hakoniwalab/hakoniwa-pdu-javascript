import { HakoHilStateQuaternion } from './pdu_jstype_HakoHilStateQuaternion.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoHilStateQuaternionConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoHilStateQuaternion } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint64(src.time_usec);
        {
            const values = src.attitude_quaternion;
            for (let i = 0; i < 4; i++) {
                writer.write_float32(i < values.length ? values[i] : 0.0);
            }
        }
        writer.write_float32(src.rollspeed);
        writer.write_float32(src.pitchspeed);
        writer.write_float32(src.yawspeed);
        writer.write_int32(src.lat);
        writer.write_int32(src.lon);
        writer.write_int32(src.alt);
        writer.write_int16(src.vx);
        writer.write_int16(src.vy);
        writer.write_int16(src.vz);
        writer.write_uint16(src.ind_airspeed);
        writer.write_uint16(src.true_airspeed);
        writer.write_int16(src.xacc);
        writer.write_int16(src.yacc);
        writer.write_int16(src.zacc);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoHilStateQuaternion } dst
     * @returns { HakoHilStateQuaternion }
     */
    static cdr_body_to_js(reader, dst) {
        dst.time_usec = reader.read_uint64();
        dst.attitude_quaternion = Array.from({ length: 4 }, () => reader.read_float32());
        dst.rollspeed = reader.read_float32();
        dst.pitchspeed = reader.read_float32();
        dst.yawspeed = reader.read_float32();
        dst.lat = reader.read_int32();
        dst.lon = reader.read_int32();
        dst.alt = reader.read_int32();
        dst.vx = reader.read_int16();
        dst.vy = reader.read_int16();
        dst.vz = reader.read_int16();
        dst.ind_airspeed = reader.read_uint16();
        dst.true_airspeed = reader.read_uint16();
        dst.xacc = reader.read_int16();
        dst.yacc = reader.read_int16();
        dst.zacc = reader.read_int16();
        return dst;
    }

    /**
     * @param { HakoHilStateQuaternion } src
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
     * @returns { HakoHilStateQuaternion }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoHilStateQuaternion());
    }
}
