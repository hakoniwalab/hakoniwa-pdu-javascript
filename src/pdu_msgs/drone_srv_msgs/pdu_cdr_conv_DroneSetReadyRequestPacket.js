import { DroneSetReadyRequestPacket } from './pdu_jstype_DroneSetReadyRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { DroneSetReadyRequest } from '../drone_srv_msgs/pdu_jstype_DroneSetReadyRequest.js';
import { PduDroneSetReadyRequestConverter } from '../drone_srv_msgs/pdu_cdr_conv_DroneSetReadyRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';


export class PduDroneSetReadyRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneSetReadyRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduDroneSetReadyRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneSetReadyRequestPacket } dst
     * @returns { DroneSetReadyRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduDroneSetReadyRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { DroneSetReadyRequestPacket } src
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
     * @returns { DroneSetReadyRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneSetReadyRequestPacket());
    }
}
