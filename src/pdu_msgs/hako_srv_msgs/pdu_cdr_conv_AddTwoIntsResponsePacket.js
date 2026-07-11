import { AddTwoIntsResponsePacket } from './pdu_jstype_AddTwoIntsResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { AddTwoIntsResponse } from '../hako_srv_msgs/pdu_jstype_AddTwoIntsResponse.js';
import { PduAddTwoIntsResponseConverter } from '../hako_srv_msgs/pdu_cdr_conv_AddTwoIntsResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduAddTwoIntsResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { AddTwoIntsResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduAddTwoIntsResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { AddTwoIntsResponsePacket } dst
     * @returns { AddTwoIntsResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduAddTwoIntsResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { AddTwoIntsResponsePacket } src
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
     * @returns { AddTwoIntsResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new AddTwoIntsResponsePacket());
    }
}
