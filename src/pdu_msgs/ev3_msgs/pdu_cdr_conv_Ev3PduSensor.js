import { Ev3PduSensor } from './pdu_jstype_Ev3PduSensor.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Ev3PduColorSensor } from '../ev3_msgs/pdu_jstype_Ev3PduColorSensor.js';
import { PduEv3PduColorSensorConverter } from '../ev3_msgs/pdu_cdr_conv_Ev3PduColorSensor.js';
import { Ev3PduSensorHeader } from '../ev3_msgs/pdu_jstype_Ev3PduSensorHeader.js';
import { PduEv3PduSensorHeaderConverter } from '../ev3_msgs/pdu_cdr_conv_Ev3PduSensorHeader.js';
import { Ev3PduTouchSensor } from '../ev3_msgs/pdu_jstype_Ev3PduTouchSensor.js';
import { PduEv3PduTouchSensorConverter } from '../ev3_msgs/pdu_cdr_conv_Ev3PduTouchSensor.js';


export class PduEv3PduSensorConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Ev3PduSensor } src
     */
    static to_cdr_body(writer, src) {
        PduEv3PduSensorHeaderConverter.to_cdr_body(writer, src.head);
        {
            const values = src.buttons;
            for (let i = 0; i < 1; i++) {
                writer.write_uint8(i < values.length ? values[i] : 0);
            }
        }
        {
            const values = src.color_sensors;
            for (let i = 0; i < 2; i++) {
                PduEv3PduColorSensorConverter.to_cdr_body(writer, i < values.length ? values[i] : new Ev3PduColorSensor());
            }
        }
        {
            const values = src.touch_sensors;
            for (let i = 0; i < 2; i++) {
                PduEv3PduTouchSensorConverter.to_cdr_body(writer, i < values.length ? values[i] : new Ev3PduTouchSensor());
            }
        }
        {
            const values = src.motor_angle;
            for (let i = 0; i < 3; i++) {
                writer.write_uint32(i < values.length ? values[i] : 0);
            }
        }
        writer.write_int32(src.gyro_degree);
        writer.write_int32(src.gyro_degree_rate);
        writer.write_uint32(src.sensor_ultrasonic);
        writer.write_float64(src.gps_lat);
        writer.write_float64(src.gps_lon);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Ev3PduSensor } dst
     * @returns { Ev3PduSensor }
     */
    static cdr_body_to_js(reader, dst) {
        PduEv3PduSensorHeaderConverter.cdr_body_to_js(reader, dst.head);
        dst.buttons = Array.from({ length: 1 }, () => reader.read_uint8());
        dst.color_sensors = [];
        for (let i = 0; i < 2; i++) {
            dst.color_sensors.push(PduEv3PduColorSensorConverter.cdr_body_to_js(reader, new Ev3PduColorSensor()));
        }
        dst.touch_sensors = [];
        for (let i = 0; i < 2; i++) {
            dst.touch_sensors.push(PduEv3PduTouchSensorConverter.cdr_body_to_js(reader, new Ev3PduTouchSensor()));
        }
        dst.motor_angle = Array.from({ length: 3 }, () => reader.read_uint32());
        dst.gyro_degree = reader.read_int32();
        dst.gyro_degree_rate = reader.read_int32();
        dst.sensor_ultrasonic = reader.read_uint32();
        dst.gps_lat = reader.read_float64();
        dst.gps_lon = reader.read_float64();
        return dst;
    }

    /**
     * @param { Ev3PduSensor } src
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
     * @returns { Ev3PduSensor }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Ev3PduSensor());
    }
}
