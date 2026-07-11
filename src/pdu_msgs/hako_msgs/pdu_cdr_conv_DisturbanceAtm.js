import { DisturbanceAtm } from './pdu_jstype_DisturbanceAtm.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduDisturbanceAtmConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DisturbanceAtm } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float64(src.sea_level_atm);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DisturbanceAtm } dst
     * @returns { DisturbanceAtm }
     */
    static cdr_body_to_js(reader, dst) {
        dst.sea_level_atm = reader.read_float64();
        return dst;
    }

    /**
     * @param { DisturbanceAtm } src
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
     * @returns { DisturbanceAtm }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DisturbanceAtm());
    }
}
