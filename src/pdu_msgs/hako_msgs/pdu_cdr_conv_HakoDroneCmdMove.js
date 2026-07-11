import { HakoDroneCmdMove } from './pdu_jstype_HakoDroneCmdMove.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { HakoDroneCmdHeader } from '../hako_msgs/pdu_jstype_HakoDroneCmdHeader.js';
import { PduHakoDroneCmdHeaderConverter } from '../hako_msgs/pdu_cdr_conv_HakoDroneCmdHeader.js';


export class PduHakoDroneCmdMoveConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoDroneCmdMove } src
     */
    static to_cdr_body(writer, src) {
        PduHakoDroneCmdHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_float64(src.x);
        writer.write_float64(src.y);
        writer.write_float64(src.z);
        writer.write_float64(src.speed);
        writer.write_float64(src.yaw_deg);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoDroneCmdMove } dst
     * @returns { HakoDroneCmdMove }
     */
    static cdr_body_to_js(reader, dst) {
        PduHakoDroneCmdHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.x = reader.read_float64();
        dst.y = reader.read_float64();
        dst.z = reader.read_float64();
        dst.speed = reader.read_float64();
        dst.yaw_deg = reader.read_float64();
        return dst;
    }

    /**
     * @param { HakoDroneCmdMove } src
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
     * @returns { HakoDroneCmdMove }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoDroneCmdMove());
    }
}
