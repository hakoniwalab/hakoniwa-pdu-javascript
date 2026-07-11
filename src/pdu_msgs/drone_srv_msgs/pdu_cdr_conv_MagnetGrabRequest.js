import { MagnetGrabRequest } from './pdu_jstype_MagnetGrabRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduMagnetGrabRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MagnetGrabRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.drone_name);
        writer.write_bool(src.grab_on);
        writer.write_float32(src.timeout_sec);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MagnetGrabRequest } dst
     * @returns { MagnetGrabRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.drone_name = reader.read_string();
        dst.grab_on = reader.read_bool();
        dst.timeout_sec = reader.read_float32();
        return dst;
    }

    /**
     * @param { MagnetGrabRequest } src
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
     * @returns { MagnetGrabRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MagnetGrabRequest());
    }
}
