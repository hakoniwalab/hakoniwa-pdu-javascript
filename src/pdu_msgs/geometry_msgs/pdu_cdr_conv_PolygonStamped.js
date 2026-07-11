import { PolygonStamped } from './pdu_jstype_PolygonStamped.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Point32 } from '../geometry_msgs/pdu_jstype_Point32.js';
import { PduPoint32Converter } from '../geometry_msgs/pdu_cdr_conv_Point32.js';
import { Polygon } from '../geometry_msgs/pdu_jstype_Polygon.js';
import { PduPolygonConverter } from '../geometry_msgs/pdu_cdr_conv_Polygon.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduPolygonStampedConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { PolygonStamped } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        PduPolygonConverter.to_cdr_body(writer, src.polygon);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { PolygonStamped } dst
     * @returns { PolygonStamped }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        PduPolygonConverter.cdr_body_to_js(reader, dst.polygon);
        return dst;
    }

    /**
     * @param { PolygonStamped } src
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
     * @returns { PolygonStamped }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new PolygonStamped());
    }
}
