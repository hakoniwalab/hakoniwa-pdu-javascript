import { DroneGetStateResponsePacket } from './pdu_jstype_DroneGetStateResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { DroneGetStateResponse } from '../drone_srv_msgs/pdu_jstype_DroneGetStateResponse.js';
import { PduDroneGetStateResponseConverter } from '../drone_srv_msgs/pdu_cdr_conv_DroneGetStateResponse.js';
import { HakoBatteryStatus } from '../hako_msgs/pdu_jstype_HakoBatteryStatus.js';
import { PduHakoBatteryStatusConverter } from '../hako_msgs/pdu_cdr_conv_HakoBatteryStatus.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Pose } from '../geometry_msgs/pdu_jstype_Pose.js';
import { PduPoseConverter } from '../geometry_msgs/pdu_cdr_conv_Pose.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';


export class PduDroneGetStateResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneGetStateResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduDroneGetStateResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneGetStateResponsePacket } dst
     * @returns { DroneGetStateResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduDroneGetStateResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { DroneGetStateResponsePacket } src
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
     * @returns { DroneGetStateResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneGetStateResponsePacket());
    }
}
