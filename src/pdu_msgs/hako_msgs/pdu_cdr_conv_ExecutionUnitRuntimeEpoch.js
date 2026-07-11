import { ExecutionUnitRuntimeEpoch } from './pdu_jstype_ExecutionUnitRuntimeEpoch.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduExecutionUnitRuntimeEpochConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ExecutionUnitRuntimeEpoch } src
     */
    static to_cdr_body(writer, src) {
        writer.write_sequence_length(src.epoch);
        for (const elem of src.epoch) {
            writer.write_uint8(elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ExecutionUnitRuntimeEpoch } dst
     * @returns { ExecutionUnitRuntimeEpoch }
     */
    static cdr_body_to_js(reader, dst) {
        dst.epoch = Array.from({ length: reader.read_uint32() }, () => reader.read_uint8());
        return dst;
    }

    /**
     * @param { ExecutionUnitRuntimeEpoch } src
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
     * @returns { ExecutionUnitRuntimeEpoch }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ExecutionUnitRuntimeEpoch());
    }
}
