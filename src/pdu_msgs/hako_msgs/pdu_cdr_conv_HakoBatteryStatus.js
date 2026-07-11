import { HakoBatteryStatus } from './pdu_jstype_HakoBatteryStatus.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoBatteryStatusConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoBatteryStatus } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float64(src.full_voltage);
        writer.write_float64(src.curr_voltage);
        writer.write_float64(src.curr_temp);
        writer.write_uint32(src.status);
        writer.write_uint32(src.cycles);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoBatteryStatus } dst
     * @returns { HakoBatteryStatus }
     */
    static cdr_body_to_js(reader, dst) {
        dst.full_voltage = reader.read_float64();
        dst.curr_voltage = reader.read_float64();
        dst.curr_temp = reader.read_float64();
        dst.status = reader.read_uint32();
        dst.cycles = reader.read_uint32();
        return dst;
    }

    /**
     * @param { HakoBatteryStatus } src
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
     * @returns { HakoBatteryStatus }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoBatteryStatus());
    }
}
