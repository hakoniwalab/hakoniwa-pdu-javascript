import { LiDARScanResponse } from './pdu_jstype_LiDARScanResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
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
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduLiDARScanResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { LiDARScanResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.ok);
        PduPointCloud2Converter.to_cdr_body(writer, src.point_cloud);
        PduPoseConverter.to_cdr_body(writer, src.lidar_pose);
        writer.write_string(src.message);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { LiDARScanResponse } dst
     * @returns { LiDARScanResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.ok = reader.read_bool();
        PduPointCloud2Converter.cdr_body_to_js(reader, dst.point_cloud);
        PduPoseConverter.cdr_body_to_js(reader, dst.lidar_pose);
        dst.message = reader.read_string();
        return dst;
    }

    /**
     * @param { LiDARScanResponse } src
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
     * @returns { LiDARScanResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new LiDARScanResponse());
    }
}
