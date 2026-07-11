import { DroneGoToRequestPacket } from './pdu_jstype_DroneGoToRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { DroneGoToRequest } from '../drone_srv_msgs/pdu_jstype_DroneGoToRequest.js';
import { PduDroneGoToRequestConverter } from '../drone_srv_msgs/pdu_cdr_conv_DroneGoToRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduDroneGoToRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneGoToRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduDroneGoToRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneGoToRequestPacket } dst
     * @returns { DroneGoToRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduDroneGoToRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { DroneGoToRequestPacket } src
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
     * @returns { DroneGoToRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneGoToRequestPacket());
    }
}
