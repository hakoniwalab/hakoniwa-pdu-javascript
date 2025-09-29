import path from 'path';
import { fileURLToPath } from 'url';

import {
    RemotePduServiceClientManager,
    RemotePduServiceServerManager,
    WebSocketCommunicationService,
    WebSocketServerCommunicationService,
} from '../src/index.js';
import { makeProtocolClient } from '../src/rpc/autoWire.js';
import { pduToJs_AddTwoIntsRequest } from '../src/pdu_msgs/hako_srv_msgs/pdu_conv_AddTwoIntsRequest.js';
import { AddTwoIntsResponse } from '../src/pdu_msgs/hako_srv_msgs/pdu_jstype_AddTwoIntsResponse.js';
import { jsToPdu_AddTwoIntsResponse } from '../src/pdu_msgs/hako_srv_msgs/pdu_conv_AddTwoIntsResponse.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8773; // Use a different port to avoid conflict with the other test file
const URI = `ws://localhost:${PORT}`;
const PDU_CONFIG_PATH = path.join(__dirname, './pdu_config.json');
const SERVICE_CONFIG_PATH = path.join(__dirname, './service.json');

describe('RpcProtocolClient High-Level RPC Calls', () => {
    let serverPduManager;
    let serverCommService;
    let serverLoopActive = false;

    // Server-side setup is the same as in RpcClient.test.js
    const runServerLoop = async () => {
        serverLoopActive = true;
        while (serverLoopActive) {
            try {
                const [serviceName, event] = await serverPduManager.poll_request();
                if (serverPduManager.is_server_event_request_in(event)) {
                    const [client_handle, raw_data] = serverPduManager.get_request();
                    
                    if (serviceName === 'Service/Add') {
                        const req = pduToJs_AddTwoIntsRequest(raw_data);
                        
                        const res = new AddTwoIntsResponse();
                        res.sum = req.a + req.b;
                        const response_pdu_data = jsToPdu_AddTwoIntsResponse(res);
                        
                        await serverPduManager.put_response(client_handle, response_pdu_data);
                    }
                }
            } catch (e) {
                if (serverLoopActive) {
                    console.error("Server loop error:", e);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    };

    beforeAll(async () => {
        console.log('Starting JavaScript High-Level RPC test server...');
        serverCommService = new WebSocketServerCommunicationService('v2');
        serverPduManager = new RemotePduServiceServerManager(
            'test_server_high_level', 
            PDU_CONFIG_PATH, 
            serverCommService, 
            URI
        );
        serverPduManager.initialize_services(SERVICE_CONFIG_PATH, 1000 * 1000);
        
        const serverStarted = await serverPduManager.start_rpc_service('Service/Add', 10);
        if (!serverStarted) {
            throw new Error("Failed to start JS server for high-level test");
        }
        runServerLoop();
        console.log('JavaScript High-Level RPC test server started.');
    });

    afterAll(async () => {
        console.log('Stopping JavaScript High-Level RPC test server...');
        serverLoopActive = false;
        if (serverPduManager) {
            await serverPduManager.stop_service();
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    });

    it('should successfully make an RPC call using the high-level ProtocolClient', async () => {
        // 1. Setup the low-level PDU manager for the client
        const clientCommService = new WebSocketCommunicationService('v2');
        const pduManager = new RemotePduServiceClientManager(
            'test_client_high_level', 
            PDU_CONFIG_PATH, 
            clientCommService, 
            URI
        );
        pduManager.initialize_services(SERVICE_CONFIG_PATH, 1000 * 1000);

        // 2. Create the high-level client using the auto-wire helper
        const protocolClient = await makeProtocolClient({
            pduManager: pduManager,
            serviceName: 'Service/Add',
            clientName: 'test_client_high_level',
            srv: 'AddTwoInts',
            pkg: 'hako_srv_msgs'
        });

        // 3. Start the service and register the client
        await protocolClient.startService();
        const registered = await protocolClient.register();
        expect(registered).toBe(true);

        // 4. Make the RPC call with just the request body
        const reqBody = { a: 100n, b: 200n };
        const resBody = await protocolClient.call(reqBody);

        // 5. Verify the response
        expect(resBody).not.toBeNull();
        expect(resBody.sum).toBe(300n);
        
        // 6. Stop the client service
        await pduManager.stop_service();

    }, 10000);
});