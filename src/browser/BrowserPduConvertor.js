import { PduConvertor } from '../impl/PduConvertor.js';
import { PduEncoding } from '../PduEncoding.js';

/**
 * Browser convertor whose import pattern can be enumerated by bundlers.
 * The default PduConvertor keeps its existing runtime-loading behavior.
 */
export class BrowserPduConvertor extends PduConvertor {
    async _loadConverterModule(converterInfo) {
        const { pkg, name } = converterInfo;
        if (this.pdu_encoding === PduEncoding.CDR) {
            return await import(`../pdu_msgs/${pkg}/pdu_cdr_conv_${name}.js`);
        }
        return await import(`../pdu_msgs/${pkg}/pdu_conv_${name}.js`);
    }
}
