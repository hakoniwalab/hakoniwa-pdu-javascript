import { GetSimStateResponse } from './pdu_jstype_GetSimStateResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduGetSimStateResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GetSimStateResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.sim_state);
        writer.write_int64(src.master_time);
        writer.write_bool(src.is_pdu_created);
        writer.write_bool(src.is_simulation_mode);
        writer.write_bool(src.is_pdu_sync_mode);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GetSimStateResponse } dst
     * @returns { GetSimStateResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.sim_state = reader.read_uint32();
        dst.master_time = reader.read_int64();
        dst.is_pdu_created = reader.read_bool();
        dst.is_simulation_mode = reader.read_bool();
        dst.is_pdu_sync_mode = reader.read_bool();
        return dst;
    }

    /**
     * @param { GetSimStateResponse } src
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
     * @returns { GetSimStateResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GetSimStateResponse());
    }
}
