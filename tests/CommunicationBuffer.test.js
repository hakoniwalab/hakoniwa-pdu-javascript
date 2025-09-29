import { CommunicationBuffer } from '../src/impl/CommunicationBuffer.js';
import { PduChannelConfig } from '../src/impl/PduChannelConfig.js';
import { DataPacket } from '../src/impl/DataPacket.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAMPLE_CONFIG = {
    "robots": [
        {
            "name": "RobotA",
            "shm_pdu_readers": [
                {"org_name": "pos", "channel_id": 1, "pdu_size": 16, "type": "Pos"}
            ],
            "shm_pdu_writers": []
        }
    ]
};

describe('CommunicationBuffer', () => {
    let configFilePath;

    beforeAll(() => {
        // Create a temporary config file for testing
        configFilePath = path.join(__dirname, 'temp_pdu_config.json');
        fs.writeFileSync(configFilePath, JSON.stringify(SAMPLE_CONFIG));
    });

    afterAll(() => {
        // Clean up the temporary config file
        fs.unlinkSync(configFilePath);
    });

    it('should correctly put and get a packet, consuming it upon retrieval', () => {
        const cfg = new PduChannelConfig(configFilePath);
        const buffer = new CommunicationBuffer(cfg);
        const robotName = "RobotA";
        const channelId = 1;
        const pduName = "pos";
        const testBody = new Uint8Array([97, 98, 99]).buffer; // 'abc'

        // Create a DataPacket (v2 is default for DataPacket constructor)
        const packet = new DataPacket(robotName, channelId, testBody);

        // Put the packet into the buffer
        buffer.put_packet(packet);

        // Check if it contains the buffer
        expect(buffer.contains_buffer(robotName, pduName)).toBe(true);

        // Get the buffer
        const retrievedData = buffer.get_buffer(robotName, pduName);

        // Assert the retrieved data
        expect(retrievedData).not.toBeUndefined();
        expect(new Uint8Array(retrievedData)).toEqual(new Uint8Array(testBody));

        // Assert that the buffer is consumed (removed) after retrieval
        expect(buffer.contains_buffer(robotName, pduName)).toBe(false);
    });

    it('should correctly put and get an RPC packet', () => {
        const cfg = new PduChannelConfig(configFilePath);
        const buffer = new CommunicationBuffer(cfg);
        const serviceName = "Service/Add";
        const clientName = "client1";
        const rpcData = new Uint8Array([10, 11, 12]).buffer;

        buffer.put_rpc_packet(serviceName, clientName, rpcData);

        const retrievedRpcData = buffer.get_rpc_packet(serviceName, clientName);

        expect(retrievedRpcData).not.toBeUndefined();
        expect(new Uint8Array(retrievedRpcData)).toEqual(new Uint8Array(rpcData));

        // Assert that the RPC packet is consumed after retrieval
        expect(buffer.get_rpc_packet(serviceName, clientName)).toBeUndefined();
    });
});
