import { HakoDroneCmdTakeoff } from './pdu_jstype_HakoDroneCmdTakeoff.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { HakoDroneCmdHeader } from '../hako_msgs/pdu_jstype_HakoDroneCmdHeader.js';
import { PduHakoDroneCmdHeaderConverter } from '../hako_msgs/pdu_cdr_conv_HakoDroneCmdHeader.js';


export class PduHakoDroneCmdTakeoffConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoDroneCmdTakeoff } src
     */
    static to_cdr_body(writer, src) {
        PduHakoDroneCmdHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_float64(src.height);
        writer.write_float64(src.speed);
        writer.write_float64(src.yaw_deg);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoDroneCmdTakeoff } dst
     * @returns { HakoDroneCmdTakeoff }
     */
    static cdr_body_to_js(reader, dst) {
        PduHakoDroneCmdHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.height = reader.read_float64();
        dst.speed = reader.read_float64();
        dst.yaw_deg = reader.read_float64();
        return dst;
    }

    /**
     * @param { HakoDroneCmdTakeoff } src
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
     * @returns { HakoDroneCmdTakeoff }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoDroneCmdTakeoff());
    }
}
