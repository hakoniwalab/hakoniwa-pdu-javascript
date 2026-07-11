import { RelativeHumidity } from './pdu_jstype_RelativeHumidity.js';
import { PduCdrWriter, PduCdrReader } from '../pdu_cdr_runtime.js';
import { Header } from '../std_msgs/pdu_jstype_Header.js';
import { PduHeaderConverter } from '../std_msgs/pdu_cdr_conv_Header.js';
import { Time } from '../builtin_interfaces/pdu_jstype_Time.js';
import { PduTimeConverter } from '../builtin_interfaces/pdu_cdr_conv_Time.js';


export class PduRelativeHumidityConverter {
    /**
     * @param {PduCdrWriter} writer
     * @param { RelativeHumidity } src
     */
    static to_cdr_body(writer, src) {
        PduHeaderConverter.to_cdr_body(writer, src.header);
        writer.write_float64(src.relative_humidity);
        writer.write_float64(src.variance);
    }

    /**
     * @param {PduCdrReader} reader
     * @param { RelativeHumidity } dst
     * @returns { RelativeHumidity }
     */
    static cdr_body_to_js(reader, dst) {
        PduHeaderConverter.cdr_body_to_js(reader, dst.header);
        dst.relative_humidity = reader.read_float64();
        dst.variance = reader.read_float64();
        return dst;
    }

    /**
     * @param { RelativeHumidity } src
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
     * @returns { RelativeHumidity }
     */
    static from_cdr(cdrPayload) {
        const reader = new PduCdrReader(cdrPayload);
        reader.read_encapsulation();
        return this.cdr_body_to_js(reader, new RelativeHumidity());
    }
}
