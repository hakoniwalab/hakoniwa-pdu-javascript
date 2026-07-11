import { MapMetaData } from './pdu_jstype_MapMetaData.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Pose } from '../geometry_msgs/pdu_jstype_Pose.js';
import { PduPoseConverter } from '../geometry_msgs/pdu_cdr_conv_Pose.js';
import { Quaternion } from '../geometry_msgs/pdu_jstype_Quaternion.js';
import { PduQuaternionConverter } from '../geometry_msgs/pdu_cdr_conv_Quaternion.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduMapMetaDataConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MapMetaData } src
     */
    static to_cdr_body(writer, src) {
        PduTimeConverter.to_cdr_body(writer, src.map_load_time);
        writer.write_float32(src.resolution);
        writer.write_uint32(src.width);
        writer.write_uint32(src.height);
        PduPoseConverter.to_cdr_body(writer, src.origin);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MapMetaData } dst
     * @returns { MapMetaData }
     */
    static cdr_body_to_js(reader, dst) {
        PduTimeConverter.cdr_body_to_js(reader, dst.map_load_time);
        dst.resolution = reader.read_float32();
        dst.width = reader.read_uint32();
        dst.height = reader.read_uint32();
        PduPoseConverter.cdr_body_to_js(reader, dst.origin);
        return dst;
    }

    /**
     * @param { MapMetaData } src
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
     * @returns { MapMetaData }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MapMetaData());
    }
}
