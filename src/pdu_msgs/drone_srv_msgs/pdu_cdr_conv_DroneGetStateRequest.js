import { DroneGetStateRequest } from './pdu_jstype_DroneGetStateRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduDroneGetStateRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneGetStateRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.drone_name);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneGetStateRequest } dst
     * @returns { DroneGetStateRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.drone_name = reader.read_string();
        return dst;
    }

    /**
     * @param { DroneGetStateRequest } src
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
     * @returns { DroneGetStateRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneGetStateRequest());
    }
}
