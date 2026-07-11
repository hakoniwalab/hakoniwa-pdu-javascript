import * as PduUtils from '../pdu_utils.js';
import { QuaternionStamped } from './pdu_jstype_QuaternionStamped.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { binary_read_recursive_Header, binary_write_recursive_Header } from '../std_msgs/pdu_conv_Header.js';
import { Quaternion } from './pdu_jstype_Quaternion.js';
import { binary_read_recursive_Quaternion, binary_write_recursive_Quaternion } from './pdu_conv_Quaternion.js';


/**
 * Deserializes a binary PDU into a QuaternionStamped object.
 * @param {ArrayBuffer} binary_data
 * @returns { QuaternionStamped }
 */
export function pduToJs_QuaternionStamped(binary_data) {
    const js_obj = new QuaternionStamped();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_QuaternionStamped(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_QuaternionStamped(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        const tmp_obj = new Header();
        binary_read_recursive_Header(meta, binary_data, tmp_obj, base_off + 0);
        js_obj.header = tmp_obj;
    }
    
    // member: quaternion, type: Quaternion (struct)

    {
        const tmp_obj = new Quaternion();
        binary_read_recursive_Quaternion(meta, binary_data, tmp_obj, base_off + 136);
        js_obj.quaternion = tmp_obj;
    }
    
    return js_obj;
}

/**
 * Serializes a QuaternionStamped object into a binary PDU.
 * @param { QuaternionStamped } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_QuaternionStamped(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_QuaternionStamped(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_QuaternionStamped(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        binary_write_recursive_Header(parent_off + 0, bw_container, allocator, js_obj.header);
    }
    
    // member: quaternion, type: Quaternion (struct)

    {
        binary_write_recursive_Quaternion(parent_off + 136, bw_container, allocator, js_obj.quaternion);
    }
    
}
