import { DroneSetReadyResponse } from './pdu_jstype_DroneSetReadyResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduDroneSetReadyResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneSetReadyResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.ok);
        writer.write_string(src.message);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneSetReadyResponse } dst
     * @returns { DroneSetReadyResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.ok = reader.read_bool();
        dst.message = reader.read_string();
        return dst;
    }

    /**
     * @param { DroneSetReadyResponse } src
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
     * @returns { DroneSetReadyResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneSetReadyResponse());
    }
}
