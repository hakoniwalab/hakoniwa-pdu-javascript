import { DroneTakeOffRequestPacket } from './pdu_jstype_DroneTakeOffRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { DroneTakeOffRequest } from '../drone_srv_msgs/pdu_jstype_DroneTakeOffRequest.js';
import { PduDroneTakeOffRequestConverter } from '../drone_srv_msgs/pdu_cdr_conv_DroneTakeOffRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';


export class PduDroneTakeOffRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneTakeOffRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduDroneTakeOffRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneTakeOffRequestPacket } dst
     * @returns { DroneTakeOffRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduDroneTakeOffRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { DroneTakeOffRequestPacket } src
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
     * @returns { DroneTakeOffRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneTakeOffRequestPacket());
    }
}
