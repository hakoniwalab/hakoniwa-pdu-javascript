import * as fs from 'fs';

/**
 * Parses and stores PDU channel configuration from a JSON file.
 */
export class PduChannelConfig {
    /**
     * @param {string} configPath Path to the JSON configuration file.
     */
    constructor(configPath) {
        /** @type {string} */
        this.configPath = configPath;
        /** @type {object} */
        this.config = null;
        this._loadConfig();
    }

    _loadConfig() {
        try {
            const fileContent = fs.readFileSync(this.configPath, 'utf8');
            this.config = JSON.parse(fileContent);
        } catch (error) {
            console.error(`[ERROR] Failed to load or parse PDU config file: ${this.configPath}`, error);
            throw error;
        }
    }

    /**
     * Get the entire configuration object for a specific robot.
     * @param {string} robotName The name of the robot.
     * @returns {object | undefined}
     */
    getRobotConfig(robotName) {
        return this.config?.robots.find(r => r.name === robotName);
    }

    /**
     * Get the channel information for a specific PDU.
     * @param {string} robotName The name of the robot.
     * @param {string} pduName The name of the PDU.
     * @returns {{channel_id: number, pdu_size: number, type: string} | undefined}
     */
    getChannelInfo(robotName, pduName) {
        const robotConfig = this.getRobotConfig(robotName);
        if (!robotConfig) return undefined;

        // Search in both readers and writers
        const readers = robotConfig.shm_pdu_readers || [];
        const writers = robotConfig.shm_pdu_writers || [];
        return [...readers, ...writers].find(p => p.org_name === pduName);
    }

    /**
     * Get the PDU information by its channel ID for a specific robot.
     * @param {string} robotName The name of the robot.
     * @param {number} channelId The channel ID of the PDU.
     * @returns {{org_name: string, pdu_size: number, type: string} | undefined}
     */
    getPduInfoByChannelId(robotName, channelId) {
        const robotConfig = this.getRobotConfig(robotName);
        if (!robotConfig) return undefined;

        const readers = robotConfig.shm_pdu_readers || [];
        const writers = robotConfig.shm_pdu_writers || [];
        const pduInfo = [...readers, ...writers].find(p => p.channel_id === channelId);
        return pduInfo ? { org_name: pduInfo.org_name, pdu_size: pduInfo.pdu_size, type: pduInfo.type } : undefined;
    }
}
