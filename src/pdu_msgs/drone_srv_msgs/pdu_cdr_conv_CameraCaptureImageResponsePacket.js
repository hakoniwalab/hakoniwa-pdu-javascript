import { CameraCaptureImageResponsePacket } from './pdu_jstype_CameraCaptureImageResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { CameraCaptureImageResponse } from '../drone_srv_msgs/pdu_jstype_CameraCaptureImageResponse.js';
import { PduCameraCaptureImageResponseConverter } from '../drone_srv_msgs/pdu_cdr_conv_CameraCaptureImageResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduCameraCaptureImageResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { CameraCaptureImageResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduCameraCaptureImageResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { CameraCaptureImageResponsePacket } dst
     * @returns { CameraCaptureImageResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduCameraCaptureImageResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { CameraCaptureImageResponsePacket } src
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
     * @returns { CameraCaptureImageResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new CameraCaptureImageResponsePacket());
    }
}
