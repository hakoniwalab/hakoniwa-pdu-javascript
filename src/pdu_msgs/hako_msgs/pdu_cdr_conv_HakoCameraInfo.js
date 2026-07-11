import { HakoCameraInfo } from './pdu_jstype_HakoCameraInfo.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduHakoCameraInfoConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoCameraInfo } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int32(src.request_id);
        PduVector3Converter.to_cdr_body(writer, src.angle);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoCameraInfo } dst
     * @returns { HakoCameraInfo }
     */
    static cdr_body_to_js(reader, dst) {
        dst.request_id = reader.read_int32();
        PduVector3Converter.cdr_body_to_js(reader, dst.angle);
        return dst;
    }

    /**
     * @param { HakoCameraInfo } src
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
     * @returns { HakoCameraInfo }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoCameraInfo());
    }
}
