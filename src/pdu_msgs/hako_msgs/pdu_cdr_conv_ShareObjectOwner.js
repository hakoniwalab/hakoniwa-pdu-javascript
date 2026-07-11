import { ShareObjectOwner } from './pdu_jstype_ShareObjectOwner.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Twist } from '../geometry_msgs/pdu_jstype_Twist.js';
import { PduTwistConverter } from '../geometry_msgs/pdu_cdr_conv_Twist.js';
import { Vector3 } from '../geometry_msgs/pdu_jstype_Vector3.js';
import { PduVector3Converter } from '../geometry_msgs/pdu_cdr_conv_Vector3.js';


export class PduShareObjectOwnerConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { ShareObjectOwner } src
     */
    static to_cdr_body(writer, src) {
        writer.write_string(src.object_name);
        writer.write_uint32(src.owner_id);
        writer.write_uint64(src.last_update);
        PduTwistConverter.to_cdr_body(writer, src.pos);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { ShareObjectOwner } dst
     * @returns { ShareObjectOwner }
     */
    static cdr_body_to_js(reader, dst) {
        dst.object_name = reader.read_string();
        dst.owner_id = reader.read_uint32();
        dst.last_update = reader.read_uint64();
        PduTwistConverter.cdr_body_to_js(reader, dst.pos);
        return dst;
    }

    /**
     * @param { ShareObjectOwner } src
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
     * @returns { ShareObjectOwner }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new ShareObjectOwner());
    }
}
