import * as PduUtils from '../pdu_utils.js';
import { BatteryState } from './pdu_jstype_BatteryState.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { binary_read_recursive_Header, binary_write_recursive_Header } from '../std_msgs/pdu_conv_Header.js';


/**
 * Deserializes a binary PDU into a BatteryState object.
 * @param {ArrayBuffer} binary_data
 * @returns { BatteryState }
 */
export function pduToJs_BatteryState(binary_data) {
    const js_obj = new BatteryState();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_BatteryState(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_BatteryState(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        const tmp_obj = new Header();
        binary_read_recursive_Header(meta, binary_data, tmp_obj, base_off + 0);
        js_obj.header = tmp_obj;
    }
    
    // member: voltage, type: float32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 136, 4);
        js_obj.voltage = PduUtils.binToValue("float32", bin);
    }
    
    // member: temperature, type: float32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 140, 4);
        js_obj.temperature = PduUtils.binToValue("float32", bin);
    }
    
    // member: current, type: float32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 144, 4);
        js_obj.current = PduUtils.binToValue("float32", bin);
    }
    
    // member: charge, type: float32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 148, 4);
        js_obj.charge = PduUtils.binToValue("float32", bin);
    }
    
    // member: capacity, type: float32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 152, 4);
        js_obj.capacity = PduUtils.binToValue("float32", bin);
    }
    
    // member: design_capacity, type: float32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 156, 4);
        js_obj.design_capacity = PduUtils.binToValue("float32", bin);
    }
    
    // member: percentage, type: float32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 160, 4);
        js_obj.percentage = PduUtils.binToValue("float32", bin);
    }
    
    // member: power_supply_status, type: uint8 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 164, 1);
        js_obj.power_supply_status = PduUtils.binToValue("uint8", bin);
    }
    
    // member: power_supply_health, type: uint8 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 165, 1);
        js_obj.power_supply_health = PduUtils.binToValue("uint8", bin);
    }
    
    // member: power_supply_technology, type: uint8 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 166, 1);
        js_obj.power_supply_technology = PduUtils.binToValue("uint8", bin);
    }
    
    // member: present, type: bool (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 168, 4);
        js_obj.present = PduUtils.binToValue("bool", bin);
    }
    
    // member: cell_voltage, type: float32 (primitive)

    { // varray
        const array_size = view.getInt32(base_off + 172, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 172 + 4, littleEndian);
        const one_elm_size = 4;
        const array_bin = PduUtils.readBinary(binary_data, meta.heap_off + offset_from_heap, one_elm_size * array_size);
        
        if ("float32" === 'string') {
            js_obj.cell_voltage = PduUtils.binToArrayValues("string", array_bin, array_size, one_elm_size);
        } else {
            js_obj.cell_voltage = PduUtils.binToArrayValues("float32", array_bin, array_size);
        }
    }
    
    // member: cell_temperature, type: float32 (primitive)

    { // varray
        const array_size = view.getInt32(base_off + 180, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 180 + 4, littleEndian);
        const one_elm_size = 4;
        const array_bin = PduUtils.readBinary(binary_data, meta.heap_off + offset_from_heap, one_elm_size * array_size);
        
        if ("float32" === 'string') {
            js_obj.cell_temperature = PduUtils.binToArrayValues("string", array_bin, array_size, one_elm_size);
        } else {
            js_obj.cell_temperature = PduUtils.binToArrayValues("float32", array_bin, array_size);
        }
    }
    
    // member: location, type: string (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 188, 128);
        js_obj.location = PduUtils.binToValue("string", bin);
    }
    
    // member: serial_number, type: string (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 316, 128);
        js_obj.serial_number = PduUtils.binToValue("string", bin);
    }
    
    return js_obj;
}

