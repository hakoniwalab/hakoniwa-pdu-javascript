import { GetEventResponsePacket } from './pdu_jstype_GetEventResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { GetEventResponse } from '../hako_srv_msgs/pdu_jstype_GetEventResponse.js';
import { PduGetEventResponseConverter } from '../hako_srv_msgs/pdu_cdr_conv_GetEventResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduGetEventResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GetEventResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduGetEventResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GetEventResponsePacket } dst
     * @returns { GetEventResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduGetEventResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { GetEventResponsePacket } src
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
     * @returns { GetEventResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GetEventResponsePacket());
    }
}
