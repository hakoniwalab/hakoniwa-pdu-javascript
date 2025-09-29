/**
 * Interface for communication services (e.g., WebSocket).
 * This class is meant to be extended by concrete implementations.
 */
export class ICommunicationService {
    constructor() {
        if (this.constructor === ICommunicationService) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    /**
     * Sets the PDU channel configuration.
     * @param {import('./PduChannelConfig').PduChannelConfig} pduConfig
     */
    set_channel_config(pduConfig) {
        throw new Error("Method 'set_channel_config()' must be implemented.");
    }

    /**
     * Checks if the service is currently enabled.
     * @returns {boolean}
     */
    is_service_enabled() {
        throw new Error("Method 'is_service_enabled()' must be implemented.");
    }

    /**
     * Starts the communication service.
     * @param {import('./CommunicationBuffer').CommunicationBuffer} commBuffer
     * @param {string} uri
     * @returns {Promise<boolean>}
     */
    async start_service(commBuffer, uri) {
        throw new Error("Method 'start_service()' must be implemented.");
    }

    /**
     * Stops the communication service.
     * @returns {Promise<boolean>}
     */
    async stop_service() {
        throw new Error("Method 'stop_service()' must be implemented.");
    }

    /**
     * Sends data for a specific channel (for v1 wire protocol).
     * @param {string} robot_name
     * @param {number} channel_id
     * @param {ArrayBuffer} pdu_raw_data
     * @returns {Promise<boolean>}
     */
    async send_data(robot_name, channel_id, pdu_raw_data) {
        throw new Error("Method 'send_data()' must be implemented.");
    }

    /**
     * Sends binary data (for v2 wire protocol).
     * @param {ArrayBuffer} raw_data
     * @returns {Promise<boolean>}
     */
    async send_binary(raw_data) {
        throw new Error("Method 'send_binary()' must be implemented.");
    }

    /**
     * Non-blocking version of start_service.
     * @param {import('./CommunicationBuffer').CommunicationBuffer} commBuffer
     * @param {string} uri
     * @returns {boolean}
     */
    start_service_nowait(commBuffer, uri) {
        throw new Error("Method 'start_service_nowait()' must be implemented.");
    }

    /**
     * Non-blocking version of stop_service.
     * @returns {boolean}
     */
    stop_service_nowait() {
        throw new Error("Method 'stop_service_nowait()' must be implemented.");
    }

    /**
     * Non-blocking run method.
     * @returns {boolean}
     */
    run_nowait() {
        throw new Error("Method 'run_nowait()' must be implemented.");
    }
}
