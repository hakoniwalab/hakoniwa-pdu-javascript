import { DroneSetReadyRequest } from './pdu_jstype_DroneSetReadyRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduDroneSetReadyRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneSetReadyRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.drone_name);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneSetReadyRequest } dst
     * @returns { DroneSetReadyRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.drone_name = reader.read_string();
        return dst;
    }

    /**
     * @param { DroneSetReadyRequest } src
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
     * @returns { DroneSetReadyRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneSetReadyRequest());
    }
}
