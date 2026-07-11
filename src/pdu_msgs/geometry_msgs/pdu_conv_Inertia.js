import * as PduUtils from '../pdu_utils.js';
import { Inertia } from './pdu_jstype_Inertia.js';
import { Vector3 } from './pdu_jstype_Vector3.js';
import { binary_read_recursive_Vector3, binary_write_recursive_Vector3 } from './pdu_conv_Vector3.js';


/**
 * Deserializes a binary PDU into a Inertia object.
 * @param {ArrayBuffer} binary_data
 * @returns { Inertia }
 */
export function pduToJs_Inertia(binary_data) {
    const js_obj = new Inertia();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_Inertia(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_Inertia(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: m, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 0, 8);
        js_obj.m = PduUtils.binToValue("float64", bin);
    }
    
    // member: com, type: geometry_msgs/Vector3 (struct)

    {
        const tmp_obj = new Vector3();
        binary_read_recursive_Vector3(meta, binary_data, tmp_obj, base_off + 8);
        js_obj.com = tmp_obj;
    }
    
    // member: ixx, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 32, 8);
        js_obj.ixx = PduUtils.binToValue("float64", bin);
    }
    
    // member: ixy, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 40, 8);
        js_obj.ixy = PduUtils.binToValue("float64", bin);
    }
    
    // member: ixz, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 48, 8);
        js_obj.ixz = PduUtils.binToValue("float64", bin);
    }
    
    // member: iyy, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 56, 8);
        js_obj.iyy = PduUtils.binToValue("float64", bin);
    }
    
    // member: iyz, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 64, 8);
        js_obj.iyz = PduUtils.binToValue("float64", bin);
    }
    
    // member: izz, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 72, 8);
        js_obj.izz = PduUtils.binToValue("float64", bin);
    }
    
    return js_obj;
}

/**
 * Serializes a Inertia object into a binary PDU.
 * @param { Inertia } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_Inertia(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_Inertia(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_Inertia(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: m, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.m, 8);
        allocator.add(bin, parent_off + 0);
    }
    
    // member: com, type: geometry_msgs/Vector3 (struct)

    {
        binary_write_recursive_Vector3(parent_off + 8, bw_container, allocator, js_obj.com);
    }
    
    // member: ixx, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.ixx, 8);
        allocator.add(bin, parent_off + 32);
    }
    
    // member: ixy, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.ixy, 8);
        allocator.add(bin, parent_off + 40);
    }
    
    // member: ixz, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.ixz, 8);
        allocator.add(bin, parent_off + 48);
    }
    
    // member: iyy, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.iyy, 8);
        allocator.add(bin, parent_off + 56);
    }
    
    // member: iyz, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.iyz, 8);
        allocator.add(bin, parent_off + 64);
    }
    
    // member: izz, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.izz, 8);
        allocator.add(bin, parent_off + 72);
    }
    
}
