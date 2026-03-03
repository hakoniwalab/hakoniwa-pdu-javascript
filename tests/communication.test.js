import { PduManager } from '../src/PduManager.js';
import { WebSocketCommunicationService } from '../src/impl/WebSocketCommunicationService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { createCompactPdudefFixture } from './testUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8765;
const URI = `ws://localhost:${PORT}`;
const PDU_CONFIG_PATH = path.join(__dirname, './pdu_config.json');

const COMPACT_PDUTYPES = [
    {
        channel_id: 1,
        name: 'client_to_server',
        pdu_size: 24,
        type: 'hako_msgs/SimpleVarray',
    },
    {
        channel_id: 2,
        name: 'server_to_client',
        pdu_size: 24,
        type: 'hako_msgs/SimpleVarray',
    },
];

describe('Client-Server Communication', () => {
    let wsServer;
    let pduManager;
    let commService;
    let compactFixture;

    beforeAll(async () => {
        compactFixture = createCompactPdudefFixture(
            __dirname,
            'temp_comm_compact_',
            ['test_client', 'test_server'],
            COMPACT_PDUTYPES
        );

        wsServer = new WebSocketServer({ port: PORT });

        wsServer.on('connection', (socket) => {
            console.log('WebSocket server: client connected.');
            socket.on('message', (message) => {
                console.log('WebSocket server: received message, echoing back.');
                socket.send(message);
            });
        });

        await new Promise((resolve, reject) => {
            wsServer.once('listening', () => {
                console.log(`WebSocket server: listening on port ${PORT}.`);
                resolve();
            });
            wsServer.once('error', (err) => {
                console.error(`WebSocket server error: ${err}`);
                reject(err);
            });
        });
    });

    afterAll(async () => {
        console.log('Stopping WebSocket server...');
        if (wsServer) {
            await new Promise((resolve, reject) => {
                wsServer.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
        compactFixture.cleanup();
    });

    describe.each([
        ['legacy', PDU_CONFIG_PATH],
        ['compact', () => compactFixture.pdudefPath],
    ])('%s config', (_label, configPathOrFactory) => {
        beforeEach(async () => {
            commService = new WebSocketCommunicationService('v2');
            pduManager = new PduManager({ wire_version: 'v2' });
            const configPath = typeof configPathOrFactory === 'function'
                ? configPathOrFactory()
                : configPathOrFactory;
            await pduManager.initialize(configPath, commService);
        });

        afterEach(async () => {
            if (pduManager) {
                await pduManager.stop_service();
            }
        });

        it('should connect to the server, send data, and receive an echo', async () => {
            // Add a small delay to ensure the server is ready to accept connections
            await new Promise(resolve => setTimeout(resolve, 500));

            // 1. Connect
            const connected = await pduManager.start_service(URI);
            expect(connected).toBe(true);
            expect(pduManager.is_service_enabled()).toBe(true);

            // 2. Send data
            const robotName = 'test_client';
            const pduName = 'client_to_server';
            const channelId = pduManager.get_pdu_channel_id(robotName, pduName);
            expect(channelId).not.toBe(-1);

            const textEncoder = new TextEncoder();
            const testPayload = textEncoder.encode('Hello, Hakoniwa!');
            
            const sent = await pduManager.flush_pdu_raw_data(robotName, pduName, testPayload);
            expect(sent).toBe(true);

            // 3. Wait for and verify echo
            let receivedData = null;
            const endTime = Date.now() + 5000; // 5-second timeout
            while (Date.now() < endTime) {
                // The echo server sends the same packet back, so we read from the same pduName
                receivedData = pduManager.read_pdu_raw_data(robotName, pduName);
                if (receivedData) {
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            expect(receivedData).not.toBeNull();
            // The flushed data is just the body, so we compare against the original payload.
            expect(new Uint8Array(receivedData)).toEqual(testPayload);
        });
    });
});
