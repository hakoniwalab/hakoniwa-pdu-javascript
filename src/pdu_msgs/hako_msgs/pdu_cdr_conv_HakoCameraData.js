import { HakoCameraData } from './pdu_jstype_HakoCameraData.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { CompressedImage } from '../sensor_msgs/pdu_jstype_CompressedImage.js';
import { PduCompressedImageConverter } from '../sensor_msgs/pdu_cdr_conv_CompressedImage.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduHakoCameraDataConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoCameraData } src
     */
    static to_cdr_body(writer, src) {
        writer.write_int32(src.request_id);
        PduCompressedImageConverter.to_cdr_body(writer, src.image);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoCameraData } dst
     * @returns { HakoCameraData }
     */
    static cdr_body_to_js(reader, dst) {
        dst.request_id = reader.read_int32();
        PduCompressedImageConverter.cdr_body_to_js(reader, dst.image);
        return dst;
    }

    /**
     * @param { HakoCameraData } src
     * @returns {ArrayBuffer}
     */
    static to_cdr(src) {
        const writer = new PduCdrWriter();
        writer.write_encapsulation();
        this.to_cdr_body(writer, src);
        return writer.get_buf();
    }

    /**
     * @param {ArrayBuffer|ArrayBufferView} cdrPayload
     * @returns { HakoCameraData }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoCameraData());
    }
}
