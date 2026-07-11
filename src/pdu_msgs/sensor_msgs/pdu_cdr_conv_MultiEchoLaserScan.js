import { MultiEchoLaserScan } from './pdu_jstype_MultiEchoLaserScan.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { LaserEcho } from '../sensor_msgs/pdu_jstype_LaserEcho.js';
import { PduLaserEchoConverter } from '../sensor_msgs/pdu_cdr_conv_LaserEcho.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduMultiEchoLaserScanConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MultiEchoLaserScan } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_float32(src.angle_min);
        writer.write_float32(src.angle_max);
        writer.write_float32(src.angle_increment);
        writer.write_float32(src.time_increment);
        writer.write_float32(src.scan_time);
        writer.write_float32(src.range_min);
        writer.write_float32(src.range_max);
        writer.write_sequence_length(src.ranges);
        for (const elem of src.ranges) {
            PduLaserEchoConverter.to_cdr_body(writer, elem);
        }
        writer.write_sequence_length(src.intensities);
        for (const elem of src.intensities) {
            PduLaserEchoConverter.to_cdr_body(writer, elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MultiEchoLaserScan } dst
     * @returns { MultiEchoLaserScan }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.angle_min = reader.read_float32();
        dst.angle_max = reader.read_float32();
        dst.angle_increment = reader.read_float32();
        dst.time_increment = reader.read_float32();
        dst.scan_time = reader.read_float32();
        dst.range_min = reader.read_float32();
        dst.range_max = reader.read_float32();
        dst.ranges = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.ranges.push(PduLaserEchoConverter.cdr_body_to_js(reader, new LaserEcho()));
        }
        dst.intensities = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.intensities.push(PduLaserEchoConverter.cdr_body_to_js(reader, new LaserEcho()));
        }
        return dst;
    }

    /**
     * @param { MultiEchoLaserScan } src
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
     * @returns { MultiEchoLaserScan }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MultiEchoLaserScan());
    }
}
