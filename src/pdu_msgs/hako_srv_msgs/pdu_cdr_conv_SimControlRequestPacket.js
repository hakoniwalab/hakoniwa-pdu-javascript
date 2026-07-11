import { SimControlRequestPacket } from './pdu_jstype_SimControlRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';
import { SimControlRequest } from '../hako_srv_msgs/pdu_jstype_SimControlRequest.js';
import { PduSimControlRequestConverter } from '../hako_srv_msgs/pdu_cdr_conv_SimControlRequest.js';


export class PduSimControlRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SimControlRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduSimControlRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SimControlRequestPacket } dst
     * @returns { SimControlRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduSimControlRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { SimControlRequestPacket } src
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
     * @returns { SimControlRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SimControlRequestPacket());
    }
}
