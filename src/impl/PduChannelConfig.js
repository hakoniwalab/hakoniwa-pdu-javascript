// src/impl/PduChannelConfig.js など

/**
 * Parses and stores PDU channel configuration from a JSON object.
 * Use `PduChannelConfig.load(pathOrUrl)` to create from a file/URL.
 */
export class PduChannelConfig {
    /**
     * @param {object} parsedConfig A parsed JSON object for the PDU config.
     */
    constructor(parsedConfig) {
        if (!parsedConfig || typeof parsedConfig !== 'object') {
            throw new Error('PduChannelConfig: constructor expects a parsed config object.');
        }
        /** @type {object} */
        this.config = parsedConfig;
    }

    /**
     * Environment-agnostic loader.
     * - Node.js: reads local file via fs (dynamic import; no top-level fs dependency)
     * - Browser: fetches JSON from URL
     * @param {string} pathOrUrl
     * @returns {Promise<PduChannelConfig>}
     */
    static async load(pathOrUrl) {
        const isNode = (typeof window === 'undefined') &&
                       (typeof process !== 'undefined') &&
                       !!process.versions?.node;

        if (isNode) {
            try {
                const { readFileSync } = await import('fs');
                const text = readFileSync(pathOrUrl, 'utf8');
                const json = JSON.parse(text);
                return new PduChannelConfig(json);
            } catch (error) {
                console.error(`[ERROR] PduChannelConfig: Failed to load or parse file: ${pathOrUrl}`, error);
                throw error;
            }
        } else {
            try {
                const res = await fetch(pathOrUrl, { cache: 'no-cache' });
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status} ${res.statusText}`);
                }
                const json = await res.json();
                return new PduChannelConfig(json);
            } catch (error) {
                console.error(`[ERROR] PduChannelConfig: Failed to fetch or parse: ${pathOrUrl}`, error);
                throw error;
            }
        }
    }

    /** Get the entire configuration object for a specific robot. */
    getRobotConfig(robotName) {
        return this.config?.robots?.find(r => r.name === robotName);
    }

    /**
     * Get the channel information for a specific PDU.
     * @returns {{channel_id: number, pdu_size: number, type: string} | undefined}
     */
    getChannelInfo(robotName, pduName) {
        const robotConfig = this.getRobotConfig(robotName);
        if (!robotConfig) return undefined;

        const readers = robotConfig.shm_pdu_readers || [];
        const writers = robotConfig.shm_pdu_writers || [];
        return [...readers, ...writers].find(p => p.org_name === pduName);
    }

    /**
     * Get the PDU information by its channel ID for a specific robot.
     * @returns {{org_name: string, pdu_size: number, type: string} | undefined}
     */
    getPduInfoByChannelId(robotName, channelId) {
        const robotConfig = this.getRobotConfig(robotName);
        if (!robotConfig) return undefined;

        const readers = robotConfig.shm_pdu_readers || [];
        const writers = robotConfig.shm_pdu_writers || [];
        const pduInfo = [...readers, ...writers].find(p => p.channel_id === channelId);
        return pduInfo
            ? { org_name: pduInfo.org_name, pdu_size: pduInfo.pdu_size, type: pduInfo.type }
            : undefined;
    }
}
