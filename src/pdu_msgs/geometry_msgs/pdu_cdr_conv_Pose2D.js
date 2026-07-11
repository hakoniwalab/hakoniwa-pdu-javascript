import { Pose2D } from './pdu_jstype_Pose2D.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduPose2DConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Pose2D } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float64(src.x);
        writer.write_float64(src.y);
        writer.write_float64(src.theta);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Pose2D } dst
     * @returns { Pose2D }
     */
    static cdr_body_to_js(reader, dst) {
        dst.x = reader.read_float64();
        dst.y = reader.read_float64();
        dst.theta = reader.read_float64();
        return dst;
    }

    /**
     * @param { Pose2D } src
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
     * @returns { Pose2D }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Pose2D());
    }
}
