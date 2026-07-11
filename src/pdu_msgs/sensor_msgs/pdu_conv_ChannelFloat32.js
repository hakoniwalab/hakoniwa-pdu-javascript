import * as PduUtils from '../pdu_utils.js';
import { ChannelFloat32 } from './pdu_jstype_ChannelFloat32.js';


/**
 * Deserializes a binary PDU into a ChannelFloat32 object.
 * @param {ArrayBuffer} binary_data
 * @returns { ChannelFloat32 }
 */
export function pduToJs_ChannelFloat32(binary_data) {
    const js_obj = new ChannelFloat32();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_ChannelFloat32(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_ChannelFloat32(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: name, type: string (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 0, 128);
        js_obj.name = PduUtils.binToValue("string", bin);
    }
    
    // member: values, type: float32 (primitive)

    { // varray
        const array_size = view.getInt32(base_off + 128, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 128 + 4, littleEndian);
        const one_elm_size = 4;
        const array_bin = PduUtils.readBinary(binary_data, meta.heap_off + offset_from_heap, one_elm_size * array_size);
        
        if ("float32" === 'string') {
            js_obj.values = PduUtils.binToArrayValues("string", array_bin, array_size, one_elm_size);
        } else {
            js_obj.values = PduUtils.binToArrayValues("float32", array_bin, array_size);
        }
    }
    
    return js_obj;
}

/**
 * Serializes a ChannelFloat32 object into a binary PDU.
 * @param { ChannelFloat32 } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_ChannelFloat32(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_ChannelFloat32(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_ChannelFloat32(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: name, type: string (primitive)

    
    {
        const bin = PduUtils.typeToBin("string", js_obj.name, 128);
        allocator.add(bin, parent_off + 0);
    }
    
    // member: values, type: float32 (primitive)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        let data_buffer;
        let array_size;
        if ("float32" === 'string') {
            data_buffer = PduUtils.typesToBin("string", js_obj.values, 4);
            array_size = js_obj.values.length;
        } else {
            data_buffer = PduUtils.typesToBin("float32", js_obj.values);
            array_size = js_obj.values.length;
        }
        bw_container.heap_allocator.add(data_buffer);

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian);
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 128);
    }
    
}
