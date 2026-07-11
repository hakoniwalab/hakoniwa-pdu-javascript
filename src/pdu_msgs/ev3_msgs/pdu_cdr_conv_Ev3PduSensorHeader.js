import { Ev3PduSensorHeader } from './pdu_jstype_Ev3PduSensorHeader.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduEv3PduSensorHeaderConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Ev3PduSensorHeader } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.name);
        writer.write_uint32(src.version);
        writer.write_int64(src.hakoniwa_time);
        writer.write_uint32(src.ext_off);
        writer.write_uint32(src.ext_size);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Ev3PduSensorHeader } dst
     * @returns { Ev3PduSensorHeader }
     */
    static cdr_body_to_js(reader, dst) {
        dst.name = reader.read_string();
        dst.version = reader.read_uint32();
        dst.hakoniwa_time = reader.read_int64();
        dst.ext_off = reader.read_uint32();
        dst.ext_size = reader.read_uint32();
        return dst;
    }

    /**
     * @param { Ev3PduSensorHeader } src
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
     * @returns { Ev3PduSensorHeader }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Ev3PduSensorHeader());
    }
}
