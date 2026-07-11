import { GetEventRequestPacket } from './pdu_jstype_GetEventRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { GetEventRequest } from '../hako_srv_msgs/pdu_jstype_GetEventRequest.js';
import { PduGetEventRequestConverter } from '../hako_srv_msgs/pdu_cdr_conv_GetEventRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';


export class PduGetEventRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GetEventRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduGetEventRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GetEventRequestPacket } dst
     * @returns { GetEventRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduGetEventRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { GetEventRequestPacket } src
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
     * @returns { GetEventRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GetEventRequestPacket());
    }
}
