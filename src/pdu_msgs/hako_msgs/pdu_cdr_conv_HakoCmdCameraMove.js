import { HakoCmdCameraMove } from './pdu_jstype_HakoCmdCameraMove.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { HakoCmdHeader } from '../hako_msgs/pdu_jstype_HakoCmdHeader.js';
import { PduHakoCmdHeaderConverter } from '../hako_msgs/pdu_cdr_conv_HakoCmdHeader.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduHakoCmdCameraMoveConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoCmdCameraMove } src
     */
    static to_cdr_body(writer, src) {
        PduHakoCmdHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_int32(src.request_id);
        PduVector3Converter.to_cdr_body(writer, src.angle);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoCmdCameraMove } dst
     * @returns { HakoCmdCameraMove }
     */
    static cdr_body_to_js(reader, dst) {
        PduHakoCmdHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.request_id = reader.read_int32();
        PduVector3Converter.cdr_body_to_js(reader, dst.angle);
        return dst;
    }

    /**
     * @param { HakoCmdCameraMove } src
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
     * @returns { HakoCmdCameraMove }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoCmdCameraMove());
    }
}
