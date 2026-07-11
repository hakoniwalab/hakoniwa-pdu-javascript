import { ExecutionUnitRuntimeNode } from './pdu_jstype_ExecutionUnitRuntimeNode.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduExecutionUnitRuntimeNodeConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ExecutionUnitRuntimeNode } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.node_id);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ExecutionUnitRuntimeNode } dst
     * @returns { ExecutionUnitRuntimeNode }
     */
    static cdr_body_to_js(reader, dst) {
        dst.node_id = reader.read_uint32();
        return dst;
    }

    /**
     * @param { ExecutionUnitRuntimeNode } src
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
     * @returns { ExecutionUnitRuntimeNode }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ExecutionUnitRuntimeNode());
    }
}
