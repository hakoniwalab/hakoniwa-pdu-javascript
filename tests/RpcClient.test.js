import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import { RemotePduServiceClientManager, WebSocketCommunicationService, RpcServiceConfig } from '../src/index.js';
import { AddTwoIntsRequest } from '../src/pdu_msgs/hako_srv_msgs/pdu_jstype_AddTwoIntsRequest.js';
import { AddTwoIntsResponse } from '../src/pdu_msgs/hako_srv_msgs/pdu_jstype_AddTwoIntsResponse.js';
import { jsToPdu_AddTwoIntsRequest } from '../src/pdu_msgs/hako_srv_msgs/pdu_conv_AddTwoIntsRequest.js';
import { pduToJs_AddTwoIntsResponse } from '../src/pdu_msgs/hako_srv_msgs/pdu_conv_AddTwoIntsResponse.js';
import * as codes from '../src/rpc/codes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8772; // Use a different port than communication.test.js
const URI = `ws://localhost:${PORT}`;
const PDU_CONFIG_PATH = path.join(__dirname, './pdu_config.json');
const SERVICE_CONFIG_PATH = path.join(__dirname, './service.json');

describe('RemotePduServiceClientManager RPC Calls', () => {
    let pythonServer;
    let clientPduManager;
    let clientCommService;

    beforeAll((done) => {
        console.log('Starting Python RPC test server...');
        pythonServer = spawn('python3', ['-u', 'tests/rpc_test_server.py', PORT.toString()]);

        pythonServer.stdout.on('data', (data) => {
            console.log(`Python RPC Server: ${data}`);
            if (data.toString().includes('RPC test server started')) {
                done();
            }
        });

        pythonServer.stderr.on('data', (data) => {
            console.error(`Python RPC Server Error: ${data}`);
        });
    });

    afterAll(async () => {
        console.log('Stopping Python RPC test server...');
        if (clientPduManager && clientPduManager.is_service_enabled()) {
            await clientPduManager.stop_service();
        }
        pythonServer.kill();
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    beforeEach(() => {
        clientCommService = new WebSocketCommunicationService('v2');
        clientPduManager = new RemotePduServiceClientManager(
            'test_client', 
            PDU_CONFIG_PATH, 
            clientCommService, 
            URI
        );
        clientPduManager.initialize_services(SERVICE_CONFIG_PATH, 1000 * 1000);
    });

    it('should successfully register a client and make an RPC call', async () => {
        // Add a small delay to ensure the server is ready to accept connections
        await new Promise(resolve => setTimeout(resolve, 500));

        // 1. Start client service
        const clientStarted = await clientPduManager.start_client_service();
        expect(clientStarted).toBe(true);
        expect(clientPduManager.is_service_enabled()).toBe(true);

        // 2. Register client
        const serviceName = 'Service/Add';
        const clientName = 'test_client';
        const clientId = await clientPduManager.register_client(serviceName, clientName);
        expect(clientId).not.toBeNull();
        expect(clientId.request_channel_id).toBe(100);
        expect(clientId.response_channel_id).toBe(101);

        // 3. Make RPC call
        const req = new AddTwoIntsRequest();
        req.a = 10;
        req.b = 20;
        const pduData = jsToPdu_AddTwoIntsRequest(req);

        const callRequested = await clientPduManager.call_request(clientId, pduData, 5000);
        expect(callRequested).toBe(true);

        // 4. Poll for response
        let responseEvent = codes.CLIENT_API_EVENT_NONE;
        const endTime = Date.now() + 5000; // 5-second timeout
        let responseRawData = null;

        while (Date.now() < endTime && responseEvent === codes.CLIENT_API_EVENT_NONE) {
            responseEvent = clientPduManager.poll_response(clientId);
            if (responseEvent === codes.CLIENT_API_EVENT_RESPONSE_IN) {
                responseRawData = clientPduManager.get_response(serviceName, clientId);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        expect(responseEvent).toBe(codes.CLIENT_API_EVENT_RESPONSE_IN);
        expect(responseRawData).not.toBeNull();

        // 5. Verify response
        const res = pduToJs_AddTwoIntsResponse(responseRawData);
        expect(res).not.toBeNull();
        expect(res.sum).toBe(30);
    });
});