/**
 * Serializes a BatteryState object into a binary PDU.
 * @param { BatteryState } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_BatteryState(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_BatteryState(0, bw_container, base_allocator, js_obj);

    const base_data_size = base_allocator.size();
    const heap_data_size = bw_container.heap_allocator.size();
    
    bw_container.meta.heap_off = PduUtils.PDU_META_DATA_SIZE + base_data_size;
    bw_container.meta.total_size = bw_container.meta.heap_off + heap_data_size;

    const final_buffer = new ArrayBuffer(bw_container.meta.total_size);
    const final_view = new Uint8Array(final_buffer);

    PduUtils.writeBinary(final_view, 0, bw_container.meta.to_bytes());
    PduUtils.writeBinary(final_view, bw_container.meta.base_off, base_allocator.toArray());
    PduUtils.writeBinary(final_view, bw_container.meta.heap_off, bw_container.heap_allocator.toArray());

    return final_buffer;
}

export function binary_write_recursive_BatteryState(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        binary_write_recursive_Header(parent_off + 0, bw_container, allocator, js_obj.header);
    }
    
    // member: voltage, type: float32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float32", js_obj.voltage, 4);
        allocator.add(bin, parent_off + 136);
    }
    
    // member: temperature, type: float32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float32", js_obj.temperature, 4);
        allocator.add(bin, parent_off + 140);
    }
    
    // member: current, type: float32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float32", js_obj.current, 4);
        allocator.add(bin, parent_off + 144);
    }
    
    // member: charge, type: float32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float32", js_obj.charge, 4);
        allocator.add(bin, parent_off + 148);
    }
    
    // member: capacity, type: float32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float32", js_obj.capacity, 4);
        allocator.add(bin, parent_off + 152);
    }
    
    // member: design_capacity, type: float32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float32", js_obj.design_capacity, 4);
        allocator.add(bin, parent_off + 156);
    }
    
    // member: percentage, type: float32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float32", js_obj.percentage, 4);
        allocator.add(bin, parent_off + 160);
    }
    
    // member: power_supply_status, type: uint8 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint8", js_obj.power_supply_status, 1);
        allocator.add(bin, parent_off + 164);
    }
    
    // member: power_supply_health, type: uint8 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint8", js_obj.power_supply_health, 1);
        allocator.add(bin, parent_off + 165);
    }
    
    // member: power_supply_technology, type: uint8 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint8", js_obj.power_supply_technology, 1);
        allocator.add(bin, parent_off + 166);
    }
    
    // member: present, type: bool (primitive)

    
    {
        const bin = PduUtils.typeToBin("bool", js_obj.present, 4);
        allocator.add(bin, parent_off + 168);
    }
    
    // member: cell_voltage, type: float32 (primitive)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        let data_buffer;
        let array_size;
        if ("float32" === 'string') {
            data_buffer = PduUtils.typesToBin("string", js_obj.cell_voltage, 4);
            array_size = js_obj.cell_voltage.length;
        } else {
            data_buffer = PduUtils.typesToBin("float32", js_obj.cell_voltage);
            array_size = js_obj.cell_voltage.length;
        }
        bw_container.heap_allocator.add(data_buffer);

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian);
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 172);
    }
    
    // member: cell_temperature, type: float32 (primitive)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        let data_buffer;
        let array_size;
        if ("float32" === 'string') {
            data_buffer = PduUtils.typesToBin("string", js_obj.cell_temperature, 4);
            array_size = js_obj.cell_temperature.length;
        } else {
            data_buffer = PduUtils.typesToBin("float32", js_obj.cell_temperature);
            array_size = js_obj.cell_temperature.length;
        }
        bw_container.heap_allocator.add(data_buffer);

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian);
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 180);
    }
    
    // member: location, type: string (primitive)

    
    {
        const bin = PduUtils.typeToBin("string", js_obj.location, 128);
        allocator.add(bin, parent_off + 188);
    }
    
    // member: serial_number, type: string (primitive)

    
    {
        const bin = PduUtils.typeToBin("string", js_obj.serial_number, 128);
        allocator.add(bin, parent_off + 316);
    }
    
}
