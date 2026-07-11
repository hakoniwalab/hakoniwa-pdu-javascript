import { CameraCaptureImageResponse } from './pdu_jstype_CameraCaptureImageResponse.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduCameraCaptureImageResponseConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { CameraCaptureImageResponse } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.ok);
        writer.write_sequence_length(src.data);
        for (const elem of src.data) {
            writer.write_uint8(elem);
        }
        writer.write_string(src.message);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { CameraCaptureImageResponse } dst
     * @returns { CameraCaptureImageResponse }
     */
    static cdr_body_to_js(reader, dst) {
        dst.ok = reader.read_bool();
        dst.data = Array.from({ length: reader.read_uint32() }, () => reader.read_uint8());
        dst.message = reader.read_string();
        return dst;
    }

    /**
     * @param { CameraCaptureImageResponse } src
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
     * @returns { CameraCaptureImageResponse }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new CameraCaptureImageResponse());
    }
}
