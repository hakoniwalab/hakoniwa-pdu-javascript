import * as PduUtils from '../pdu_utils.js';
import { AccelWithCovarianceStamped } from './pdu_jstype_AccelWithCovarianceStamped.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { binary_read_recursive_Header, binary_write_recursive_Header } from '../std_msgs/pdu_conv_Header.js';
import { AccelWithCovariance } from './pdu_jstype_AccelWithCovariance.js';
import { binary_read_recursive_AccelWithCovariance, binary_write_recursive_AccelWithCovariance } from './pdu_conv_AccelWithCovariance.js';


/**
 * Deserializes a binary PDU into a AccelWithCovarianceStamped object.
 * @param {ArrayBuffer} binary_data
 * @returns { AccelWithCovarianceStamped }
 */
export function pduToJs_AccelWithCovarianceStamped(binary_data) {
    const js_obj = new AccelWithCovarianceStamped();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_AccelWithCovarianceStamped(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_AccelWithCovarianceStamped(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        const tmp_obj = new Header();
        binary_read_recursive_Header(meta, binary_data, tmp_obj, base_off + 0);
        js_obj.header = tmp_obj;
    }
    
    // member: accel, type: AccelWithCovariance (struct)

    {
        const tmp_obj = new AccelWithCovariance();
        binary_read_recursive_AccelWithCovariance(meta, binary_data, tmp_obj, base_off + 136);
        js_obj.accel = tmp_obj;
    }
    
    return js_obj;
}

/**
 * Serializes a AccelWithCovarianceStamped object into a binary PDU.
 * @param { AccelWithCovarianceStamped } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_AccelWithCovarianceStamped(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_AccelWithCovarianceStamped(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_AccelWithCovarianceStamped(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: header, type: std_msgs/Header (struct)

    {
        binary_write_recursive_Header(parent_off + 0, bw_container, allocator, js_obj.header);
    }
    
    // member: accel, type: AccelWithCovariance (struct)

    {
        binary_write_recursive_AccelWithCovariance(parent_off + 136, bw_container, allocator, js_obj.accel);
    }
    
}
