import { RegionOfInterest } from './pdu_jstype_RegionOfInterest.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduRegionOfInterestConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { RegionOfInterest } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint32(src.x_offset);
        writer.write_uint32(src.y_offset);
        writer.write_uint32(src.height);
        writer.write_uint32(src.width);
        writer.write_bool(src.do_rectify);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { RegionOfInterest } dst
     * @returns { RegionOfInterest }
     */
    static cdr_body_to_js(reader, dst) {
        dst.x_offset = reader.read_uint32();
        dst.y_offset = reader.read_uint32();
        dst.height = reader.read_uint32();
        dst.width = reader.read_uint32();
        dst.do_rectify = reader.read_bool();
        return dst;
    }

    /**
     * @param { RegionOfInterest } src
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
     * @returns { RegionOfInterest }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new RegionOfInterest());
    }
}
