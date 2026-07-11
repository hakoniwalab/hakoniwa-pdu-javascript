import { CameraSetTiltRequestPacket } from './pdu_jstype_CameraSetTiltRequestPacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { CameraSetTiltRequest } from '../drone_srv_msgs/pdu_jstype_CameraSetTiltRequest.js';
import { PduCameraSetTiltRequestConverter } from '../drone_srv_msgs/pdu_cdr_conv_CameraSetTiltRequest.js';
import { ServiceRequestHeader } from '../hako_srv_msgs/pdu_jstype_ServiceRequestHeader.js';
import { PduServiceRequestHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceRequestHeader.js';


export class PduCameraSetTiltRequestPacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { CameraSetTiltRequestPacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceRequestHeaderConverter.to_cdr_body(writer, src.header);
        PduCameraSetTiltRequestConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { CameraSetTiltRequestPacket } dst
     * @returns { CameraSetTiltRequestPacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceRequestHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduCameraSetTiltRequestConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { CameraSetTiltRequestPacket } src
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
     * @returns { CameraSetTiltRequestPacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new CameraSetTiltRequestPacket());
    }
}
