import { Inertia } from './pdu_jstype_Inertia.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduInertiaConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Inertia } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float64(src.m);
        PduVector3Converter.to_cdr_body(writer, src.com);
        writer.write_float64(src.ixx);
        writer.write_float64(src.ixy);
        writer.write_float64(src.ixz);
        writer.write_float64(src.iyy);
        writer.write_float64(src.iyz);
        writer.write_float64(src.izz);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Inertia } dst
     * @returns { Inertia }
     */
    static cdr_body_to_js(reader, dst) {
        dst.m = reader.read_float64();
        PduVector3Converter.cdr_body_to_js(reader, dst.com);
        dst.ixx = reader.read_float64();
        dst.ixy = reader.read_float64();
        dst.ixz = reader.read_float64();
        dst.iyy = reader.read_float64();
        dst.iyz = reader.read_float64();
        dst.izz = reader.read_float64();
        return dst;
    }

    /**
     * @param { Inertia } src
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
     * @returns { Inertia }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Inertia());
    }
}
