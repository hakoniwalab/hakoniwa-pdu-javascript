import { Polygon } from './pdu_jstype_Polygon.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Point32 } from '../geometry_msgs/pdu_jstype_Point32.js';
import { PduPoint32Converter } from '../geometry_msgs/pdu_cdr_conv_Point32.js';


export class PduPolygonConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Polygon } src
     */
    static to_cdr_body(writer, src) {
        writer.write_sequence_length(src.points);
        for (const elem of src.points) {
            PduPoint32Converter.to_cdr_body(writer, elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Polygon } dst
     * @returns { Polygon }
     */
    static cdr_body_to_js(reader, dst) {
        dst.points = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.points.push(PduPoint32Converter.cdr_body_to_js(reader, new Point32()));
        }
        return dst;
    }

    /**
     * @param { Polygon } src
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
     * @returns { Polygon }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Polygon());
    }
}
