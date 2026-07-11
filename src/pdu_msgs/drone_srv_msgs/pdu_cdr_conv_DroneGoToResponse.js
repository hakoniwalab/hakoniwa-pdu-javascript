import { DroneGoToResponse } from './pdu_jstype_DroneGoToResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduDroneGoToResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneGoToResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.ok);
        writer.write_string(src.message);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneGoToResponse } dst
     * @returns { DroneGoToResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.ok = reader.read_bool();
        dst.message = reader.read_string();
        return dst;
    }

    /**
     * @param { DroneGoToResponse } src
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
     * @returns { DroneGoToResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneGoToResponse());
    }
}
