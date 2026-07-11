import * as PduUtils from '../pdu_utils.js';
import { MultiDOFJointState } from './pdu_jstype_MultiDOFJointState.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { binary_read_recursive_Header, binary_write_recursive_Header } from '../std_msgs/pdu_conv_Header.js';
import { Transform } from '../geometry_msgs/pdu_jstype_Transform.js';
import { binary_read_recursive_Transform, binary_write_recursive_Transform } from '../geometry_msgs/pdu_conv_Transform.js';
import { Twist } from '../geometry_msgs/pdu_jstype_Twist.js';
import { binary_read_recursive_Twist, binary_write_recursive_Twist } from '../geometry_msgs/pdu_conv_Twist.js';
import { Wrench } from '../geometry_msgs/pdu_jstype_Wrench.js';
import { binary_read_recursive_Wrench, binary_write_recursive_Wrench } from '../geometry_msgs/pdu_conv_Wrench.js';


/**
 * Deserializes a binary PDU into a MultiDOFJointState object.
 * @param {ArrayBuffer} binary_data
 * @returns { MultiDOFJointState }
 */
export function pduToJs_MultiDOFJointState(binary_data) {
    const js_obj = new MultiDOFJointState();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_MultiDOFJointState(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_MultiDOFJointState(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        const tmp_obj = new Header();
        binary_read_recursive_Header(meta, binary_data, tmp_obj, base_off + 0);
        js_obj.header = tmp_obj;
    }
    
    // member: joint_names, type: string (primitive)

    { // varray
        const array_size = view.getInt32(base_off + 136, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 136 + 4, littleEndian);
        const one_elm_size = 128;
        const array_bin = PduUtils.readBinary(binary_data, meta.heap_off + offset_from_heap, one_elm_size * array_size);
        
        if ("string" === 'string') {
            js_obj.joint_names = PduUtils.binToArrayValues("string", array_bin, array_size, one_elm_size);
        } else {
            js_obj.joint_names = PduUtils.binToArrayValues("string", array_bin, array_size);
        }
    }
    
    // member: transforms, type: geometry_msgs/Transform (struct)

    { // varray
        const array_size = view.getInt32(base_off + 144, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 144 + 4, littleEndian);
        const one_elm_size = 56;
        const array_value = [];
        for (let i = 0; i < array_size; i++) {
            const tmp_obj = new Transform();
            const item_offset = meta.heap_off + offset_from_heap + (i * one_elm_size);
            binary_read_recursive_Transform(meta, binary_data, tmp_obj, item_offset);
            array_value.push(tmp_obj);
        }
        js_obj.transforms = array_value;
    }
    
    // member: twist, type: geometry_msgs/Twist (struct)

    { // varray
        const array_size = view.getInt32(base_off + 152, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 152 + 4, littleEndian);
        const one_elm_size = 48;
        const array_value = [];
        for (let i = 0; i < array_size; i++) {
            const tmp_obj = new Twist();
            const item_offset = meta.heap_off + offset_from_heap + (i * one_elm_size);
            binary_read_recursive_Twist(meta, binary_data, tmp_obj, item_offset);
            array_value.push(tmp_obj);
        }
        js_obj.twist = array_value;
    }
    
    // member: wrench, type: geometry_msgs/Wrench (struct)

    { // varray
        const array_size = view.getInt32(base_off + 160, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 160 + 4, littleEndian);
        const one_elm_size = 48;
        const array_value = [];
        for (let i = 0; i < array_size; i++) {
            const tmp_obj = new Wrench();
            const item_offset = meta.heap_off + offset_from_heap + (i * one_elm_size);
            binary_read_recursive_Wrench(meta, binary_data, tmp_obj, item_offset);
            array_value.push(tmp_obj);
        }
        js_obj.wrench = array_value;
    }
    
    return js_obj;
}

/**
 * Serializes a MultiDOFJointState object into a binary PDU.
 * @param { MultiDOFJointState } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_MultiDOFJointState(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_MultiDOFJointState(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_MultiDOFJointState(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        binary_write_recursive_Header(parent_off + 0, bw_container, allocator, js_obj.header);
    }
    
    // member: joint_names, type: string (primitive)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        let data_buffer;
        let array_size;
        if ("string" === 'string') {
            data_buffer = PduUtils.typesToBin("string", js_obj.joint_names, 128);
            array_size = js_obj.joint_names.length;
        } else {
            data_buffer = PduUtils.typesToBin("string", js_obj.joint_names);
            array_size = js_obj.joint_names.length;
        }
        bw_container.heap_allocator.add(data_buffer);

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian);
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 136);
    }
    
    // member: transforms, type: geometry_msgs/Transform (struct)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        const array_size = js_obj.transforms.length;
        const one_elm_size = 56;
        const array_base_offset = bw_container.heap_allocator.add(new ArrayBuffer(one_elm_size * array_size));
        for (let item_index = 0; item_index < array_size; item_index++) {
            const item_offset = array_base_offset + (item_index * one_elm_size);
            binary_write_recursive_Transform(item_offset, bw_container, bw_container.heap_allocator, js_obj.transforms[item_index]);
        }

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian); // array_size
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 144);
    }
    
    // member: twist, type: geometry_msgs/Twist (struct)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        const array_size = js_obj.twist.length;
        const one_elm_size = 48;
        const array_base_offset = bw_container.heap_allocator.add(new ArrayBuffer(one_elm_size * array_size));
        for (let item_index = 0; item_index < array_size; item_index++) {
            const item_offset = array_base_offset + (item_index * one_elm_size);
            binary_write_recursive_Twist(item_offset, bw_container, bw_container.heap_allocator, js_obj.twist[item_index]);
        }

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian); // array_size
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 152);
    }
    
    // member: wrench, type: geometry_msgs/Wrench (struct)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        const array_size = js_obj.wrench.length;
        const one_elm_size = 48;
        const array_base_offset = bw_container.heap_allocator.add(new ArrayBuffer(one_elm_size * array_size));
        for (let item_index = 0; item_index < array_size; item_index++) {
            const item_offset = array_base_offset + (item_index * one_elm_size);
            binary_write_recursive_Wrench(item_offset, bw_container, bw_container.heap_allocator, js_obj.wrench[item_index]);
        }

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian); // array_size
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 160);
    }
    
}
