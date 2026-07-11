import { DroneGoToResponsePacket } from './pdu_jstype_DroneGoToResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { DroneGoToResponse } from '../drone_srv_msgs/pdu_jstype_DroneGoToResponse.js';
import { PduDroneGoToResponseConverter } from '../drone_srv_msgs/pdu_cdr_conv_DroneGoToResponse.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduDroneGoToResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneGoToResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduDroneGoToResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneGoToResponsePacket } dst
     * @returns { DroneGoToResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduDroneGoToResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { DroneGoToResponsePacket } src
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
     * @returns { DroneGoToResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneGoToResponsePacket());
    }
}
