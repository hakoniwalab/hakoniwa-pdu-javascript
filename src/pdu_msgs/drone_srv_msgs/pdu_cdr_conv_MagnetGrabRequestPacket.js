import { MagnetGrabRequestPacket } from './pdu_jstype_MagnetGrabRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { MagnetGrabRequest } from '../drone_srv_msgs/pdu_jstype_MagnetGrabRequest.js';
import { PduMagnetGrabRequestConverter } from '../drone_srv_msgs/pdu_cdr_conv_MagnetGrabRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';


export class PduMagnetGrabRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MagnetGrabRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduMagnetGrabRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MagnetGrabRequestPacket } dst
     * @returns { MagnetGrabRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduMagnetGrabRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { MagnetGrabRequestPacket } src
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
     * @returns { MagnetGrabRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MagnetGrabRequestPacket());
    }
}
