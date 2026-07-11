import { HakoSERVO_OUTPUT_RAW } from './pdu_jstype_HakoSERVO_OUTPUT_RAW.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoSERVO_OUTPUT_RAWConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoSERVO_OUTPUT_RAW } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.time_usec);
        writer.write_uint8(src.port);
        writer.write_uint16(src.servo1_raw);
        writer.write_uint16(src.servo2_raw);
        writer.write_uint16(src.servo3_raw);
        writer.write_uint16(src.servo4_raw);
        writer.write_uint16(src.servo5_raw);
        writer.write_uint16(src.servo6_raw);
        writer.write_uint16(src.servo7_raw);
        writer.write_uint16(src.servo8_raw);
        writer.write_uint16(src.servo9_raw);
        writer.write_uint16(src.servo10_raw);
        writer.write_uint16(src.servo11_raw);
        writer.write_uint16(src.servo12_raw);
        writer.write_uint16(src.servo13_raw);
        writer.write_uint16(src.servo14_raw);
        writer.write_uint16(src.servo15_raw);
        writer.write_uint16(src.servo16_raw);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoSERVO_OUTPUT_RAW } dst
     * @returns { HakoSERVO_OUTPUT_RAW }
     */
    static cdr_body_to_js(reader, dst) {
        dst.time_usec = reader.read_uint32();
        dst.port = reader.read_uint8();
        dst.servo1_raw = reader.read_uint16();
        dst.servo2_raw = reader.read_uint16();
        dst.servo3_raw = reader.read_uint16();
        dst.servo4_raw = reader.read_uint16();
        dst.servo5_raw = reader.read_uint16();
        dst.servo6_raw = reader.read_uint16();
        dst.servo7_raw = reader.read_uint16();
        dst.servo8_raw = reader.read_uint16();
        dst.servo9_raw = reader.read_uint16();
        dst.servo10_raw = reader.read_uint16();
        dst.servo11_raw = reader.read_uint16();
        dst.servo12_raw = reader.read_uint16();
        dst.servo13_raw = reader.read_uint16();
        dst.servo14_raw = reader.read_uint16();
        dst.servo15_raw = reader.read_uint16();
        dst.servo16_raw = reader.read_uint16();
        return dst;
    }

    /**
     * @param { HakoSERVO_OUTPUT_RAW } src
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
     * @returns { HakoSERVO_OUTPUT_RAW }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoSERVO_OUTPUT_RAW());
    }
}
