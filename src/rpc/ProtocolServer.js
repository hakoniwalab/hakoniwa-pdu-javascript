import * as codes from './codes.js';

/**
 * @typedef {function(any): Promise<any>} RequestHandler
 */

/**
 * A high-level RPC server that wraps the low-level PDU manager (e.g., RemotePduServiceServerManager)
 * to provide a simplified, Python-like interface for serving RPC requests.
 */
export class ProtocolServer {
    /**
     * @param {import('./RemotePduServiceServerManager').RemotePduServiceServerManager} pduManager
     * @param {string} serviceName
     * @param {number} maxClients
     * @param {any} clsReqPacket
     * @param {Function} reqEncoder
     * @param {Function} reqDecoder
     * @param {any} clsResPacket
     * @param {Function} resEncoder
     * @param {Function} resDecoder
     */
    constructor(pduManager, serviceName, maxClients, clsReqPacket, reqEncoder, reqDecoder, clsResPacket, resEncoder, resDecoder) {
        this.pduManager = pduManager;
        this.services = {};
        this.isServing = false;
        this.primaryService = serviceName;

        this.addService(serviceName, maxClients, clsReqPacket, reqEncoder, reqDecoder, clsResPacket, resEncoder, resDecoder);
    }

    /**
     * Adds another service that this server can handle.
     */
    addService(serviceName, maxClients, clsReqPacket, reqEncoder, reqDecoder, clsResPacket, resEncoder, resDecoder, handler = null) {
        this.services[serviceName] = {
            maxClients,
            clsReqPacket,
            reqEncoder,
            reqDecoder,
            clsResPacket,
            resEncoder,
            resDecoder,
            handler
        };
        // If the pduManager needs to know about decoders, register them here.
        if (typeof this.pduManager.addServiceDecoder === 'function') {
            this.pduManager.addServiceDecoder(serviceName, reqDecoder);
        }
    }

    /**
     * Starts the underlying RPC service(s).
     * @returns {Promise<boolean>}
     */
    async startServices() {
        for (const name in this.services) {
            const ctx = this.services[name];
            // The pduManager in JS doesn't require pre-registering serializers.
            // It's assumed to handle different PDUs based on channel/service info.
            if (!await this.pduManager.start_rpc_service(name, ctx.maxClients)) {
                console.error(`Failed to start RPC service '${name}'`);
                return false;
            }
            console.log(`RPC service '${name}' started.`);
        }
        return true;
    }

    /**
     * Starts the main server loop to listen for and handle requests.
     * @param {RequestHandler | {[serviceName: string]: RequestHandler}} handlers
     * @param {number} [pollInterval=0.01] - Poll interval in seconds.
     */
    async serve(handlers, pollInterval = 0.01) {
        if (typeof handlers === 'function') {
            this.services[this.primaryService].handler = handlers;
        } else {
            for (const name in handlers) {
                if (this.services[name]) {
                    this.services[name].handler = handlers[name];
                } else {
                    throw new Error(`Handler specified for unknown service '${name}'`);
                }
            }
        }

        this.isServing = true;
        console.log("Server starting to serve...");

        while (this.isServing) {
            try {
                const [serviceName, event] = await this.pduManager.poll_request();

                if (this.pduManager.is_server_event_request_in(event)) {
                    const [clientHandle, reqPduData] = this.pduManager.get_request();
                    const serviceContext = this.services[serviceName];

                    if (serviceContext) {
                        try {
                            const resPduData = await this._handleRequest(serviceContext, clientHandle, reqPduData);
                            await this.pduManager.put_response(clientHandle, resPduData);
                        } catch (e) {
                            console.error(`Error processing request for service '${serviceName}':`, e);
                            // TODO: Optionally send an error response back to the client
                        }
                    } else {
                        console.warn(`Received request for unhandled service '${serviceName}'`);
                    }
                } else if (this.pduManager.is_server_event_none(event)) {
                    await this.sleep(pollInterval);
                } else if (this.pduManager.is_server_event_client_disconnected && this.pduManager.is_server_event_client_disconnected(event)) {
                    const [clientHandle] = this.pduManager.get_request();
                    console.log(`Client ${JSON.stringify(clientHandle)} disconnected.`);
                }
            } catch (e) {
                if (this.isServing) {
                    console.error("Server loop error:", e);
                    await this.sleep(1); 
                }
            }
        }
        console.log("Server has stopped serving.");
    }

    /**
     * Stops the server loop.
     */
    stop() {
        this.isServing = false;
    }

    /**
     * (Private) Handles a single request.
     * @param {object} serviceContext
     * @param {any} clientHandle - The client handle object from the pduManager.
     * @param {ArrayBuffer} reqPduData
     * @returns {Promise<ArrayBuffer>}
     */
    async _handleRequest(serviceContext, clientHandle, reqPduData) {
        if (!serviceContext.handler) {
            throw new Error(`No handler registered for service`);
        }

        const requestPdu = serviceContext.reqDecoder(reqPduData);
        
        const responseBody = await serviceContext.handler(requestPdu.body);

        const resPacket = new serviceContext.clsResPacket();
        if (!resPacket.header) resPacket.header = {};
        
        // Crucially, transfer the request_id from the request to the response header.
        resPacket.header.request_id = requestPdu.header.request_id;
        resPacket.header.status = codes.API_STATUS_DONE;
        resPacket.header.result_code = codes.API_RESULT_CODE_OK;

        resPacket.body = responseBody;
        const resPduData = serviceContext.resEncoder(resPacket);

        return resPduData;
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