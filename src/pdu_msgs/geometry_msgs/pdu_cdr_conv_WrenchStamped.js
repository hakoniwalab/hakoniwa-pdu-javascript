import { WrenchStamped } from './pdu_jstype_WrenchStamped.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';
import { Wrench } from '../geometry_msgs/pdu_jstype_Wrench.js';
import { PduWrenchConverter } from '../geometry_msgs/pdu_cdr_conv_Wrench.js';


export class PduWrenchStampedConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { WrenchStamped } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduWrenchConverter.to_cdr_body(writer, src.wrench);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { WrenchStamped } dst
     * @returns { WrenchStamped }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduWrenchConverter.cdr_body_to_js(reader, dst.wrench);
        return dst;
    }

    /**
     * @param { WrenchStamped } src
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
     * @returns { WrenchStamped }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new WrenchStamped());
    }
}
