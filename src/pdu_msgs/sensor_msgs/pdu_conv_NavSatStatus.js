import * as PduUtils from '../pdu_utils.js';
import { NavSatStatus } from './pdu_jstype_NavSatStatus.js';


/**
 * Deserializes a binary PDU into a NavSatStatus object.
 * @param {ArrayBuffer} binary_data
 * @returns { NavSatStatus }
 */
export function pduToJs_NavSatStatus(binary_data) {
    const js_obj = new NavSatStatus();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_NavSatStatus(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_NavSatStatus(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: status, type: int8 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 0, 1);
        js_obj.status = PduUtils.binToValue("int8", bin);
    }
    
    // member: service, type: uint16 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 2, 2);
        js_obj.service = PduUtils.binToValue("uint16", bin);
    }
    
    return js_obj;
}

/**
 * Serializes a NavSatStatus object into a binary PDU.
 * @param { NavSatStatus } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_NavSatStatus(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_NavSatStatus(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_NavSatStatus(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: status, type: int8 (primitive)

    
    {
        const bin = PduUtils.typeToBin("int8", js_obj.status, 1);
        allocator.add(bin, parent_off + 0);
    }
    
    // member: service, type: uint16 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint16", js_obj.service, 2);
        allocator.add(bin, parent_off + 2);
    }
    
}
