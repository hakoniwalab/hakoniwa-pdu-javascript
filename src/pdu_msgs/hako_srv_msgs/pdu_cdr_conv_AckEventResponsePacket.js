import { AckEventResponsePacket } from './pdu_jstype_AckEventResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { AckEventResponse } from '../hako_srv_msgs/pdu_jstype_AckEventResponse.js';
import { PduAckEventResponseConverter } from '../hako_srv_msgs/pdu_cdr_conv_AckEventResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduAckEventResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { AckEventResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduAckEventResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { AckEventResponsePacket } dst
     * @returns { AckEventResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduAckEventResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { AckEventResponsePacket } src
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
     * @returns { AckEventResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new AckEventResponsePacket());
    }
}
