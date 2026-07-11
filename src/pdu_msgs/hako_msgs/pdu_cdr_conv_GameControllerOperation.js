import { GameControllerOperation } from './pdu_jstype_GameControllerOperation.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';


export class PduGameControllerOperationConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GameControllerOperation } src
     */
    static to_cdr_body(writer, src) {
        {
            const values = src.axis;
            for (let i = 0; i < 6; i++) {
                writer.write_float64(i < values.length ? values[i] : 0.0);
            }
        }
        {
            const values = src.button;
            for (let i = 0; i < 15; i++) {
                writer.write_bool(i < values.length ? values[i] : false);
            }
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GameControllerOperation } dst
     * @returns { GameControllerOperation }
     */
    static cdr_body_to_js(reader, dst) {
        dst.axis = Array.from({ length: 6 }, () => reader.read_float64());
        dst.button = Array.from({ length: 15 }, () => reader.read_bool());
        return dst;
    }

    /**
     * @param { GameControllerOperation } src
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
     * @returns { GameControllerOperation }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GameControllerOperation());
    }
}
