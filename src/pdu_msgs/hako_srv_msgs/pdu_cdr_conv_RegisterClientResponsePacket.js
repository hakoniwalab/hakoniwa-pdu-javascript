import { RegisterClientResponsePacket } from './pdu_jstype_RegisterClientResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { RegisterClientResponse } from '../hako_srv_msgs/pdu_jstype_RegisterClientResponse.js';
import { PduRegisterClientResponseConverter } from '../hako_srv_msgs/pdu_cdr_conv_RegisterClientResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduRegisterClientResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { RegisterClientResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduRegisterClientResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { RegisterClientResponsePacket } dst
     * @returns { RegisterClientResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduRegisterClientResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { RegisterClientResponsePacket } src
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
     * @returns { RegisterClientResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new RegisterClientResponsePacket());
    }
}
