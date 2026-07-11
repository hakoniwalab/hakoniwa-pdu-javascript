import { GridCells } from './pdu_jstype_GridCells.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Point } from '../geometry_msgs/pdu_jstype_Point.js';
import { PduPointConverter } from '../geometry_msgs/pdu_cdr_conv_Point.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduGridCellsConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { GridCells } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_float32(src.cell_width);
        writer.write_float32(src.cell_height);
        writer.write_sequence_length(src.cells);
        for (const elem of src.cells) {
            PduPointConverter.to_cdr_body(writer, elem);
        }
    }

    /**
     * @param {PduCdrReader} reader
     * @param { GridCells } dst
     * @returns { GridCells }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.cell_width = reader.read_float32();
        dst.cell_height = reader.read_float32();
        dst.cells = [];
        for (let i = 0, len = reader.read_uint32(); i < len; i++) {
            dst.cells.push(PduPointConverter.cdr_body_to_js(reader, new Point()));
        }
        return dst;
    }

    /**
     * @param { GridCells } src
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
     * @returns { GridCells }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new GridCells());
    }
}
