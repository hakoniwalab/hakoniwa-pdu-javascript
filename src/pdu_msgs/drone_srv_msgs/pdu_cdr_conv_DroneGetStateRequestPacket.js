import { DroneGetStateRequestPacket } from './pdu_jstype_DroneGetStateRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { DroneGetStateRequest } from '../drone_srv_msgs/pdu_jstype_DroneGetStateRequest.js';
import { PduDroneGetStateRequestConverter } from '../drone_srv_msgs/pdu_cdr_conv_DroneGetStateRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';


export class PduDroneGetStateRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneGetStateRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduDroneGetStateRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneGetStateRequestPacket } dst
     * @returns { DroneGetStateRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduDroneGetStateRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { DroneGetStateRequestPacket } src
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
     * @returns { DroneGetStateRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneGetStateRequestPacket());
    }
}
