import { DroneLandResponsePacket } from './pdu_jstype_DroneLandResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { DroneLandResponse } from '../drone_srv_msgs/pdu_jstype_DroneLandResponse.js';
import { PduDroneLandResponseConverter } from '../drone_srv_msgs/pdu_cdr_conv_DroneLandResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduDroneLandResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneLandResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduDroneLandResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneLandResponsePacket } dst
     * @returns { DroneLandResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduDroneLandResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { DroneLandResponsePacket } src
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
     * @returns { DroneLandResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneLandResponsePacket());
    }
}
