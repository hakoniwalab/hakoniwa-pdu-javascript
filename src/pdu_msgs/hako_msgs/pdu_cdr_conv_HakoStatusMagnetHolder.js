import { HakoStatusMagnetHolder } from './pdu_jstype_HakoStatusMagnetHolder.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoStatusMagnetHolderConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoStatusMagnetHolder } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.magnet_on);
        writer.write_bool(src.contact_on);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoStatusMagnetHolder } dst
     * @returns { HakoStatusMagnetHolder }
     */
    static cdr_body_to_js(reader, dst) {
        dst.magnet_on = reader.read_bool();
        dst.contact_on = reader.read_bool();
        return dst;
    }

    /**
     * @param { HakoStatusMagnetHolder } src
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
     * @returns { HakoStatusMagnetHolder }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoStatusMagnetHolder());
    }
}
