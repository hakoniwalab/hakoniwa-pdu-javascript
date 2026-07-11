import { DisturbanceTemperature } from './pdu_jstype_DisturbanceTemperature.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduDisturbanceTemperatureConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DisturbanceTemperature } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float64(src.value);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DisturbanceTemperature } dst
     * @returns { DisturbanceTemperature }
     */
    static cdr_body_to_js(reader, dst) {
        dst.value = reader.read_float64();
        return dst;
    }

    /**
     * @param { DisturbanceTemperature } src
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
     * @returns { DisturbanceTemperature }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DisturbanceTemperature());
    }
}
