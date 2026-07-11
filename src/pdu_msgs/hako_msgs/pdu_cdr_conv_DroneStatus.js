import { DroneStatus } from './pdu_jstype_DroneStatus.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduDroneStatusConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneStatus } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int32(src.flight_mode);
        writer.write_int32(src.internal_state);
        PduVector3Converter.to_cdr_body(writer, src.propeller_wind);
        writer.write_int32(src.collided_counts);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneStatus } dst
     * @returns { DroneStatus }
     */
    static cdr_body_to_js(reader, dst) {
        dst.flight_mode = reader.read_int32();
        dst.internal_state = reader.read_int32();
        PduVector3Converter.cdr_body_to_js(reader, dst.propeller_wind);
        dst.collided_counts = reader.read_int32();
        return dst;
    }

    /**
     * @param { DroneStatus } src
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
     * @returns { DroneStatus }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneStatus());
    }
}
