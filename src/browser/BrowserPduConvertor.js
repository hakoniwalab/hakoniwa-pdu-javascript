import { PduConvertor } from '../impl/PduConvertor.js';
import { getBrowserConverterLoader } from './generatedConverterRegistry.js';

/**
 * Browser convertor whose import pattern can be enumerated by bundlers.
 * The default PduConvertor keeps its existing runtime-loading behavior.
 */
export class BrowserPduConvertor extends PduConvertor {
    async _loadConverterModule(converterInfo) {
        const { pkg, name } = converterInfo;
        const loader = getBrowserConverterLoader(this.pdu_encoding, pkg, name);
        if (!loader) {
            throw new Error(
                `No browser converter registered for ${this.pdu_encoding}:${pkg}/${name}`
            );
        }
        return await loader();
    }
}
