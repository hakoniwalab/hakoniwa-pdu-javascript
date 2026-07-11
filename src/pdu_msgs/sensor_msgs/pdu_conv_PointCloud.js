import * as PduUtils from '../pdu_utils.js';
import { PointCloud } from './pdu_jstype_PointCloud.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { binary_read_recursive_Header, binary_write_recursive_Header } from '../std_msgs/pdu_conv_Header.js';
import { Point32 } from '../geometry_msgs/pdu_jstype_Point32.js';
import { binary_read_recursive_Point32, binary_write_recursive_Point32 } from '../geometry_msgs/pdu_conv_Point32.js';
import { ChannelFloat32 } from './pdu_jstype_ChannelFloat32.js';
import { binary_read_recursive_ChannelFloat32, binary_write_recursive_ChannelFloat32 } from './pdu_conv_ChannelFloat32.js';


/**
 * Deserializes a binary PDU into a PointCloud object.
 * @param {ArrayBuffer} binary_data
 * @returns { PointCloud }
 */
export function pduToJs_PointCloud(binary_data) {
    const js_obj = new PointCloud();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_PointCloud(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_PointCloud(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        const tmp_obj = new Header();
        binary_read_recursive_Header(meta, binary_data, tmp_obj, base_off + 0);
        js_obj.header = tmp_obj;
    }
    
    // member: points, type: geometry_msgs/Point32 (struct)

    { // varray
        const array_size = view.getInt32(base_off + 136, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 136 + 4, littleEndian);
        const one_elm_size = 12;
        const array_value = [];
        for (let i = 0; i < array_size; i++) {
            const tmp_obj = new Point32();
            const item_offset = meta.heap_off + offset_from_heap + (i * one_elm_size);
            binary_read_recursive_Point32(meta, binary_data, tmp_obj, item_offset);
            array_value.push(tmp_obj);
        }
        js_obj.points = array_value;
    }
    
    // member: channels, type: ChannelFloat32 (struct)

    { // varray
        const array_size = view.getInt32(base_off + 144, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 144 + 4, littleEndian);
        const one_elm_size = 136;
        const array_value = [];
        for (let i = 0; i < array_size; i++) {
            const tmp_obj = new ChannelFloat32();
            const item_offset = meta.heap_off + offset_from_heap + (i * one_elm_size);
            binary_read_recursive_ChannelFloat32(meta, binary_data, tmp_obj, item_offset);
            array_value.push(tmp_obj);
        }
        js_obj.channels = array_value;
    }
    
    return js_obj;
}

/**
 * Serializes a PointCloud object into a binary PDU.
 * @param { PointCloud } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_PointCloud(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_PointCloud(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_PointCloud(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        binary_write_recursive_Header(parent_off + 0, bw_container, allocator, js_obj.header);
    }
    
    // member: points, type: geometry_msgs/Point32 (struct)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        const array_size = js_obj.points.length;
        const one_elm_size = 12;
        const array_base_offset = bw_container.heap_allocator.add(new ArrayBuffer(one_elm_size * array_size));
        for (let item_index = 0; item_index < array_size; item_index++) {
            const item_offset = array_base_offset + (item_index * one_elm_size);
            binary_write_recursive_Point32(item_offset, bw_container, bw_container.heap_allocator, js_obj.points[item_index]);
        }

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian); // array_size
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 136);
    }
    
    // member: channels, type: ChannelFloat32 (struct)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        const array_size = js_obj.channels.length;
        const one_elm_size = 136;
        const array_base_offset = bw_container.heap_allocator.add(new ArrayBuffer(one_elm_size * array_size));
        for (let item_index = 0; item_index < array_size; item_index++) {
            const item_offset = array_base_offset + (item_index * one_elm_size);
            binary_write_recursive_ChannelFloat32(item_offset, bw_container, bw_container.heap_allocator, js_obj.channels[item_index]);
        }

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian); // array_size
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 144);
    }
    
}
