import * as PduUtils from '../pdu_utils.js';
import { DroneVisualStateArray } from './pdu_jstype_DroneVisualStateArray.js';
import { DroneVisualState } from './pdu_jstype_DroneVisualState.js';
import { binary_read_recursive_DroneVisualState, binary_write_recursive_DroneVisualState } from './pdu_conv_DroneVisualState.js';


/**
 * Deserializes a binary PDU into a DroneVisualStateArray object.
 * @param {ArrayBuffer} binary_data
 * @returns { DroneVisualStateArray }
 */
export function pduToJs_DroneVisualStateArray(binary_data) {
    const js_obj = new DroneVisualStateArray();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_DroneVisualStateArray(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_DroneVisualStateArray(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: sequence_id, type: uint32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 0, 4);
        js_obj.sequence_id = PduUtils.binToValue("uint32", bin);
    }
    
    // member: chunk_index, type: uint32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 4, 4);
        js_obj.chunk_index = PduUtils.binToValue("uint32", bin);
    }
    
    // member: chunk_count, type: uint32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 8, 4);
        js_obj.chunk_count = PduUtils.binToValue("uint32", bin);
    }
    
    // member: start_index, type: uint32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 12, 4);
        js_obj.start_index = PduUtils.binToValue("uint32", bin);
    }
    
    // member: valid_count, type: uint32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 16, 4);
        js_obj.valid_count = PduUtils.binToValue("uint32", bin);
    }
    
    // member: drones, type: hako_msgs/DroneVisualState (struct)

    { // varray
        const array_size = view.getInt32(base_off + 20, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 20 + 4, littleEndian);
        const one_elm_size = 32;
        const array_value = [];
        for (let i = 0; i < array_size; i++) {
            const tmp_obj = new DroneVisualState();
            const item_offset = meta.heap_off + offset_from_heap + (i * one_elm_size);
            binary_read_recursive_DroneVisualState(meta, binary_data, tmp_obj, item_offset);
            array_value.push(tmp_obj);
        }
        js_obj.drones = array_value;
    }
    
    return js_obj;
}

/**
 * Serializes a DroneVisualStateArray object into a binary PDU.
 * @param { DroneVisualStateArray } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_DroneVisualStateArray(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_DroneVisualStateArray(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_DroneVisualStateArray(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: sequence_id, type: uint32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint32", js_obj.sequence_id, 4);
        allocator.add(bin, parent_off + 0);
    }
    
    // member: chunk_index, type: uint32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint32", js_obj.chunk_index, 4);
        allocator.add(bin, parent_off + 4);
    }
    
    // member: chunk_count, type: uint32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint32", js_obj.chunk_count, 4);
        allocator.add(bin, parent_off + 8);
    }
    
    // member: start_index, type: uint32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint32", js_obj.start_index, 4);
        allocator.add(bin, parent_off + 12);
    }
    
    // member: valid_count, type: uint32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint32", js_obj.valid_count, 4);
        allocator.add(bin, parent_off + 16);
    }
    
    // member: drones, type: hako_msgs/DroneVisualState (struct)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        const array_size = js_obj.drones.length;
        const one_elm_size = 32;
        const array_base_offset = bw_container.heap_allocator.add(new ArrayBuffer(one_elm_size * array_size));
        for (let item_index = 0; item_index < array_size; item_index++) {
            const item_offset = array_base_offset + (item_index * one_elm_size);
            binary_write_recursive_DroneVisualState(item_offset, bw_container, bw_container.heap_allocator, js_obj.drones[item_index]);
        }

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian); // array_size
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 20);
    }
    
}
