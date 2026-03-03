/**
 * Parses and stores PDU channel configuration from a JSON object.
 * Use `PduChannelConfig.load(pathOrUrl)` to create from a file/URL.
 */
export class PduChannelConfig {
    /**
     * @param {object} normalizedConfig A compact-normalized JSON object for the PDU config.
     */
    constructor(normalizedConfig) {
        if (!normalizedConfig || typeof normalizedConfig !== 'object') {
            throw new Error('PduChannelConfig: constructor expects a parsed config object.');
        }
        /** @type {object} */
        this.config = normalizedConfig;
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
                const pathModule = await import('path');
                const { readFileSync } = await import('fs');
                const text = readFileSync(pathOrUrl, 'utf8');
                const json = JSON.parse(text);
                const baseDir = pathModule.dirname(pathOrUrl);
                const normalized = await PduChannelConfig._normalizeConfig(json, {
                    isNode: true,
                    baseRef: baseDir,
                });
                return new PduChannelConfig(normalized);
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
                const normalized = await PduChannelConfig._normalizeConfig(json, {
                    isNode: false,
                    baseRef: new URL(pathOrUrl, window.location.href),
                });
                return new PduChannelConfig(normalized);
            } catch (error) {
                console.error(`[ERROR] PduChannelConfig: Failed to fetch or parse: ${pathOrUrl}`, error);
                throw error;
            }
        }
    }

    static async _normalizeConfig(parsedConfig, { isNode, baseRef }) {
        if (parsedConfig?.paths) {
            return await this._convertCompactToCompactNormalized(parsedConfig, { isNode, baseRef });
        }
        return this._convertLegacyToCompactNormalized(parsedConfig);
    }

    static _createCompactRobot(name, pdus) {
        return { name, pdus };
    }

    static _toCompactPdu({ name, type, channel_id, pdu_size }) {
        return { name, type, channel_id, pdu_size };
    }

    static _dedupePdus(pdus) {
        const seen = new Set();
        const result = [];
        for (const pdu of pdus) {
            const key = `${pdu.name}|${pdu.channel_id}|${pdu.type}`;
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            result.push(pdu);
        }
        return result;
    }

    static _convertLegacyToCompactNormalized(parsedConfig) {
        const robots = (parsedConfig?.robots || []).map((robot) => {
            const readers = robot.shm_pdu_readers || [];
            const writers = robot.shm_pdu_writers || [];
            const pdus = [...readers, ...writers].map((pdu) => this._toCompactPdu({
                name: pdu.org_name,
                type: pdu.type,
                channel_id: pdu.channel_id,
                pdu_size: pdu.pdu_size,
            }));
            return this._createCompactRobot(robot.name, this._dedupePdus(pdus));
        });
        return { robots };
    }

    static async _loadCompactPdutypes(pathInfo, { isNode, baseRef }) {
        if (!pathInfo?.path) {
            return [];
        }
        if (isNode) {
            const pathModule = await import('path');
            const { readFileSync } = await import('fs');
            const resolvedPath = pathModule.isAbsolute(pathInfo.path)
                ? pathInfo.path
                : pathModule.join(baseRef, pathInfo.path);
            return JSON.parse(readFileSync(resolvedPath, 'utf8'));
        }

        const resolvedUrl = new URL(pathInfo.path, baseRef);
        const response = await fetch(resolvedUrl, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }

    static async _convertCompactToCompactNormalized(parsedConfig, { isNode, baseRef }) {
        const pdutypesMap = new Map();
        for (const pathInfo of parsedConfig.paths || []) {
            if (!pathInfo?.id) {
                continue;
            }
            pdutypesMap.set(pathInfo.id, await this._loadCompactPdutypes(pathInfo, { isNode, baseRef }));
        }

        const robots = (parsedConfig.robots || []).map((robot) => {
            const pdutypes = pdutypesMap.get(robot.pdutypes_id) || [];
            const pdus = pdutypes.map((pdu) => this._toCompactPdu({
                name: pdu.name,
                type: pdu.type,
                channel_id: pdu.channel_id,
                pdu_size: pdu.pdu_size,
            }));
            return this._createCompactRobot(robot.name, this._dedupePdus(pdus));
        });

        return { robots };
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
        const pduInfo = (robotConfig.pdus || []).find((pdu) => pdu.name === pduName);
        return pduInfo
            ? { channel_id: pduInfo.channel_id, pdu_size: pduInfo.pdu_size, type: pduInfo.type }
            : undefined;
    }

    /**
     * Get the PDU information by its channel ID for a specific robot.
     * @returns {{org_name: string, pdu_size: number, type: string} | undefined}
     */
    getPduInfoByChannelId(robotName, channelId) {
        const robotConfig = this.getRobotConfig(robotName);
        if (!robotConfig) return undefined;
        const pduInfo = (robotConfig.pdus || []).find((pdu) => pdu.channel_id === channelId);
        return pduInfo
            ? { org_name: pduInfo.name, pdu_size: pduInfo.pdu_size, type: pduInfo.type }
            : undefined;
    }
}
