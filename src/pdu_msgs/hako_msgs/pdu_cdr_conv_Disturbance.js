import { Disturbance } from './pdu_jstype_Disturbance.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { DisturbanceAtm } from '../hako_msgs/pdu_jstype_DisturbanceAtm.js';
import { PduDisturbanceAtmConverter } from '../hako_msgs/pdu_cdr_conv_DisturbanceAtm.js';
import { DisturbanceBoundary } from '../hako_msgs/pdu_jstype_DisturbanceBoundary.js';
import { PduDisturbanceBoundaryConverter } from '../hako_msgs/pdu_cdr_conv_DisturbanceBoundary.js';
import { DisturbanceTemperature } from '../hako_msgs/pdu_jstype_DisturbanceTemperature.js';
import { PduDisturbanceTemperatureConverter } from '../hako_msgs/pdu_cdr_conv_DisturbanceTemperature.js';
import { DisturbanceUserCustom } from '../hako_msgs/pdu_jstype_DisturbanceUserCustom.js';
import { PduDisturbanceUserCustomConverter } from '../hako_msgs/pdu_cdr_conv_DisturbanceUserCustom.js';
import { DisturbanceWind } from '../hako_msgs/pdu_jstype_DisturbanceWind.js';
import { PduDisturbanceWindConverter } from '../hako_msgs/pdu_cdr_conv_DisturbanceWind.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduDisturbanceConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Disturbance } src
     */
    static to_cdr_body(writer, src) {
        PduDisturbanceTemperatureConverter.to_cdr_body(writer, src.d_temp);
        PduDisturbanceWindConverter.to_cdr_body(writer, src.d_wind);
        PduDisturbanceAtmConverter.to_cdr_body(writer, src.d_atm);
        PduDisturbanceBoundaryConverter.to_cdr_body(writer, src.d_boundary);
        writer.write_sequence_length(src.d_user_custom);
        for (const elem of src.d_user_custom) {
            PduDisturbanceUserCustomConverter.to_cdr_body(writer, elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Disturbance } dst
     * @returns { Disturbance }
     */
    static cdr_body_to_js(reader, dst) {
        PduDisturbanceTemperatureConverter.cdr_body_to_js(reader, dst.d_temp);
        PduDisturbanceWindConverter.cdr_body_to_js(reader, dst.d_wind);
        PduDisturbanceAtmConverter.cdr_body_to_js(reader, dst.d_atm);
        PduDisturbanceBoundaryConverter.cdr_body_to_js(reader, dst.d_boundary);
        dst.d_user_custom = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.d_user_custom.push(PduDisturbanceUserCustomConverter.cdr_body_to_js(reader, new DisturbanceUserCustom()));
        }
        return dst;
    }

    /**
     * @param { Disturbance } src
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
     * @returns { Disturbance }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Disturbance());
    }
}
