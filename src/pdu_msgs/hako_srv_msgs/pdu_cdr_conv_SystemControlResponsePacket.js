import { SystemControlResponsePacket } from './pdu_jstype_SystemControlResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';
import { SystemControlResponse } from '../hako_srv_msgs/pdu_jstype_SystemControlResponse.js';
import { PduSystemControlResponseConverter } from '../hako_srv_msgs/pdu_cdr_conv_SystemControlResponse.js';


export class PduSystemControlResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SystemControlResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduSystemControlResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SystemControlResponsePacket } dst
     * @returns { SystemControlResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduSystemControlResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { SystemControlResponsePacket } src
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
     * @returns { SystemControlResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SystemControlResponsePacket());
    }
}
