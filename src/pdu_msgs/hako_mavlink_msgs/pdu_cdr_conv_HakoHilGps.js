import { HakoHilGps } from './pdu_jstype_HakoHilGps.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduHakoHilGpsConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { HakoHilGps } src
     */
    static to_cdr_body(writer, src) {
        writer.write_uint64(src.time_usec);
        writer.write_int32(src.lat);
        writer.write_int32(src.lon);
        writer.write_int32(src.alt);
        writer.write_uint16(src.eph);
        writer.write_uint16(src.epv);
        writer.write_uint16(src.vel);
        writer.write_int16(src.vn);
        writer.write_int16(src.ve);
        writer.write_int16(src.vd);
        writer.write_uint16(src.cog);
        writer.write_uint8(src.satellites_visible);
        writer.write_uint8(src.id);
        writer.write_uint8(src.yaw);
        writer.write_uint8(src.fix_type);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { HakoHilGps } dst
     * @returns { HakoHilGps }
     */
    static cdr_body_to_js(reader, dst) {
        dst.time_usec = reader.read_uint64();
        dst.lat = reader.read_int32();
        dst.lon = reader.read_int32();
        dst.alt = reader.read_int32();
        dst.eph = reader.read_uint16();
        dst.epv = reader.read_uint16();
        dst.vel = reader.read_uint16();
        dst.vn = reader.read_int16();
        dst.ve = reader.read_int16();
        dst.vd = reader.read_int16();
        dst.cog = reader.read_uint16();
        dst.satellites_visible = reader.read_uint8();
        dst.id = reader.read_uint8();
        dst.yaw = reader.read_uint8();
        dst.fix_type = reader.read_uint8();
        return dst;
    }

    /**
     * @param { HakoHilGps } src
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
     * @returns { HakoHilGps }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new HakoHilGps());
    }
}
