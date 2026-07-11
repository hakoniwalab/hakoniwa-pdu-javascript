import * as PduUtils from '../pdu_utils.js';
import { MapMetaData } from './pdu_jstype_MapMetaData.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { binary_read_recursive_Time, binary_write_recursive_Time } from '../builtin_interfaces/pdu_conv_Time.js';
import { Pose } from '../geometry_msgs/pdu_jstype_Pose.js';
import { binary_read_recursive_Pose, binary_write_recursive_Pose } from '../geometry_msgs/pdu_conv_Pose.js';


/**
 * Deserializes a binary PDU into a MapMetaData object.
 * @param {ArrayBuffer} binary_data
 * @returns { MapMetaData }
 */
export function pduToJs_MapMetaData(binary_data) {
    const js_obj = new MapMetaData();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_MapMetaData(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_MapMetaData(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: map_load_time, type: builtin_interfaces/Time (struct)

    {
        const tmp_obj = new Time();
        binary_read_recursive_Time(meta, binary_data, tmp_obj, base_off + 0);
        js_obj.map_load_time = tmp_obj;
    }
    
    // member: resolution, type: float32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 8, 4);
        js_obj.resolution = PduUtils.binToValue("float32", bin);
    }
    
    // member: width, type: uint32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 12, 4);
        js_obj.width = PduUtils.binToValue("uint32", bin);
    }
    
    // member: height, type: uint32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 16, 4);
        js_obj.height = PduUtils.binToValue("uint32", bin);
    }
    
    // member: origin, type: geometry_msgs/Pose (struct)

    {
        const tmp_obj = new Pose();
        binary_read_recursive_Pose(meta, binary_data, tmp_obj, base_off + 24);
        js_obj.origin = tmp_obj;
    }
    
    return js_obj;
}

/**
 * Serializes a MapMetaData object into a binary PDU.
 * @param { MapMetaData } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_MapMetaData(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_MapMetaData(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_MapMetaData(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: map_load_time, type: builtin_interfaces/Time (struct)

    {
        binary_write_recursive_Time(parent_off + 0, bw_container, allocator, js_obj.map_load_time);
    }
    
    // member: resolution, type: float32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float32", js_obj.resolution, 4);
        allocator.add(bin, parent_off + 8);
    }
    
    // member: width, type: uint32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint32", js_obj.width, 4);
        allocator.add(bin, parent_off + 12);
    }
    
    // member: height, type: uint32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint32", js_obj.height, 4);
        allocator.add(bin, parent_off + 16);
    }
    
    // member: origin, type: geometry_msgs/Pose (struct)

    {
        binary_write_recursive_Pose(parent_off + 24, bw_container, allocator, js_obj.origin);
    }
    
}
