import { ImpulseCollision } from './pdu_jstype_ImpulseCollision.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduImpulseCollisionConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ImpulseCollision } src
     */
    static to_cdr_body(writer, src) {
        writer.write_bool(src.collision);
        writer.write_bool(src.is_target_static);
        writer.write_float64(src.restitution_coefficient);
        PduPointConverter.to_cdr_body(writer, src.self_contact_vector);
        PduVector3Converter.to_cdr_body(writer, src.normal);
        PduPointConverter.to_cdr_body(writer, src.target_contact_vector);
        PduVector3Converter.to_cdr_body(writer, src.target_velocity);
        PduVector3Converter.to_cdr_body(writer, src.target_angular_velocity);
        PduVector3Converter.to_cdr_body(writer, src.target_euler);
        PduVector3Converter.to_cdr_body(writer, src.target_inertia);
        writer.write_float64(src.target_mass);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ImpulseCollision } dst
     * @returns { ImpulseCollision }
     */
    static cdr_body_to_js(reader, dst) {
        dst.collision = reader.read_bool();
        dst.is_target_static = reader.read_bool();
        dst.restitution_coefficient = reader.read_float64();
        PduPointConverter.cdr_body_to_js(reader, dst.self_contact_vector);
        PduVector3Converter.cdr_body_to_js(reader, dst.normal);
        PduPointConverter.cdr_body_to_js(reader, dst.target_contact_vector);
        PduVector3Converter.cdr_body_to_js(reader, dst.target_velocity);
        PduVector3Converter.cdr_body_to_js(reader, dst.target_angular_velocity);
        PduVector3Converter.cdr_body_to_js(reader, dst.target_euler);
        PduVector3Converter.cdr_body_to_js(reader, dst.target_inertia);
        dst.target_mass = reader.read_float64();
        return dst;
    }

    /**
     * @param { ImpulseCollision } src
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
     * @returns { ImpulseCollision }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ImpulseCollision());
    }
}
