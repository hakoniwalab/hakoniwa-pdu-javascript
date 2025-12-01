import { pduToJs_RegisterClientResponsePacket } from '../pdu_msgs/hako_srv_msgs/pdu_conv_RegisterClientResponsePacket.js';
import { jsToPdu_RegisterClientRequestPacket } from '../pdu_msgs/hako_srv_msgs/pdu_conv_RegisterClientRequestPacket.js';
import { RegisterClientRequestPacket } from '../pdu_msgs/hako_srv_msgs/pdu_jstype_RegisterClientRequestPacket.js';
import * as codes from './codes.js';

/**
 * A high-level RPC client that wraps the low-level PDU manager (e.g., RemotePduServiceClientManager)
 * to provide a simplified, Python-like interface for making RPC calls.
 */
export class ProtocolClient {
    /**
     * @param {import('./RemotePduServiceClientManager').RemotePduServiceClientManager} pduManager - An instance of RemotePduServiceClientManager.
     * @param {string} serviceName - The name of the remote service (e.g., "Service/Add").
     * @param {string} clientName - The name of this client instance.
     * @param {any} clsReqPacket - The constructor for the request PDU packet.
     * @param {Function} reqEncoder - Function to encode the request PDU.
     * @param {Function} reqDecoder - Function to decode the request PDU.
     * @param {any} clsResPacket - The constructor for the response PDU packet.
     * @param {Function} resEncoder - Function to encode the response PDU.
     * @param {Function} resDecoder - Function to decode the response PDU.
     */
    constructor(pduManager, serviceName, clientName, clsReqPacket, reqEncoder, reqDecoder, clsResPacket, resEncoder, resDecoder) {
        this.pduManager = pduManager;
        this.serviceName = serviceName;
        this.clientName = clientName;
        this.clsReqPacket = clsReqPacket;
        this.reqEncoder = reqEncoder;
        this.reqDecoder = reqDecoder;
        this.clsResPacket = clsResPacket;
        this.resEncoder = resEncoder;
        this.resDecoder = resDecoder;

        this.clientId = null;
        this.lastRequestId = -1;
        this.clientRequestIdCounter = 0;
    }

    /**
     * Starts the underlying communication service.
     * @returns {Promise<boolean>}
     */
    async startService() {
        return await this.pduManager.start_client_service();
    }

    /**
     * Registers this client with the remote service by calling the pduManager.
     * @returns {Promise<boolean>} - True if registration is successful.
     */
    async register(timeout = 5.0) {
        // We pass the serviceName and clientName, which the pduManager will use.
        this.clientId = await this.pduManager.register_client(this.serviceName, this.clientName, timeout);
        if (this.clientId) {
            //console.log(`Client '${this.clientName}' registered with service '${this.serviceName}' (ID: ${JSON.stringify(this.clientId)})`);
            return true;
        }
        console.error(`Failed to register client '${this.clientName}' with service '${this.serviceName}'`);
        return false;
    }

    /**
     * The main method to call a remote procedure.
     * @param {any} requestData - The body of the request PDU.
     * @param {number} [timeoutMsec=1000] - Timeout for the call in milliseconds.
     * @param {number} [pollInterval=0.01] - Poll interval in seconds.
     * @returns {Promise<any|null>} - The body of the response PDU, or null on timeout/error.
     */
    async call(requestData, timeoutMsec = -1, pollInterval = 0.01) {
        if (this.clientId === null) {
            console.error("Client is not registered. Call register() first.");
            return null;
        }

        try {
            //console.log(`Calling service '${this.serviceName}' with client ID: ${JSON.stringify(this.clientId)}`);
            const reqPduData = this._createRequestPacket(requestData, pollInterval);

            if (!await this.pduManager.call_request(this.clientId, reqPduData, timeoutMsec)) {
                console.error("Failed to send request via pduManager.call_request.");
                return null;
            }
            //console.log("Request sent, waiting for response...");
            const [isTimeout, responseBody] = await this._waitResponse(pollInterval, timeoutMsec);

            if (isTimeout) {
                console.error("Request timed out.");
                return null;
            }

            return responseBody;
        } catch (e) {
            console.error("An error occurred during the call:", e);
            return null;
        }
    }

    /**
     * (Private) Creates and encodes a request packet.
     * @param {any} requestData - The body of the request.
     * @param {number} pollInterval - The poll interval in seconds.
     * @returns {ArrayBuffer|null} - The encoded PDU packet, or null on failure.
     */
    _createRequestPacket(requestData, pollInterval) {
        if (this.clientId === null) {
            throw new Error("Client is not registered. Call register() first.");
        }

        const reqPacket = new this.clsReqPacket();
        
        const currentRequestId = this.clientRequestIdCounter++;
        this.lastRequestId = currentRequestId;

        if (!reqPacket.header) {
            reqPacket.header = {};
        }
        if (this.pduManager.service_name !== this.serviceName) {
            this.pduManager.service_name = this.serviceName;
        }
        if (this.pduManager.client_name !== this.clientName) {
            this.pduManager.client_name = this.clientName;
        }
        reqPacket.header.service_name = this.serviceName;
        reqPacket.header.client_name = this.clientName;
        reqPacket.header.request_id = currentRequestId;
        reqPacket.header.opcode = codes.CLIENT_API_OPCODE_REQUEST;
        reqPacket.header.status_poll_interval_msec = Math.floor(pollInterval * 1000);

        reqPacket.body = requestData;
        const reqPduData = this.reqEncoder(reqPacket);
        
        return reqPduData;
    }

    /**
     * (Private) Waits for a response from the server.
     * @param {number} pollInterval - The poll interval in seconds.
     * @param {number} timeoutMsec - The total timeout in milliseconds.
     * @returns {Promise<[boolean, any]>} - A tuple [isTimeout, responseBody].
     */
    async _waitResponse(pollInterval, timeoutMsec) {
        const noTimeout = timeoutMsec < 0;
        const endTime = noTimeout ? Infinity : Date.now() + timeoutMsec;

        while (Date.now() < endTime) {
            //console.log("Polling for response...");
            const event = this.pduManager.poll_response(this.clientId);

            if (this.pduManager.is_client_event_response_in(event)) {
                const resPduData = this.pduManager.get_response(this.serviceName, this.clientId);
                if (!resPduData) {
                    console.warn("Received null response PDU data, continuing to poll...");
                    continue;
                }
                const responseData = this.resDecoder(resPduData);
                if (responseData.header.request_id !== this.lastRequestId) {
                    console.warn("Received response with mismatched request ID, continuing to poll...: responseData.header.request_id =", responseData.header.request_id, ", this.lastRequestId =", this.lastRequestId);
                    continue;
                }
                //console.log("Received response:", responseData);
                return [false, responseData.body]; // 成功
            }

            if (this.pduManager.is_client_event_timeout(event) && !noTimeout) {
                return [true, null]; // タイムアウト
            }

            await this.sleep(pollInterval);
        }
        return [true, null];
    }
    
    /**
     * Helper to sleep for a given number of seconds.
     * @param {number} seconds
     * @returns {Promise<void>}
     */
    sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}