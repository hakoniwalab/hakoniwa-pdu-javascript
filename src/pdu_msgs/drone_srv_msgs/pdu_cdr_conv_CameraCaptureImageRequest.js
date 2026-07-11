import { CameraCaptureImageRequest } from './pdu_jstype_CameraCaptureImageRequest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduCameraCaptureImageRequestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { CameraCaptureImageRequest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.drone_name);
        writer.write_string(src.image_type);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { CameraCaptureImageRequest } dst
     * @returns { CameraCaptureImageRequest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.drone_name = reader.read_string();
        dst.image_type = reader.read_string();
        return dst;
    }

    /**
     * @param { CameraCaptureImageRequest } src
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
     * @returns { CameraCaptureImageRequest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new CameraCaptureImageRequest());
    }
}
