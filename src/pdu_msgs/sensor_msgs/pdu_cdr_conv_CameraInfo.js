import { CameraInfo } from './pdu_jstype_CameraInfo.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { RegionOfInterest } from '../sensor_msgs/pdu_jstype_RegionOfInterest.js';
import { PduRegionOfInterestConverter } from '../sensor_msgs/pdu_cdr_conv_RegionOfInterest.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduCameraInfoConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { CameraInfo } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_uint32(src.height);
        writer.write_uint32(src.width);
        writer.write_string(src.distortion_model);
        writer.write_sequence_length(src.d);
        for (const elem of src.d) {
            writer.write_float64(elem);
        }
        {
            const values = src.k;
            for (let i = 0; i < 9; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
        {
            const values = src.r;
            for (let i = 0; i < 9; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
        {
            const values = src.p;
            for (let i = 0; i < 12; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
        writer.write_uint32(src.binning_x);
        writer.write_uint32(src.binning_y);
        PduRegionOfInterestConverter.to_cdr_body(writer, src.roi);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { CameraInfo } dst
     * @returns { CameraInfo }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.height = reader.read_uint32();
        dst.width = reader.read_uint32();
        dst.distortion_model = reader.read_string();
        dst.d = Array.from({ length: reader.read_uint32() }, () => reader.read_float64());
        dst.k = Array.from({ length: 9 }, () => reader.read_float64());
        dst.r = Array.from({ length: 9 }, () => reader.read_float64());
        dst.p = Array.from({ length: 12 }, () => reader.read_float64());
        dst.binning_x = reader.read_uint32();
        dst.binning_y = reader.read_uint32();
        PduRegionOfInterestConverter.cdr_body_to_js(reader, dst.roi);
        return dst;
    }

    /**
     * @param { CameraInfo } src
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
     * @returns { CameraInfo }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new CameraInfo());
    }
}
