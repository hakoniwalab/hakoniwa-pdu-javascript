import { PduManager } from '../src/PduManager.js';
import { PduEncoding } from '../src/PduEncoding.js';
import { UInt64 } from '../src/pdu_msgs/std_msgs/pdu_jstype_UInt64.js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createCompactPdudefFixture } from './testUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAMPLE_PDUTYPES = [
    { name: 'sensor_state', channel_id: 1, pdu_size: 8, type: 'std_msgs/UInt64' },
    { name: 'actuator_command', channel_id: 2, pdu_size: 8, type: 'std_msgs/UInt64' }
];

class MockCommunicationService {
    constructor() {
        this.channelConfig = null;
        this.enabled = false;
    }

    set_channel_config(config) {
        this.channelConfig = config;
    }

    is_service_enabled() {
        return this.enabled;
    }

    async start_service() {
        this.enabled = true;
        return true;
    }

    async stop_service() {
        this.enabled = false;
        return true;
    }

    async send_data() {
        return true;
    }

    async send_binary() {
        return true;
    }
}

describe('PduManager', () => {
    it('should be instantiable', () => {
        const manager = new PduManager();
        expect(manager).toBeInstanceOf(PduManager);
        expect(manager.pdu_encoding).toBe(PduEncoding.HAKO);
    });

    it('should initialize from a compact pdudef and expose existing lookup APIs', async () => {
        const compactFixture = createCompactPdudefFixture(
            __dirname,
            'temp_pdu_manager_compact_',
            ['sample_robot'],
            SAMPLE_PDUTYPES
        );

        try {
            const manager = new PduManager({ wire_version: 'v2' });
            const commService = new MockCommunicationService();

            await manager.initialize(compactFixture.pdudefPath, commService);

            expect(commService.channelConfig).toBeDefined();
            expect(manager.get_pdu_channel_id('sample_robot', 'sensor_state')).toBe(1);
            expect(manager.get_pdu_channel_id('sample_robot', 'actuator_command')).toBe(2);
            expect(manager.get_pdu_size('sample_robot', 'sensor_state')).toBe(8);
            expect(manager.get_pdu_size('sample_robot', 'actuator_command')).toBe(8);
            expect(manager.pdu_convertor.pdu_encoding).toBe(PduEncoding.HAKO);
        } finally {
            compactFixture.cleanup();
        }
    });

    it('should pass CDR encoding to the convertor and convert UInt64 payloads', async () => {
        const compactFixture = createCompactPdudefFixture(
            __dirname,
            'temp_pdu_manager_cdr_',
            ['sample_robot'],
            SAMPLE_PDUTYPES
        );

        try {
            const manager = new PduManager({
                wire_version: 'v2',
                pdu_encoding: PduEncoding.CDR,
            });
            const commService = new MockCommunicationService();

            await manager.initialize(compactFixture.pdudefPath, commService);

            const source = new UInt64();
            source.data = 123456789n;

            const raw = await manager.pdu_convertor.convert_json_to_binary('sample_robot', 'sensor_state', source);
            const restored = await manager.pdu_convertor.convert_binary_to_json('sample_robot', 'sensor_state', raw);

            expect(manager.pdu_convertor.pdu_encoding).toBe(PduEncoding.CDR);
            expect(raw).toBeInstanceOf(ArrayBuffer);
            expect(restored).toBeInstanceOf(UInt64);
            expect(restored.data).toBe(source.data);
        } finally {
            compactFixture.cleanup();
        }
    });
});
