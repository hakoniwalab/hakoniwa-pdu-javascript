import * as PduUtils from '../pdu_utils.js';
import { Temperature } from './pdu_jstype_Temperature.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { binary_read_recursive_Header, binary_write_recursive_Header } from '../std_msgs/pdu_conv_Header.js';


/**
 * Deserializes a binary PDU into a Temperature object.
 * @param {ArrayBuffer} binary_data
 * @returns { Temperature }
 */
export function pduToJs_Temperature(binary_data) {
    const js_obj = new Temperature();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_Temperature(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_Temperature(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        const tmp_obj = new Header();
        binary_read_recursive_Header(meta, binary_data, tmp_obj, base_off + 0);
        js_obj.header = tmp_obj;
    }
    
    // member: temperature, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 136, 8);
        js_obj.temperature = PduUtils.binToValue("float64", bin);
    }
    
    // member: variance, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 144, 8);
        js_obj.variance = PduUtils.binToValue("float64", bin);
    }
    
    return js_obj;
}

/**
 * Serializes a Temperature object into a binary PDU.
 * @param { Temperature } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_Temperature(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_Temperature(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_Temperature(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        binary_write_recursive_Header(parent_off + 0, bw_container, allocator, js_obj.header);
    }
    
    // member: temperature, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.temperature, 8);
        allocator.add(bin, parent_off + 136);
    }
    
    // member: variance, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.variance, 8);
        allocator.add(bin, parent_off + 144);
    }
    
}
