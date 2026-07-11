import { SystemControlRequestPacket } from './pdu_jstype_SystemControlRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';
import { SystemControlRequest } from '../hako_srv_msgs/pdu_jstype_SystemControlRequest.js';
import { PduSystemControlRequestConverter } from '../hako_srv_msgs/pdu_cdr_conv_SystemControlRequest.js';


export class PduSystemControlRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SystemControlRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduSystemControlRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SystemControlRequestPacket } dst
     * @returns { SystemControlRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduSystemControlRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { SystemControlRequestPacket } src
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
     * @returns { SystemControlRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SystemControlRequestPacket());
    }
}
