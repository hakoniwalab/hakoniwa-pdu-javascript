import { DroneGetStateResponse } from './pdu_jstype_DroneGetStateResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { HakoBatteryStatus } from '../hako_msgs/pdu_jstype_HakoBatteryStatus.js';
import { PduHakoBatteryStatusConverter } from '../hako_msgs/pdu_cdr_conv_HakoBatteryStatus.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Pose } from '../geometry_msgs/pdu_jstype_Pose.js';
import { PduPoseConverter } from '../geometry_msgs/pdu_cdr_conv_Pose.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';


export class PduDroneGetStateResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneGetStateResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.ok);
        writer.write_bool(src.is_ready);
        PduPoseConverter.to_cdr_body(writer, src.current_pose);
        PduHakoBatteryStatusConverter.to_cdr_body(writer, src.battery_status);
        writer.write_string(src.mode);
        writer.write_string(src.message);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneGetStateResponse } dst
     * @returns { DroneGetStateResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.ok = reader.read_bool();
        dst.is_ready = reader.read_bool();
        PduPoseConverter.cdr_body_to_js(reader, dst.current_pose);
        PduHakoBatteryStatusConverter.cdr_body_to_js(reader, dst.battery_status);
        dst.mode = reader.read_string();
        dst.message = reader.read_string();
        return dst;
    }

    /**
     * @param { DroneGetStateResponse } src
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
     * @returns { DroneGetStateResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneGetStateResponse());
    }
}
