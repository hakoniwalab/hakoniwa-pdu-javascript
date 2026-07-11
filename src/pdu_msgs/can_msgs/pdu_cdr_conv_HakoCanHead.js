import { HakoCanHead } from './pdu_jstype_HakoCanHead.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoCanHeadConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoCanHead } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.channel);
        writer.write_uint32(src.ide);
        writer.write_uint32(src.rtr);
        writer.write_uint32(src.dlc);
        writer.write_uint32(src.canid);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoCanHead } dst
     * @returns { HakoCanHead }
     */
    static cdr_body_to_js(reader, dst) {
        dst.channel = reader.read_uint32();
        dst.ide = reader.read_uint32();
        dst.rtr = reader.read_uint32();
        dst.dlc = reader.read_uint32();
        dst.canid = reader.read_uint32();
        return dst;
    }

    /**
     * @param { HakoCanHead } src
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
     * @returns { HakoCanHead }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoCanHead());
    }
}
