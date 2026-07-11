import { ExecutionUnitRuntimeStatus } from './pdu_jstype_ExecutionUnitRuntimeStatus.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduExecutionUnitRuntimeStatusConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ExecutionUnitRuntimeStatus } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.config_hash);
        writer.write_uint16(src.unit_count);
        writer.write_sequence_length(src.status);
        for (const elem of src.status) {
            writer.write_uint8(elem);
        }
        writer.write_sequence_length(src.epoch);
        for (const elem of src.epoch) {
            writer.write_uint8(elem);
        }
        writer.write_sequence_length(src.curr_owner_node_id);
        for (const elem of src.curr_owner_node_id) {
            writer.write_uint8(elem);
        }
        writer.write_sequence_length(src.next_owner_node_id);
        for (const elem of src.next_owner_node_id) {
            writer.write_uint8(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ExecutionUnitRuntimeStatus } dst
     * @returns { ExecutionUnitRuntimeStatus }
     */
    static cdr_body_to_js(reader, dst) {
        dst.config_hash = reader.read_uint32();
        dst.unit_count = reader.read_uint16();
        dst.status = Array.from({ length: reader.read_uint32() }, () => reader.read_uint8());
        dst.epoch = Array.from({ length: reader.read_uint32() }, () => reader.read_uint8());
        dst.curr_owner_node_id = Array.from({ length: reader.read_uint32() }, () => reader.read_uint8());
        dst.next_owner_node_id = Array.from({ length: reader.read_uint32() }, () => reader.read_uint8());
        return dst;
    }

    /**
     * @param { ExecutionUnitRuntimeStatus } src
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
     * @returns { ExecutionUnitRuntimeStatus }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ExecutionUnitRuntimeStatus());
    }
}
