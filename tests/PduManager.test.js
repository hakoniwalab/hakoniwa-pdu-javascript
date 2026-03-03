import { PduManager } from '../src/PduManager.js';
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
        } finally {
            compactFixture.cleanup();
        }
    });
});
