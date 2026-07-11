import { LiDARScanResponsePacket } from './pdu_jstype_LiDARScanResponsePacket.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { LiDARScanResponse } from '../drone_srv_msgs/pdu_jstype_LiDARScanResponse.js';
import { PduLiDARScanResponseConverter } from '../drone_srv_msgs/pdu_cdr_conv_LiDARScanResponse.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { PointCloud2 } from '../sensor_msgs/pdu_jstype_PointCloud2.js';
import { PduPointCloud2Converter } from '../sensor_msgs/pdu_cdr_conv_PointCloud2.js';
import { PointField } from '../sensor_msgs/pdu_jstype_PointField.js';
import { PduPointFieldConverter } from '../sensor_msgs/pdu_cdr_conv_PointField.js';
import { Pose } from '../geometry_msgs/pdu_jstype_Pose.js';
import { PduPoseConverter } from '../geometry_msgs/pdu_cdr_conv_Pose.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';
import { ServiceResponseHeader } from '../hako_srv_msgs/pdu_jstype_ServiceResponseHeader.js';
import { PduServiceResponseHeaderConverter } from '../hako_srv_msgs/pdu_cdr_conv_ServiceResponseHeader.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduLiDARScanResponsePacketConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { LiDARScanResponsePacket } src
     */
    static to_cdr_body(writer, src) {
        PduServiceResponseHeaderConverter.to_cdr_body(writer, src.header);
        PduLiDARScanResponseConverter.to_cdr_body(writer, src.body);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { LiDARScanResponsePacket } dst
     * @returns { LiDARScanResponsePacket }
     */
    static cdr_body_to_js(reader, dst) {
        PduServiceResponseHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduLiDARScanResponseConverter.cdr_body_to_js(reader, dst.body);
        return dst;
    }

    /**
     * @param { LiDARScanResponsePacket } src
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
     * @returns { LiDARScanResponsePacket }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new LiDARScanResponsePacket());
    }
}
