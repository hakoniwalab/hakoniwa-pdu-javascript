import { DisturbanceBoundary } from './pdu_jstype_DisturbanceBoundary.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduDisturbanceBoundaryConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { DisturbanceBoundary } src
     */
    static to_cdr_body(writer, src) {
        PduPointConverter.to_cdr_body(writer, src.boundary_point);
        PduVector3Converter.to_cdr_body(writer, src.boundary_normal);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { DisturbanceBoundary } dst
     * @returns { DisturbanceBoundary }
     */
    static cdr_body_to_js(reader, dst) {
        PduPointConverter.cdr_body_to_js(reader, dst.boundary_point);
        PduVector3Converter.cdr_body_to_js(reader, dst.boundary_normal);
        return dst;
    }

    /**
     * @param { DisturbanceBoundary } src
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
     * @returns { DisturbanceBoundary }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new DisturbanceBoundary());
    }
}
