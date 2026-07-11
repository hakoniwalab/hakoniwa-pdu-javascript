import { DroneVisualStateArray } from './pdu_jstype_DroneVisualStateArray.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { DroneVisualState } from '../hako_msgs/pdu_jstype_DroneVisualState.js';
import { PduDroneVisualStateConverter } from '../hako_msgs/pdu_cdr_conv_DroneVisualState.js';


export class PduDroneVisualStateArrayConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DroneVisualStateArray } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.sequence_id);
        writer.write_uint32(src.chunk_index);
        writer.write_uint32(src.chunk_count);
        writer.write_uint32(src.start_index);
        writer.write_uint32(src.valid_count);
        writer.write_sequence_length(src.drones);
        for (const elem of src.drones) {
            PduDroneVisualStateConverter.to_cdr_body(writer, elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DroneVisualStateArray } dst
     * @returns { DroneVisualStateArray }
     */
    static cdr_body_to_js(reader, dst) {
        dst.sequence_id = reader.read_uint32();
        dst.chunk_index = reader.read_uint32();
        dst.chunk_count = reader.read_uint32();
        dst.start_index = reader.read_uint32();
        dst.valid_count = reader.read_uint32();
        dst.drones = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.drones.push(PduDroneVisualStateConverter.cdr_body_to_js(reader, new DroneVisualState()));
        }
        return dst;
    }

    /**
     * @param { DroneVisualStateArray } src
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
     * @returns { DroneVisualStateArray }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DroneVisualStateArray());
    }
}
