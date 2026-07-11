import { InertiaStamped } from './pdu_jstype_InertiaStamped.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Inertia } from '../geometry_msgs/pdu_jstype_Inertia.js';
import { PduInertiaConverter } from '../geometry_msgs/pdu_cdr_conv_Inertia.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduInertiaStampedConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { InertiaStamped } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduInertiaConverter.to_cdr_body(writer, src.inertia);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { InertiaStamped } dst
     * @returns { InertiaStamped }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduInertiaConverter.cdr_body_to_js(reader, dst.inertia);
        return dst;
    }

    /**
     * @param { InertiaStamped } src
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
     * @returns { InertiaStamped }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new InertiaStamped());
    }
}
