import { PduManager } from '../PduManager.js';
import { CommunicationBuffer } from '../impl/CommunicationBuffer.js';
import { PduChannelConfig } from '../impl/PduChannelConfig.js';
import { BrowserPduConvertor } from './BrowserPduConvertor.js';

/** Browser PDU manager with a bundler-aware generated converter loader. */
export class BrowserPduManager extends PduManager {
    async initialize(configPath, commService) {
        if (!commService) {
            throw new Error('CommService is null or undefined');
        }

        this.pdu_config = await PduChannelConfig.load(configPath);
        commService.set_channel_config(this.pdu_config);
        this.comm_buffer = new CommunicationBuffer(this.pdu_config);
        this.comm_service = commService;
        this.pdu_convertor = new BrowserPduConvertor('', this.pdu_config, {
            pdu_encoding: this.pdu_encoding,
        });
        this.b_is_initialized = true;
        console.log('[INFO] PduManager initialized');
    }
}
