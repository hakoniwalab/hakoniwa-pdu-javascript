import { AckEventRequestPacket } from './pdu_jstype_AckEventRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { AckEventRequest } from '../hako_srv_msgs/pdu_jstype_AckEventRequest.js';
import { PduAckEventRequestConverter } from '../hako_srv_msgs/pdu_cdr_conv_AckEventRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';


export class PduAckEventRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { AckEventRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduAckEventRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { AckEventRequestPacket } dst
     * @returns { AckEventRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduAckEventRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { AckEventRequestPacket } src
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
     * @returns { AckEventRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new AckEventRequestPacket());
    }
}
