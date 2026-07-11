import { ServiceResponseHeader } from './pdu_jstype_ServiceResponseHeader.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduServiceResponseHeaderConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ServiceResponseHeader } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.request_id);
        writer.write_string(src.service_name);
        writer.write_string(src.client_name);
        writer.write_uint8(src.status);
        writer.write_uint8(src.processing_percentage);
        writer.write_int32(src.result_code);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ServiceResponseHeader } dst
     * @returns { ServiceResponseHeader }
     */
    static cdr_body_to_js(reader, dst) {
        dst.request_id = reader.read_uint32();
        dst.service_name = reader.read_string();
        dst.client_name = reader.read_string();
        dst.status = reader.read_uint8();
        dst.processing_percentage = reader.read_uint8();
        dst.result_code = reader.read_int32();
        return dst;
    }

    /**
     * @param { ServiceResponseHeader } src
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
     * @returns { ServiceResponseHeader }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ServiceResponseHeader());
    }
}
