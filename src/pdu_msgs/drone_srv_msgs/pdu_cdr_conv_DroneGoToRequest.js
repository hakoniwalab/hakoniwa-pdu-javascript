import { DroneGoToRequest } from './pdu_jstype_DroneGoToRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduDroneGoToRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneGoToRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.drone_name);
        PduVector3Converter.to_cdr_body(writer, src.target_pose);
        writer.write_float32(src.speed_m_s);
        writer.write_float32(src.yaw_deg);
        writer.write_float32(src.tolerance_m);
        writer.write_float32(src.timeout_sec);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneGoToRequest } dst
     * @returns { DroneGoToRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.drone_name = reader.read_string();
        PduVector3Converter.cdr_body_to_js(reader, dst.target_pose);
        dst.speed_m_s = reader.read_float32();
        dst.yaw_deg = reader.read_float32();
        dst.tolerance_m = reader.read_float32();
        dst.timeout_sec = reader.read_float32();
        return dst;
    }

    /**
     * @param { DroneGoToRequest } src
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
     * @returns { DroneGoToRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneGoToRequest());
    }
}
