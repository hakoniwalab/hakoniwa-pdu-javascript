import { MonitorCameraCmd } from './pdu_jstype_MonitorCameraCmd.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { HakoCmdHeader } from '../hako_msgs/pdu_jstype_HakoCmdHeader.js';
import { PduHakoCmdHeaderConverter } from '../hako_msgs/pdu_cdr_conv_HakoCmdHeader.js';


export class PduMonitorCameraCmdConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { MonitorCameraCmd } src
     */
    static to_cdr_body(writer, src) {
        PduHakoCmdHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_int32(src.request_id);
        writer.write_int32(src.encode_type);
        writer.write_int32(src.request_type);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { MonitorCameraCmd } dst
     * @returns { MonitorCameraCmd }
     */
    static cdr_body_to_js(reader, dst) {
        PduHakoCmdHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.request_id = reader.read_int32();
        dst.encode_type = reader.read_int32();
        dst.request_type = reader.read_int32();
        return dst;
    }

    /**
     * @param { MonitorCameraCmd } src
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
     * @returns { MonitorCameraCmd }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new MonitorCameraCmd());
    }
}
