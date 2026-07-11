import * as PduUtils from '../pdu_utils.js';
import { AccelWithCovariance } from './pdu_jstype_AccelWithCovariance.js';
import { Accel } from './pdu_jstype_Accel.js';
import { binary_read_recursive_Accel, binary_write_recursive_Accel } from './pdu_conv_Accel.js';


/**
 * Deserializes a binary PDU into a AccelWithCovariance object.
 * @param {ArrayBuffer} binary_data
 * @returns { AccelWithCovariance }
 */
export function pduToJs_AccelWithCovariance(binary_data) {
    const js_obj = new AccelWithCovariance();
    const meta_parser = new PduUtils.PduMetaDataParser();
    const meta = meta_parser.load_pdu_meta(binary_data);
    if (meta === null) {
        throw new Error("Invalid PDU binary data: MetaData not found or corrupted");
    }
    binary_read_recursive_AccelWithCovariance(meta, binary_data, js_obj, meta.base_off);
    return js_obj;
}

export function binary_read_recursive_AccelWithCovariance(meta, binary_data, js_obj, base_off) {
    const view = new DataView(binary_data);
    const littleEndian = true;
    // member: accel, type: Accel (struct)

    {
        const tmp_obj = new Accel();
        binary_read_recursive_Accel(meta, binary_data, tmp_obj, base_off + 0);
        js_obj.accel = tmp_obj;
    }
    
    // member: covariance, type: float64 (primitive)

    
    {
        const array_bin = PduUtils.readBinary(binary_data, base_off + 48, 288);
        js_obj.covariance = PduUtils.binToArrayValues("float64", array_bin, 36, 288 / 36);
    }
    
    return js_obj;
}

/**
 * Serializes a AccelWithCovariance object into a binary PDU.
 * @param { AccelWithCovariance } js_obj
 * @returns {ArrayBuffer}
 */
export function jsToPdu_AccelWithCovariance(js_obj) {
    const base_allocator = new PduUtils.DynamicAllocator();
    const bw_container = new PduUtils.BinaryWriterContainer(new PduUtils.PduMetaData());

    binary_write_recursive_AccelWithCovariance(0, bw_container, base_allocator, js_obj);

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

export function binary_write_recursive_AccelWithCovariance(parent_off, bw_container, allocator, js_obj) {
    const littleEndian = true;
    // member: accel, type: Accel (struct)

    {
        binary_write_recursive_Accel(parent_off + 0, bw_container, allocator, js_obj.accel);
    }
    
    // member: covariance, type: float64 (primitive)

    
    {
        const buffer = PduUtils.typesToBin("float64", js_obj.covariance, 288 / 36);
        allocator.add(buffer, parent_off + 48);
    }
    
}
