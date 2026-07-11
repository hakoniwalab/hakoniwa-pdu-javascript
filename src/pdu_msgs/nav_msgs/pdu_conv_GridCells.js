import * as PduUtils from '../pdu_utils.js';
import { GridCells } from './pdu_jstype_GridCells.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { binary_read_recursive_Header, binary_write_recursive_Header } from '../std_msgs/pdu_conv_Header.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { binary_read_recursive_Point, binary_write_recursive_Point } from '../geometry_msgs/pdu_conv_Point.js';


/**
 * Deserializes a binary PDU into a GridCells object.
 * @param {ArrayBuffer} binary_data
 * @returns { GridCells }
 */
export function pduToJs_GridCells(binary_data) {
    const js_obj = new GridCells();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_GridCells(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_GridCells(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        const tmp_obj = new Header();
        binary_read_recursive_Header(meta, binary_data, tmp_obj, base_off + 0);
        js_obj.header = tmp_obj;
    }
    
    // member: cell_width, type: float32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 136, 4);
        js_obj.cell_width = PduUtils.binToValue("float32", bin);
    }
    
    // member: cell_height, type: float32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 140, 4);
        js_obj.cell_height = PduUtils.binToValue("float32", bin);
    }
    
    // member: cells, type: geometry_msgs/Point (struct)

    { // varray
        const array_size = view.getInt32(base_off + 144, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 144 + 4, littleEndian);
        const one_elm_size = 24;
        const array_value = [];
        for (let i = 0; i < array_size; i++) {
            const tmp_obj = new Point();
            const item_offset = meta.heap_off + offset_from_heap + (i * one_elm_size);
            binary_read_recursive_Point(meta, binary_data, tmp_obj, item_offset);
            array_value.push(tmp_obj);
        }
        js_obj.cells = array_value;
    }
    
    return js_obj;
}

/**
 * Serializes a GridCells object into a binary PDU.
 * @param { GridCells } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_GridCells(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_GridCells(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_GridCells(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        binary_write_recursive_Header(parent_off + 0, bw_container, allocator, js_obj.header);
    }
    
    // member: cell_width, type: float32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float32", js_obj.cell_width, 4);
        allocator.add(bin, parent_off + 136);
    }
    
    // member: cell_height, type: float32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float32", js_obj.cell_height, 4);
        allocator.add(bin, parent_off + 140);
    }
    
    // member: cells, type: geometry_msgs/Point (struct)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        const array_size = js_obj.cells.length;
        const one_elm_size = 24;
        const array_base_offset = bw_container.heap_allocator.add(new ArrayBuffer(one_elm_size * array_size));
        for (let item_index = 0; item_index < array_size; item_index++) {
            const item_offset = array_base_offset + (item_index * one_elm_size);
            binary_write_recursive_Point(item_offset, bw_container, bw_container.heap_allocator, js_obj.cells[item_index]);
        }

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian); // array_size
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 144);
    }
    
}
