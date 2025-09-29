import { DataPacket } from './DataPacket.js';

const RPC_CHANNEL_TEMP_PREFIX = '__rpc_channel__';

function makeRpcChannelTempKey(channelId) {
    return `${RPC_CHANNEL_TEMP_PREFIX}${channelId}`;
}

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
         * @type {Map<string, Map<number, string>>}
         */
        this.rpc_channel_map = new Map();
        /**
         * @private
         * @type {Map<string, Map<string, ArrayBuffer>>}
         */
        this.rpc_buffers = new Map();
        /**
         * @private
         * @type {Map<string, string[]>}
         */
        this.pending_rpc_clients = new Map();
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
     * Stores a DataPacket's body data into the buffer.
     * @param {DataPacket} packet 
     */
    put_packet(packet) {
        const pduInfo = this.pduConfig.getPduInfoByChannelId(packet.robot_name, packet.channel_id);
        if (pduInfo) {
            this.set_buffer(packet.robot_name, pduInfo.org_name, packet.body_data);
        } else {
            console.warn(`CommunicationBuffer: Cannot put packet for unknown channel ID: ${packet.channel_id}`);
        }
    }

    /**
     * Retrieves the original PDU name for a given robot/channel pair.
     * @param {string} robotName
     * @param {number} channelId
     * @returns {string | null}
     */
    get_pdu_name(robotName, channelId) {
        const info = this.pduConfig.getPduInfoByChannelId(robotName, channelId);
        return info ? info.org_name : null;
    }

    /**
     * Retrieves the buffer for a given PDU and consumes it (removes it from the buffer).
     * @param {string} robotName 
     * @param {string} pduName 
     * @returns {ArrayBuffer | undefined}
     */
    get_buffer(robotName, pduName) {
        const robotBuffers = this.buffers.get(robotName);
        if (robotBuffers && robotBuffers.has(pduName)) {
            const data = robotBuffers.get(pduName).buffer;
            robotBuffers.delete(pduName); // Consume the buffer
            if (robotBuffers.size === 0) {
                this.buffers.delete(robotName);
            }
            return data;
        }
        return undefined;
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
     * Peeks at a buffer without consuming it.
     * @param {string} robotName
     * @param {string} pduName
     * @returns {ArrayBuffer | undefined}
     */
    peek_buffer(robotName, pduName) {
        return this.buffers.get(robotName)?.get(pduName)?.buffer;
    }

    /**
     * Registers a mapping between RPC channel IDs and logical client names.
     * @param {string} serviceName
     * @param {number} channelId
     * @param {string} clientName
     */
    register_rpc_channel(serviceName, channelId, clientName) {
        if (!this.rpc_channel_map.has(serviceName)) {
            this.rpc_channel_map.set(serviceName, new Map());
        }
        this.rpc_channel_map.get(serviceName).set(channelId, clientName);
    }

    register_pending_rpc(serviceName, clientName) {
        if (!this.pending_rpc_clients.has(serviceName)) {
            this.pending_rpc_clients.set(serviceName, []);
        }
        this.pending_rpc_clients.get(serviceName).push(clientName);
    }

    _consume_pending_rpc(serviceName) {
        const queue = this.pending_rpc_clients.get(serviceName);
        if (!queue || queue.length === 0) {
            return null;
        }
        const name = queue.shift();
        if (queue.length === 0) {
            this.pending_rpc_clients.delete(serviceName);
        }
        return name;
    }

    /**
     * Stores an RPC packet keyed by service/client name.
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
     * Retrieves and removes an RPC packet.
     * @param {string} serviceName
     * @param {string} clientName
     * @returns {ArrayBuffer | undefined}
     */
    get_rpc_packet(serviceName, clientName) {
        const serviceMap = this.rpc_buffers.get(serviceName);
        if (!serviceMap) {
            return undefined;
        }
        const data = serviceMap.get(clientName);
        if (data) {
            serviceMap.delete(clientName);
            if (serviceMap.size === 0) {
                this.rpc_buffers.delete(serviceName);
            }
        }
        return data;
    }

    /**
     * Checks if an RPC packet exists for the given service/client pair.
     * @param {string} serviceName
     * @param {string} clientName
     * @returns {boolean}
     */
    has_rpc_packet(serviceName, clientName) {
        return this.rpc_buffers.get(serviceName)?.has(clientName) ?? false;
    }

    /**
     * Removes a registered RPC channel mapping.
     * @param {string} serviceName
     * @param {number} channelId
     */
    unregister_rpc_channel(serviceName, channelId) {
        const serviceMap = this.rpc_channel_map.get(serviceName);
        if (serviceMap) {
            serviceMap.delete(channelId);
            if (serviceMap.size === 0) {
                this.rpc_channel_map.delete(serviceName);
            }
        }
    }

    /**
     * Stores RPC payload data keyed by the registered channel mapping.
     * @param {string} serviceName
     * @param {number} channelId
     * @param {ArrayBuffer} packetData
     */
    set_rpc_channel_buffer(serviceName, channelId, packetData) {
        let clientName = this.rpc_channel_map.get(serviceName)?.get(channelId);
        let fromRegisteredChannel = true;
        if (!clientName) {
            clientName = this._consume_pending_rpc(serviceName);
            fromRegisteredChannel = false;
        }
        const targetKey = clientName ?? makeRpcChannelTempKey(channelId);
        this.put_rpc_packet(serviceName, targetKey, packetData);
        if (fromRegisteredChannel && clientName) {
            this.set_buffer(serviceName, clientName, packetData);
        }
    }
}