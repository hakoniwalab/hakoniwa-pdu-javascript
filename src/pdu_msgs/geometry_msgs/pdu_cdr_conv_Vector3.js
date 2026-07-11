import { Vector3 } from './pdu_jstype_Vector3.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduVector3Converter {
    /**
     * @param {PduCdrWriter} writer
     * @param { Vector3 } src
     */
    static to_cdr_body(writer, src) {
        writer.write_float64(src.x);
        writer.write_float64(src.y);
        writer.write_float64(src.z);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { Vector3 } dst
     * @returns { Vector3 }
     */
    static cdr_body_to_js(reader, dst) {
        dst.x = reader.read_float64();
        dst.y = reader.read_float64();
        dst.z = reader.read_float64();
        return dst;
    }

    /**
     * @param { Vector3 } src
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
     * @returns { Vector3 }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new Vector3());
    }
}
