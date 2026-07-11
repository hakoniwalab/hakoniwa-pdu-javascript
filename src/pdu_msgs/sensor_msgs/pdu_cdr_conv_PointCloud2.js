import { PointCloud2 } from './pdu_jstype_PointCloud2.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { PointField } from '../sensor_msgs/pdu_jstype_PointField.js';
import { PduPointFieldConverter } from '../sensor_msgs/pdu_cdr_conv_PointField.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduPointCloud2Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { PointCloud2 } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_uint32(src.height);
        writer.write_uint32(src.width);
        writer.write_sequence_length(src.fields);
        for (const elem of src.fields) {
            PduPointFieldConverter.to_cdr_body(writer, elem);
        }
        writer.write_bool(src.is_bigendian);
        writer.write_uint32(src.point_step);
        writer.write_uint32(src.row_step);
        writer.write_sequence_length(src.data);
        for (const elem of src.data) {
            writer.write_uint8(elem);
        }
        writer.write_bool(src.is_dense);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { PointCloud2 } dst
     * @returns { PointCloud2 }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.height = reader.read_uint32();
        dst.width = reader.read_uint32();
        dst.fields = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.fields.push(PduPointFieldConverter.cdr_body_to_js(reader, new PointField()));
        }
        dst.is_bigendian = reader.read_bool();
        dst.point_step = reader.read_uint32();
        dst.row_step = reader.read_uint32();
        dst.data = Array.from({ length: reader.read_uint32() }, () => reader.read_uint8());
        dst.is_dense = reader.read_bool();
        return dst;
    }

    /**
     * @param { PointCloud2 } src
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
     * @returns { PointCloud2 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new PointCloud2());
    }
}
