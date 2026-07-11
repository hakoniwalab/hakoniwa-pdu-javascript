import * as PduUtils from '../pdu_utils.js';
import { NavSatFix } from './pdu_jstype_NavSatFix.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { binary_read_recursive_Header, binary_write_recursive_Header } from '../std_msgs/pdu_conv_Header.js';
import { NavSatStatus } from './pdu_jstype_NavSatStatus.js';
import { binary_read_recursive_NavSatStatus, binary_write_recursive_NavSatStatus } from './pdu_conv_NavSatStatus.js';


/**
 * Deserializes a binary PDU into a NavSatFix object.
 * @param {ArrayBuffer} binary_data
 * @returns { NavSatFix }
 */
export function pduToJs_NavSatFix(binary_data) {
    const js_obj = new NavSatFix();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_NavSatFix(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_NavSatFix(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        const tmp_obj = new Header();
        binary_read_recursive_Header(meta, binary_data, tmp_obj, base_off + 0);
        js_obj.header = tmp_obj;
    }
    
    // member: status, type: NavSatStatus (struct)

    {
        const tmp_obj = new NavSatStatus();
        binary_read_recursive_NavSatStatus(meta, binary_data, tmp_obj, base_off + 136);
        js_obj.status = tmp_obj;
    }
    
    // member: latitude, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 144, 8);
        js_obj.latitude = PduUtils.binToValue("float64", bin);
    }
    
    // member: longitude, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 152, 8);
        js_obj.longitude = PduUtils.binToValue("float64", bin);
    }
    
    // member: altitude, type: float64 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 160, 8);
        js_obj.altitude = PduUtils.binToValue("float64", bin);
    }
    
    // member: position_covariance, type: float64 (primitive)

    
    {
        const array_bin = PduUtils.readBinary(binary_data, base_off + 168, 72);
        js_obj.position_covariance = PduUtils.binToArrayValues("float64", array_bin, 9, 72 / 9);
    }
    
    // member: position_covariance_type, type: uint8 (primitive)

    
    {
        const bin = PduUtils.readBinary(binary_data, base_off + 240, 1);
        js_obj.position_covariance_type = PduUtils.binToValue("uint8", bin);
    }
    
    return js_obj;
}

/**
 * Serializes a NavSatFix object into a binary PDU.
 * @param { NavSatFix } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_NavSatFix(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_NavSatFix(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_NavSatFix(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        binary_write_recursive_Header(parent_off + 0, bw_container, allocator, js_obj.header);
    }
    
    // member: status, type: NavSatStatus (struct)

    {
        binary_write_recursive_NavSatStatus(parent_off + 136, bw_container, allocator, js_obj.status);
    }
    
    // member: latitude, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.latitude, 8);
        allocator.add(bin, parent_off + 144);
    }
    
    // member: longitude, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.longitude, 8);
        allocator.add(bin, parent_off + 152);
    }
    
    // member: altitude, type: float64 (primitive)

    
    {
        const bin = PduUtils.typeToBin("float64", js_obj.altitude, 8);
        allocator.add(bin, parent_off + 160);
    }
    
    // member: position_covariance, type: float64 (primitive)

    
    {
        const buffer = PduUtils.typesToBin("float64", js_obj.position_covariance, 72 / 9);
        allocator.add(buffer, parent_off + 168);
    }
    
    // member: position_covariance_type, type: uint8 (primitive)

    
    {
        const bin = PduUtils.typeToBin("uint8", js_obj.position_covariance_type, 1);
        allocator.add(bin, parent_off + 240);
    }
    
}
