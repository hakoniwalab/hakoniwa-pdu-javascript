import { PointCloud } from './pdu_jstype_PointCloud.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { ChannelFloat32 } from '../sensor_msgs/pdu_jstype_ChannelFloat32.js';
import { PduChannelFloat32Converter } from '../sensor_msgs/pdu_cdr_conv_ChannelFloat32.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Point32 } from '../geometry_msgs/pdu_jstype_Point32.js';
import { PduPoint32Converter } from '../geometry_msgs/pdu_cdr_conv_Point32.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduPointCloudConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { PointCloud } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_sequence_length(src.points);
        for (const elem of src.points) {
            PduPoint32Converter.to_cdr_body(writer, elem);
        }
        writer.write_sequence_length(src.channels);
        for (const elem of src.channels) {
            PduChannelFloat32Converter.to_cdr_body(writer, elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { PointCloud } dst
     * @returns { PointCloud }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.points = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.points.push(PduPoint32Converter.cdr_body_to_js(reader, new Point32()));
        }
        dst.channels = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.channels.push(PduChannelFloat32Converter.cdr_body_to_js(reader, new ChannelFloat32()));
        }
        return dst;
    }

    /**
     * @param { PointCloud } src
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
     * @returns { PointCloud }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new PointCloud());
    }
}
