import path from 'path';
import { fileURLToPath } from 'url';

import {
    RemotePduServiceClientManager,
    RemotePduServiceServerManager,
    WebSocketCommunicationService,
    WebSocketServerCommunicationService,
} from '../src/index.js';
import { AddTwoIntsRequest } from '../src/pdu_msgs/hako_srv_msgs/pdu_jstype_AddTwoIntsRequest.js';
import { AddTwoIntsResponse } from '../src/pdu_msgs/hako_srv_msgs/pdu_jstype_AddTwoIntsResponse.js';
import { makeProtocolClient, makeProtocolServer } from '../src/rpc/autoWire.js';
import {
    API_RESULT_CODE_OK,
    API_STATUS_DONE
} from '../src/rpc/codes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8773; // Use a different port to avoid conflict with the other test file
const URI = `ws://localhost:${PORT}`;
const PDU_CONFIG_PATH = path.join(__dirname, './pdu_config.json');
const SERVICE_CONFIG_PATH = path.join(__dirname, './service.json');

async function handler(req) {
    const res = new AddTwoIntsResponse();
    res.sum = req.a + req.b;
    console.log(`Handled AddTwoInts: ${req.a} + ${req.b} = ${res.sum}`);
    return res;
}

describe('RpcProtocolClient High-Level RPC Calls', () => {
    let serverPduManager;
    let serverCommService;
    let protocolServer;
    let serverLoopPromise;


    // Server-side setup is the same as in RpcClient.test.js
    const runServerLoop = async (protocolServer) => {
        try {
            await protocolServer.serve(handler);
        } catch (e) {
            console.error("Server loop error:", e);
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
        await serverPduManager.initialize_services(SERVICE_CONFIG_PATH, 1000 * 1000);
        protocolServer = await makeProtocolServer({
            pduManager: serverPduManager,
            serviceName: 'Service/Add',
            srv: 'AddTwoInts',
            maxClients: 1,
            pkg: 'hako_srv_msgs'
        });
        await protocolServer.startServices();
        serverLoopPromise = runServerLoop(protocolServer);
        console.log('JavaScript High-Level RPC test server started.');
    });

    afterAll(async () => {
        console.log('Stopping JavaScript High-Level RPC test server...');
        if (protocolServer) {
            await protocolServer.stop();
        }
        if (serverLoopPromise) {
            await serverLoopPromise;
        }
        if (serverPduManager) {
            await serverPduManager.stop_service();
        }
        if (serverCommService) {
            await serverCommService.stop_service();
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
        await pduManager.initialize_services(SERVICE_CONFIG_PATH, 1000 * 1000);

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
        const req = new AddTwoIntsRequest();
        req.a = 100n;
        req.b = 200n;
        const res = await protocolClient.call(req);

        // 5. Verify the response
        expect(res).not.toBeNull();
        expect(res.sum).toBe(300n);
        
        // 6. Stop the client service
        await pduManager.stop_service();

    }, 10000);
});