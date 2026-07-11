import { CameraSetTiltResponsePacket } from './pdu_jstype_CameraSetTiltResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { CameraSetTiltResponse } from '../drone_srv_msgs/pdu_jstype_CameraSetTiltResponse.js';
import { PduCameraSetTiltResponseConverter } from '../drone_srv_msgs/pdu_cdr_conv_CameraSetTiltResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduCameraSetTiltResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { CameraSetTiltResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduCameraSetTiltResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { CameraSetTiltResponsePacket } dst
     * @returns { CameraSetTiltResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduCameraSetTiltResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { CameraSetTiltResponsePacket } src
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
     * @returns { CameraSetTiltResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new CameraSetTiltResponsePacket());
    }
}
