import { GetSimStateResponsePacket } from './pdu_jstype_GetSimStateResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { GetSimStateResponse } from '../hako_srv_msgs/pdu_jstype_GetSimStateResponse.js';
import { PduGetSimStateResponseConverter } from '../hako_srv_msgs/pdu_cdr_conv_GetSimStateResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduGetSimStateResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GetSimStateResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduGetSimStateResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GetSimStateResponsePacket } dst
     * @returns { GetSimStateResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduGetSimStateResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { GetSimStateResponsePacket } src
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
     * @returns { GetSimStateResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GetSimStateResponsePacket());
    }
}
