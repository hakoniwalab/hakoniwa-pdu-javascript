import { CameraCaptureImageRequestPacket } from './pdu_jstype_CameraCaptureImageRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { CameraCaptureImageRequest } from '../drone_srv_msgs/pdu_jstype_CameraCaptureImageRequest.js';
import { PduCameraCaptureImageRequestConverter } from '../drone_srv_msgs/pdu_cdr_conv_CameraCaptureImageRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';


export class PduCameraCaptureImageRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { CameraCaptureImageRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduCameraCaptureImageRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { CameraCaptureImageRequestPacket } dst
     * @returns { CameraCaptureImageRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduCameraCaptureImageRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { CameraCaptureImageRequestPacket } src
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
     * @returns { CameraCaptureImageRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new CameraCaptureImageRequestPacket());
    }
}
