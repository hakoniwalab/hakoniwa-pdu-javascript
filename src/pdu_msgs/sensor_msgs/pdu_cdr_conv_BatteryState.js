import { BatteryState } from './pdu_jstype_BatteryState.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduBatteryStateConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { BatteryState } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_float32(src.voltage);
        writer.write_float32(src.temperature);
        writer.write_float32(src.current);
        writer.write_float32(src.charge);
        writer.write_float32(src.capacity);
        writer.write_float32(src.design_capacity);
        writer.write_float32(src.percentage);
        writer.write_uint8(src.power_supply_status);
        writer.write_uint8(src.power_supply_health);
        writer.write_uint8(src.power_supply_technology);
        writer.write_bool(src.present);
        writer.write_sequence_length(src.cell_voltage);
        for (const elem of src.cell_voltage) {
            writer.write_float32(elem);
        }
        writer.write_sequence_length(src.cell_temperature);
        for (const elem of src.cell_temperature) {
            writer.write_float32(elem);
        }
        writer.write_string(src.location);
        writer.write_string(src.serial_number);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { BatteryState } dst
     * @returns { BatteryState }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.voltage = reader.read_float32();
        dst.temperature = reader.read_float32();
        dst.current = reader.read_float32();
        dst.charge = reader.read_float32();
        dst.capacity = reader.read_float32();
        dst.design_capacity = reader.read_float32();
        dst.percentage = reader.read_float32();
        dst.power_supply_status = reader.read_uint8();
        dst.power_supply_health = reader.read_uint8();
        dst.power_supply_technology = reader.read_uint8();
        dst.present = reader.read_bool();
        dst.cell_voltage = Array.from({ length: reader.read_uint32() }, () => reader.read_float32());
        dst.cell_temperature = Array.from({ length: reader.read_uint32() }, () => reader.read_float32());
        dst.location = reader.read_string();
        dst.serial_number = reader.read_string();
        return dst;
    }

    /**
     * @param { BatteryState } src
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
     * @returns { BatteryState }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new BatteryState());
    }
}
