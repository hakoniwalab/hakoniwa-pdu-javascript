import { ShareObjectOwnerResponse } from './pdu_jstype_ShareObjectOwnerResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduShareObjectOwnerResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ShareObjectOwnerResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.object_name);
        writer.write_uint32(src.request_type);
        writer.write_uint32(src.owner_id);
        writer.write_bool(src.accepted);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ShareObjectOwnerResponse } dst
     * @returns { ShareObjectOwnerResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.object_name = reader.read_string();
        dst.request_type = reader.read_uint32();
        dst.owner_id = reader.read_uint32();
        dst.accepted = reader.read_bool();
        return dst;
    }

    /**
     * @param { ShareObjectOwnerResponse } src
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
     * @returns { ShareObjectOwnerResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ShareObjectOwnerResponse());
    }
}
