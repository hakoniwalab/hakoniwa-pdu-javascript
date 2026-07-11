import { MagnetGrabResponsePacket } from './pdu_jstype_MagnetGrabResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { MagnetGrabResponse } from '../drone_srv_msgs/pdu_jstype_MagnetGrabResponse.js';
import { PduMagnetGrabResponseConverter } from '../drone_srv_msgs/pdu_cdr_conv_MagnetGrabResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduMagnetGrabResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MagnetGrabResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduMagnetGrabResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MagnetGrabResponsePacket } dst
     * @returns { MagnetGrabResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduMagnetGrabResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { MagnetGrabResponsePacket } src
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
     * @returns { MagnetGrabResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MagnetGrabResponsePacket());
    }
}
