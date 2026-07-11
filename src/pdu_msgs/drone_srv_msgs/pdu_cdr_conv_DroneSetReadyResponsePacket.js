import { DroneSetReadyResponsePacket } from './pdu_jstype_DroneSetReadyResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { DroneSetReadyResponse } from '../drone_srv_msgs/pdu_jstype_DroneSetReadyResponse.js';
import { PduDroneSetReadyResponseConverter } from '../drone_srv_msgs/pdu_cdr_conv_DroneSetReadyResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduDroneSetReadyResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneSetReadyResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduDroneSetReadyResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneSetReadyResponsePacket } dst
     * @returns { DroneSetReadyResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduDroneSetReadyResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { DroneSetReadyResponsePacket } src
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
     * @returns { DroneSetReadyResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneSetReadyResponsePacket());
    }
}
