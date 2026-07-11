import { SimControlResponsePacket } from './pdu_jstype_SimControlResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';
import { SimControlResponse } from '../hako_srv_msgs/pdu_jstype_SimControlResponse.js';
import { PduSimControlResponseConverter } from '../hako_srv_msgs/pdu_cdr_conv_SimControlResponse.js';


export class PduSimControlResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { SimControlResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduSimControlResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { SimControlResponsePacket } dst
     * @returns { SimControlResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduSimControlResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { SimControlResponsePacket } src
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
     * @returns { SimControlResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new SimControlResponsePacket());
    }
}
