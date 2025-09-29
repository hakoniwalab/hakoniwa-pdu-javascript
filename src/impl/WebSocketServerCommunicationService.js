import { WebSocketServer } from 'ws';
import { parse } from 'url';
import { WebSocketBaseCommunicationService } from './WebSocketBaseCommunicationService.js';

/**
 * WebSocket server communication service.
 * This implementation allows only one client to be connected at a time.
 */
export class WebSocketServerCommunicationService extends WebSocketBaseCommunicationService {
    constructor(version = "v1") {
        super(version);
        /** @type {import('ws').Server | null} */
        this.server = null;
        console.log("[INFO] WebSocketServerCommunicationService created");
    }

    /**
     * Starts the WebSocket server.
     * @param {import('./CommunicationBuffer').CommunicationBuffer} commBuffer
     * @param {string} uri
     * @returns {Promise<boolean>}
     */
    async start_service(commBuffer, uri) {
        this.comm_buffer = commBuffer;
        this.uri = uri;

        const parsedUri = parse(uri);
        const host = parsedUri.hostname;
        const port = parseInt(parsedUri.port, 10);

        return new Promise((resolve) => {
            try {
                this.server = new WebSocketServer({ host, port });

                this.server.on('listening', () => {
                    console.log(`[INFO] WebSocket server started at ${host}:${port}`);
                    this.service_enabled = true;
                    resolve(true);
                });

                this.server.on('connection', (ws) => {
                    this._client_handler(ws);
                });

                this.server.on('error', (err) => {
                    console.error(`[ERROR] Failed to start WebSocket server: ${err}`);
                    this.service_enabled = false;
                    resolve(false);
                });

            } catch (e) {
                console.error(`[ERROR] Exception during server startup: ${e}`);
                this.service_enabled = false;
                resolve(false);
            }
        });
    }

    /**
     * Handles a new client connection.
     * @private
     * @param {import('ws').WebSocket} websocket
     */
    _client_handler(websocket) {
        if (this.websocket) {
            console.warn("[WARN] Another client tried to connect. Closing new connection as only one client is allowed.");
            websocket.close();
            return;
        }

        console.log("[INFO] Client connected.");
        this.websocket = websocket;
        this._start_receive_loop(this.websocket);

        this.websocket.on('close', () => {
            console.log("[INFO] Client disconnected.");
            this.websocket = null; // Allow a new client to connect
        });
    }

    /**
     * Stops the WebSocket server.
     * @returns {Promise<boolean>}
     */
    async stop_service() {
        this.service_enabled = false;

        // Close the active client connection if it exists
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }

        // Close the server
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(() => {
                    console.log("[INFO] WebSocket server stopped.");
                    this.server = null;
                    resolve(true);
                });
            });
        }
        return true;
    }
}
