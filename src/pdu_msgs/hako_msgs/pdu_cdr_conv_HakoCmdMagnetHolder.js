import { HakoCmdMagnetHolder } from './pdu_jstype_HakoCmdMagnetHolder.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { HakoCmdHeader } from '../hako_msgs/pdu_jstype_HakoCmdHeader.js';
import { PduHakoCmdHeaderConverter } from '../hako_msgs/pdu_cdr_conv_HakoCmdHeader.js';


export class PduHakoCmdMagnetHolderConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoCmdMagnetHolder } src
     */
    static to_cdr_body(writer, src) {
        PduHakoCmdHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_bool(src.magnet_on);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoCmdMagnetHolder } dst
     * @returns { HakoCmdMagnetHolder }
     */
    static cdr_body_to_js(reader, dst) {
        PduHakoCmdHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.magnet_on = reader.read_bool();
        return dst;
    }

    /**
     * @param { HakoCmdMagnetHolder } src
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
     * @returns { HakoCmdMagnetHolder }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoCmdMagnetHolder());
    }
}
