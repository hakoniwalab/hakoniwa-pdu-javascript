/**
 * Holds and manages the raw binary data for PDU channels and RPC packets.
 */
export class CommunicationBuffer {
    /**
     * @param {import('./PduChannelConfig').PduChannelConfig} pduConfig
     */
    constructor(pduConfig) {
        /** @private */
        this.pduConfig = pduConfig;
        /** 
         * @private 
         * @type {Map<string, Map<string, {buffer: ArrayBuffer, timestamp: number}>>}
         */
        this.buffers = new Map();
        /** 
         * @private 
         * @type {Map<string, Map<string, ArrayBuffer>>}
         */
        this.rpc_buffers = new Map();
    }

    /**
     * Get the channel ID for a specific PDU.
     * @param {string} robotName The name of the robot.
     * @param {string} pduName The name of the PDU.
     * @returns {number}
     */
    get_pdu_channel_id(robotName, pduName) {
        const info = this.pduConfig.getChannelInfo(robotName, pduName);
        return info ? info.channel_id : -1;
    }

    /**
     * Get the size of a specific PDU.
     * @param {string} robotName The name of the robot.
     * @param {string} pduName The name of the PDU.
     * @returns {number}
     */
    get_pdu_size(robotName, pduName) {
        const info = this.pduConfig.getChannelInfo(robotName, pduName);
        return info ? info.pdu_size : -1;
    }

    /**
     * Stores the buffer for a given PDU.
     * @param {string} robotName 
     * @param {string} pduName 
     * @param {ArrayBuffer} buffer 
     */
    set_buffer(robotName, pduName, buffer) {
        if (!this.buffers.has(robotName)) {
            this.buffers.set(robotName, new Map());
        }
        this.buffers.get(robotName).set(pduName, {
            buffer: buffer,
            timestamp: Date.now()
        });
    }

    /**
     * Retrieves the buffer for a given PDU.
     * @param {string} robotName 
     * @param {string} pduName 
     * @returns {ArrayBuffer | undefined}
     */
    get_buffer(robotName, pduName) {
        return this.buffers.get(robotName)?.get(pduName)?.buffer;
    }

    /**
     * Checks if a buffer exists for a given PDU.
     * @param {string} robotName 
     * @param {string} pduName 
     * @returns {boolean}
     */
    contains_buffer(robotName, pduName) {
        return this.buffers.get(robotName)?.has(pduName) ?? false;
    }

    /**
     * Stores an RPC packet.
     * @param {string} serviceName 
     * @param {string} clientName 
     * @param {ArrayBuffer} packetData 
     */
    put_rpc_packet(serviceName, clientName, packetData) {
        if (!this.rpc_buffers.has(serviceName)) {
            this.rpc_buffers.set(serviceName, new Map());
        }
        this.rpc_buffers.get(serviceName).set(clientName, packetData);
    }

    /**
     * Retrieves an RPC packet and removes it from the buffer.
     * @param {string} serviceName 
     * @param {string} clientName 
     * @returns {ArrayBuffer | undefined}
     */
    get_rpc_packet(serviceName, clientName) {
        const packet = this.rpc_buffers.get(serviceName)?.get(clientName);
        if (packet) {
            this.rpc_buffers.get(serviceName).delete(clientName);
        }
        return packet;
    }
}