import { ShareObjectOwnerRequest } from './pdu_jstype_ShareObjectOwnerRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduShareObjectOwnerRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ShareObjectOwnerRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.object_name);
        writer.write_uint32(src.request_type);
        writer.write_uint32(src.new_owner_id);
        writer.write_uint64(src.request_time);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ShareObjectOwnerRequest } dst
     * @returns { ShareObjectOwnerRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.object_name = reader.read_string();
        dst.request_type = reader.read_uint32();
        dst.new_owner_id = reader.read_uint32();
        dst.request_time = reader.read_uint64();
        return dst;
    }

    /**
     * @param { ShareObjectOwnerRequest } src
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
     * @returns { ShareObjectOwnerRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ShareObjectOwnerRequest());
    }
}
