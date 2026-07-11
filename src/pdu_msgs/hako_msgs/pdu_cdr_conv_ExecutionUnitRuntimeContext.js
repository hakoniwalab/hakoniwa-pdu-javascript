import { ExecutionUnitRuntimeContext } from './pdu_jstype_ExecutionUnitRuntimeContext.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduExecutionUnitRuntimeContextConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ExecutionUnitRuntimeContext } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.config_hash);
        writer.write_uint8(src.epoch);
        writer.write_uint8(src.owner_id);
        writer.write_sequence_length(src.context);
        for (const elem of src.context) {
            writer.write_uint8(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ExecutionUnitRuntimeContext } dst
     * @returns { ExecutionUnitRuntimeContext }
     */
    static cdr_body_to_js(reader, dst) {
        dst.config_hash = reader.read_uint32();
        dst.epoch = reader.read_uint8();
        dst.owner_id = reader.read_uint8();
        dst.context = Array.from({ length: reader.read_uint32() }, () => reader.read_uint8());
        return dst;
    }

    /**
     * @param { ExecutionUnitRuntimeContext } src
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
     * @returns { ExecutionUnitRuntimeContext }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ExecutionUnitRuntimeContext());
    }
}
