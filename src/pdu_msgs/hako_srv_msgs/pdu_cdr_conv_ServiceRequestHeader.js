import { ServiceRequestHeader } from './pdu_jstype_ServiceRequestHeader.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduServiceRequestHeaderConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ServiceRequestHeader } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.request_id);
        writer.write_string(src.service_name);
        writer.write_string(src.client_name);
        writer.write_uint8(src.opcode);
        writer.write_int32(src.status_poll_interval_msec);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ServiceRequestHeader } dst
     * @returns { ServiceRequestHeader }
     */
    static cdr_body_to_js(reader, dst) {
        dst.request_id = reader.read_uint32();
        dst.service_name = reader.read_string();
        dst.client_name = reader.read_string();
        dst.opcode = reader.read_uint8();
        dst.status_poll_interval_msec = reader.read_int32();
        return dst;
    }

    /**
     * @param { ServiceRequestHeader } src
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
     * @returns { ServiceRequestHeader }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ServiceRequestHeader());
    }
}
