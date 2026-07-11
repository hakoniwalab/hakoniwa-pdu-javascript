import { Collision } from './pdu_jstype_Collision.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduCollisionConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Collision } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.collision);
        writer.write_uint32(src.contact_num);
        PduVector3Converter.to_cdr_body(writer, src.relative_velocity);
        {
            const values = src.contact_position;
            for (let i = 0; i < 10; i++) {
                PduPointConverter.to_cdr_body(writer, i < values.length ? values[i] : new Point());
            }
        }
        writer.write_float64(src.restitution_coefficient);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Collision } dst
     * @returns { Collision }
     */
    static cdr_body_to_js(reader, dst) {
        dst.collision = reader.read_bool();
        dst.contact_num = reader.read_uint32();
        PduVector3Converter.cdr_body_to_js(reader, dst.relative_velocity);
        dst.contact_position = [];
        for (let i = 0; i < 10; i++) {
            dst.contact_position.push(PduPointConverter.cdr_body_to_js(reader, new Point()));
        }
        dst.restitution_coefficient = reader.read_float64();
        return dst;
    }

    /**
     * @param { Collision } src
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
     * @returns { Collision }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Collision());
    }
}
