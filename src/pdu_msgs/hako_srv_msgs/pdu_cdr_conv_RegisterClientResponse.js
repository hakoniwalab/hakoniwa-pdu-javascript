import { RegisterClientResponse } from './pdu_jstype_RegisterClientResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduRegisterClientResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { RegisterClientResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.service_id);
        writer.write_uint32(src.client_id);
        writer.write_uint32(src.request_channel_id);
        writer.write_uint32(src.response_channel_id);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { RegisterClientResponse } dst
     * @returns { RegisterClientResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.service_id = reader.read_uint32();
        dst.client_id = reader.read_uint32();
        dst.request_channel_id = reader.read_uint32();
        dst.response_channel_id = reader.read_uint32();
        return dst;
    }

    /**
     * @param { RegisterClientResponse } src
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
     * @returns { RegisterClientResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new RegisterClientResponse());
    }
}
