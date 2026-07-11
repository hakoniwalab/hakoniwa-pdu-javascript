import { OccupancyGrid } from './pdu_jstype_OccupancyGrid.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { MapMetaData } from '../nav_msgs/pdu_jstype_MapMetaData.js';
import { PduMapMetaDataConverter } from '../nav_msgs/pdu_cdr_conv_MapMetaData.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Pose } from '../geometry_msgs/pdu_jstype_Pose.js';
import { PduPoseConverter } from '../geometry_msgs/pdu_cdr_conv_Pose.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduOccupancyGridConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { OccupancyGrid } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduMapMetaDataConverter.to_cdr_body(writer, src.info);
        writer.write_sequence_length(src.data);
        for (const elem of src.data) {
            writer.write_int8(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { OccupancyGrid } dst
     * @returns { OccupancyGrid }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduMapMetaDataConverter.cdr_body_to_js(reader, dst.info);
        dst.data = Array.from({ length: reader.read_uint32() }, () => reader.read_int8());
        return dst;
    }

    /**
     * @param { OccupancyGrid } src
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
     * @returns { OccupancyGrid }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new OccupancyGrid());
    }
}
