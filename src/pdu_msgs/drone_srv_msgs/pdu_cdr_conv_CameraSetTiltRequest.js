import { CameraSetTiltRequest } from './pdu_jstype_CameraSetTiltRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduCameraSetTiltRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { CameraSetTiltRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.drone_name);
        writer.write_float32(src.tilt_angle_deg);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { CameraSetTiltRequest } dst
     * @returns { CameraSetTiltRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.drone_name = reader.read_string();
        dst.tilt_angle_deg = reader.read_float32();
        return dst;
    }

    /**
     * @param { CameraSetTiltRequest } src
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
     * @returns { CameraSetTiltRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new CameraSetTiltRequest());
    }
}
