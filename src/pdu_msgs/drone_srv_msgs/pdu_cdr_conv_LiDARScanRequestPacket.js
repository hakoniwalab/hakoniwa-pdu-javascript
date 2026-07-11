import { LiDARScanRequestPacket } from './pdu_jstype_LiDARScanRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { LiDARScanRequest } from '../drone_srv_msgs/pdu_jstype_LiDARScanRequest.js';
import { PduLiDARScanRequestConverter } from '../drone_srv_msgs/pdu_cdr_conv_LiDARScanRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';


export class PduLiDARScanRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { LiDARScanRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduLiDARScanRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { LiDARScanRequestPacket } dst
     * @returns { LiDARScanRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduLiDARScanRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { LiDARScanRequestPacket } src
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
     * @returns { LiDARScanRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new LiDARScanRequestPacket());
    }
}
