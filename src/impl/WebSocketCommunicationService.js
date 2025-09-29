import WebSocket from 'ws';
import { WebSocketBaseCommunicationService } from './WebSocketBaseCommunicationService.js';

/**
 * WebSocket client communication service.
 */
export class WebSocketCommunicationService extends WebSocketBaseCommunicationService {
    constructor(version = "v1") {
        super(version);
        console.log("[INFO] WebSocketCommunicationService created");
    }

    /**
     * Starts the client and connects to the WebSocket server.
     * @param {import('./CommunicationBuffer').CommunicationBuffer} commBuffer
     * @param {string} uri
     * @returns {Promise<boolean>}
     */
    async start_service(commBuffer, uri) {
        this.comm_buffer = commBuffer;
        this.uri = uri;

        return new Promise((resolve) => {
            try {
                console.log(`[INFO] Connecting to WebSocket at ${uri}...`);
                this.websocket = new WebSocket(this.uri);

                this.websocket.on('open', () => {
                    console.log("[INFO] WebSocket connected and receive loop started");
                    this.service_enabled = true;
                    this._start_receive_loop(this.websocket);
                    resolve(true);
                });

                this.websocket.on('error', (err) => {
                    console.error(`[ERROR] Failed to connect WebSocket: ${err}`);
                    this.service_enabled = false;
                    // Ensure we don't try to resolve if already open
                    if (!this.service_enabled) {
                        resolve(false);
                    }
                });

                this.websocket.on('close', () => {
                    this.service_enabled = false;
                    console.log("[INFO] WebSocket connection closed.");
                });

            } catch (e) {
                console.error(`[ERROR] Exception during WebSocket connection: ${e}`);
                this.service_enabled = false;
                resolve(false);
            }
        });
    }

    /**
     * Stops the client and disconnects from the WebSocket server.
     * @returns {Promise<boolean>}
     */
    async stop_service() {
        this.service_enabled = false;
        if (this.websocket) {
            return new Promise((resolve) => {
                this.websocket.on('close', () => {
                    console.log("[INFO] WebSocket closed successfully.");
                    this.websocket = null;
                    resolve(true);
                });
                this.websocket.close();
            });
        }
        return true;
    }
}
