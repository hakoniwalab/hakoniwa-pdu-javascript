import path from 'path';
import { fileURLToPath } from 'url';

import { 
    RemotePduServiceClientManager, 
    RemotePduServiceServerManager,
    WebSocketCommunicationService,
    WebSocketServerCommunicationService,
} from '../src/index.js';
import { createAddTwoIntsRequest } from '../src/pdu_msgs/hako_srv_msgs/pdu_jstype_AddTwoIntsRequest.js';
import { createAddTwoIntsResponse } from '../src/pdu_msgs/hako_srv_msgs/pdu_jstype_AddTwoIntsResponse.js';
import { js_to_pdu_AddTwoIntsRequest, pdu_to_js_AddTwoIntsRequest } from '../src/pdu_msgs/hako_srv_msgs/pdu_conv_AddTwoIntsRequest.js';
import { pdu_to_js_AddTwoIntsResponse, js_to_pdu_AddTwoIntsResponse } from '../src/pdu_msgs/hako_srv_msgs/pdu_conv_AddTwoIntsResponse.js';
import * as codes from '../src/rpc/codes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8772;
const URI = `ws://localhost:${PORT}`;
const PDU_CONFIG_PATH = path.join(__dirname, './pdu_config.json');
const SERVICE_CONFIG_PATH = path.join(__dirname, './service.json');

describe('RemotePduServiceClientManager and ServerManager RPC Calls', () => {
    let clientPduManager;
    let clientCommService;

    let serverPduManager;
    let serverCommService;
    let serverLoopActive = false;

    // Server-side request processing loop
    const runServerLoop = async () => {
        serverLoopActive = true;
        while (serverLoopActive) {
            try {
                const [serviceName, event] = await serverPduManager.poll_request();
                if (serverPduManager.is_server_event_request_in(event)) {
                    const [client_handle, raw_data] = serverPduManager.get_request();
                    
                    if (serviceName === 'Service/Add') {
                        const req = pdu_to_js_AddTwoIntsRequest(raw_data);
                        console.log(`JS Server: AddTwoInts request: a=${req.a}, b=${req.b}`);
                        
                        const res = createAddTwoIntsResponse();
                        res.sum = req.a + req.b;
                        const response_pdu_data = js_to_pdu_AddTwoIntsResponse(res);
                        
                        await serverPduManager.put_response(client_handle, response_pdu_data);
                    }
                }
            } catch (e) {
                if (serverLoopActive) {
                    console.error("Server loop error:", e);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 10)); // Small delay to prevent busy-waiting
        }
    };

    beforeAll(async () => {
        console.log('Starting JavaScript RPC test server...');
        serverCommService = new WebSocketServerCommunicationService('v2');
        serverPduManager = new RemotePduServiceServerManager(
            'test_server', 
            PDU_CONFIG_PATH, 
            serverCommService, 
            URI
        );
        serverPduManager.initialize_services(SERVICE_CONFIG_PATH, 1000 * 1000);
        
        const serverStarted = await serverPduManager.start_rpc_service('Service/Add', 10);
        if (!serverStarted) {
            throw new Error("Failed to start JS server");
        }
        runServerLoop(); // Start the server loop in the background
        console.log('JavaScript RPC test server started.');
    });

    afterAll(async () => {
        console.log('Stopping JavaScript RPC test server...');
        serverLoopActive = false;
        if (clientPduManager && clientPduManager.is_service_enabled()) {
            await clientPduManager.stop_service();
        }
        if (serverPduManager && serverPduManager.is_service_enabled()) {
            await serverPduManager.stop_service();
        }
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
        // 1. Start client service
        const clientStarted = await clientPduManager.start_client_service();
        expect(clientStarted).toBe(true);
        expect(clientPduManager.is_service_enabled()).toBe(true);

        // 2. Register client
        const serviceName = 'Service/Add';
        const clientName = 'test_client';
        const clientId = await clientPduManager.register_client(serviceName, clientName);
        expect(clientId).not.toBeNull();
        // Verify dynamically assigned channel IDs for the first client
        expect(clientId.request_channel_id).toBe(0);
        expect(clientId.response_channel_id).toBe(1);

        // 3. Make RPC call
        const req = createAddTwoIntsRequest();
        req.a = 10;
        req.b = 20;
        const pduData = js_to_pdu_AddTwoIntsRequest(req);

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
        const res = pdu_to_js_AddTwoIntsResponse(responseRawData);
        expect(res).not.toBeNull();
        expect(res.sum).toBe(30);
    }, 10000); // Increase timeout for this test
});