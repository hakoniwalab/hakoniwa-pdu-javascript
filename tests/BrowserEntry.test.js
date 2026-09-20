import * as browserApi from '../src/browser.js';
import { PduConvertor as DefaultPduConvertor } from '../src/impl/PduConvertor.js';

describe('browser entry', () => {
    it('exports the browser PDU core without Node-only server and RPC APIs', () => {
        expect(browserApi.PduManager).toBeDefined();
        expect(browserApi.PduEncoding).toBeDefined();
        expect(browserApi.WebSocketCommunicationService).toBeDefined();
        expect(browserApi.PduConvertor).toBeDefined();
        expect(browserApi.WebSocketServerCommunicationService).toBeUndefined();
        expect(browserApi.RemotePduServiceClientManager).toBeUndefined();
    });

    it('keeps the bundler-aware convertor isolated from the default API', () => {
        expect(browserApi.PduConvertor).not.toBe(DefaultPduConvertor);
    });

    it('loads and round-trips a generated CDR converter', async () => {
        const config = {
            getChannelInfo: () => ({ type: 'std_msgs/String' }),
        };
        const convertor = new browserApi.PduConvertor('', config, {
            pdu_encoding: browserApi.PduEncoding.CDR,
        });

        const raw = await convertor.convert_json_to_binary('Robot', 'message', {
            data: 'browser converter',
        });
        const restored = await convertor.convert_binary_to_json('Robot', 'message', raw);

        expect(raw).toBeInstanceOf(ArrayBuffer);
        expect(restored.data).toBe('browser converter');
    });
});
