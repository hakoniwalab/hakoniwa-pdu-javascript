import * as PduUtils from '../pdu_utils.js';
import { ExecutionUnitRuntimeContext } from './pdu_jstype_ExecutionUnitRuntimeContext.js';


/**
 * Deserializes a binary PDU into a ExecutionUnitRuntimeContext object.
 * @param {ArrayBuffer} binary_data
 * @returns { ExecutionUnitRuntimeContext }
 */
export function pduToJs_ExecutionUnitRuntimeContext(binary_data) {
    const js_obj = new ExecutionUnitRuntimeContext();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_ExecutionUnitRuntimeContext(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_ExecutionUnitRuntimeContext(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: config_hash, type: uint32 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 0, 4);
        js_obj.config_hash = PduUtils.binToValue("uint32", bin);
    }
    
    // member: epoch, type: uint8 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 4, 1);
        js_obj.epoch = PduUtils.binToValue("uint8", bin);
    }
    
    // member: owner_id, type: uint8 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 5, 1);
        js_obj.owner_id = PduUtils.binToValue("uint8", bin);
    }
    
    // member: context, type: uint8 (primitive)

    { // varray
        const array_size = view.getInt32(base_off + 8, littleEndian);
        const offset_from_heap = view.getInt32(base_off + 8 + 4, littleEndian);
        const one_elm_size = 1;
        const array_bin = PduUtils.readBinary(binary_data, meta.heap_off + offset_from_heap, one_elm_size * array_size);
        
        if ("uint8" === 'string') {
            js_obj.context = PduUtils.binToArrayValues("string", array_bin, array_size, one_elm_size);
        } else {
            js_obj.context = PduUtils.binToArrayValues("uint8", array_bin, array_size);
        }
    }
    
    return js_obj;
}

/**
 * Serializes a ExecutionUnitRuntimeContext object into a binary PDU.
 * @param { ExecutionUnitRuntimeContext } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_ExecutionUnitRuntimeContext(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_ExecutionUnitRuntimeContext(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_ExecutionUnitRuntimeContext(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: config_hash, type: uint32 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint32", js_obj.config_hash, 4);
        allocator.add(bin, parent_off + 0);
    }
    
    // member: epoch, type: uint8 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint8", js_obj.epoch, 1);
        allocator.add(bin, parent_off + 4);
    }
    
    // member: owner_id, type: uint8 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint8", js_obj.owner_id, 1);
        allocator.add(bin, parent_off + 5);
    }
    
    // member: context, type: uint8 (primitive)

    { // varray
        const offset_from_heap = bw_container.heap_allocator.size();
        let data_buffer;
        let array_size;
        if ("uint8" === 'string') {
            data_buffer = PduUtils.typesToBin("string", js_obj.context, 1);
            array_size = js_obj.context.length;
        } else {
            data_buffer = PduUtils.typesToBin("uint8", js_obj.context);
            array_size = js_obj.context.length;
        }
        bw_container.heap_allocator.add(data_buffer);

        const ref_buffer = new ArrayBuffer(8);
        const ref_view = new DataView(ref_buffer);
        ref_view.setInt32(0, array_size, littleEndian);
        ref_view.setInt32(4, offset_from_heap, littleEndian);
        allocator.add(ref_buffer, parent_off + 8);
    }
    
}
