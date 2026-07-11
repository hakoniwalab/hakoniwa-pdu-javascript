import * as PduUtils from '../pdu_utils.js';
import { TF2Error } from './pdu_jstype_TF2Error.js';


/**
 * Deserializes a binary PDU into a TF2Error object.
 * @param {ArrayBuffer} binary_data
 * @returns { TF2Error }
 */
export function pduToJs_TF2Error(binary_data) {
    const js_obj = new TF2Error();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_TF2Error(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_TF2Error(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: error, type: uint8 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 0, 1);
        js_obj.error = PduUtils.binToValue("uint8", bin);
    }
    
    // member: error_string, type: string (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 1, 128);
        js_obj.error_string = PduUtils.binToValue("string", bin);
    }
    
    return js_obj;
}

/**
 * Serializes a TF2Error object into a binary PDU.
 * @param { TF2Error } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_TF2Error(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_TF2Error(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_TF2Error(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: error, type: uint8 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint8", js_obj.error, 1);
        allocator.add(bin, parent_off + 0);
    }
    
    // member: error_string, type: string (primitive)

    
    {
        const bin = PduUtils.typeToBin("string", js_obj.error_string, 128);
        allocator.add(bin, parent_off + 1);
    }
    
}
