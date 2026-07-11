import { MagnetGrabResponse } from './pdu_jstype_MagnetGrabResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduMagnetGrabResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MagnetGrabResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.ok);
        writer.write_bool(src.magnet_on);
        writer.write_bool(src.contact_on);
        writer.write_string(src.message);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MagnetGrabResponse } dst
     * @returns { MagnetGrabResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.ok = reader.read_bool();
        dst.magnet_on = reader.read_bool();
        dst.contact_on = reader.read_bool();
        dst.message = reader.read_string();
        return dst;
    }

    /**
     * @param { MagnetGrabResponse } src
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
     * @returns { MagnetGrabResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MagnetGrabResponse());
    }
}
