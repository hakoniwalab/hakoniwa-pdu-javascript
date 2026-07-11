import { GetSimStateRequestPacket } from './pdu_jstype_GetSimStateRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { GetSimStateRequest } from '../hako_srv_msgs/pdu_jstype_GetSimStateRequest.js';
import { PduGetSimStateRequestConverter } from '../hako_srv_msgs/pdu_cdr_conv_GetSimStateRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';


export class PduGetSimStateRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GetSimStateRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduGetSimStateRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GetSimStateRequestPacket } dst
     * @returns { GetSimStateRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduGetSimStateRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { GetSimStateRequestPacket } src
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
     * @returns { GetSimStateRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GetSimStateRequestPacket());
    }
}
