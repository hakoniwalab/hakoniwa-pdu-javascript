/**
 * Handles the conversion between binary PDU data and JavaScript objects.
 * It acts as a dispatcher, dynamically calling the appropriate converter 
 * from the `pdu_msgs` directory.
 */
export class PduConvertor {
    /**
     * @param {string} hakoBinaryPath - Path to the offset directory (for compatibility with Python version, not strictly used in JS version).
     * @param {import('./PduChannelConfig').PduChannelConfig} pduConfig 
     */
    constructor(hakoBinaryPath, pduConfig) {
        this.hakoBinaryPath = hakoBinaryPath; // Not used in JS, but kept for API consistency
        this.pduConfig = pduConfig;
    }

    /**
     * Constructs the path to the converter module and the function names.
     * @private
     * @param {string} pduType - e.g., "std_msgs/String"
     * @returns {{modulePath: string, toJsFunc: string, toPduFunc: string} | null}
     */
    _getConverterInfo(pduType) {
        if (!pduType || !pduType.includes('/')) {
            return null;
        }
        const [pkg, name] = pduType.split('/');
        const modulePath = `../pdu_msgs/${pkg}/pdu_conv_${name}.js`;
        const toJsFunc = `pduToJs_${name}`;
        const toPduFunc = `jsToPdu_${name}`;
        return { modulePath, toJsFunc, toPduFunc };
    }

    /**
     * Converts binary PDU data into a JavaScript object.
     * @param {string} robotName 
     * @param {string} pduName 
     * @param {ArrayBuffer} binaryData 
     * @returns {Promise<object | null>}
     */
    async convert_binary_to_json(robotName, pduName, binaryData) {
        const channelInfo = this.pduConfig.getChannelInfo(robotName, pduName);
        if (!channelInfo) {
            console.error(`[PduConvertor] No channel info found for ${robotName}/${pduName}`);
            return null;
        }

        const converterInfo = this._getConverterInfo(channelInfo.type);
        if (!converterInfo) {
            console.error(`[PduConvertor] Invalid PDU type for ${robotName}/${pduName}: ${channelInfo.type}`);
            return null;
        }

        try {
            const module = await import(converterInfo.modulePath);
            const converterFunc = module[converterInfo.toJsFunc];
            if (typeof converterFunc !== 'function') {
                console.error(`[PduConvertor] Function ${converterInfo.toJsFunc} not found in ${converterInfo.modulePath}`);
                return null;
            }
            return converterFunc(binaryData);
        } catch (err) {
            console.error(`[PduConvertor] Failed to convert binary to json for ${pduName}:`, err);
            return null;
        }
    }

    /**
     * Converts a JavaScript object into binary PDU data.
     * @param {string} robotName 
     * @param {string} pduName 
     * @param {object} jsonData 
     * @returns {Promise<ArrayBuffer | null>}
     */
    async convert_json_to_binary(robotName, pduName, jsonData) {
        const channelInfo = this.pduConfig.getChannelInfo(robotName, pduName);
        if (!channelInfo) {
            console.error(`[PduConvertor] No channel info found for ${robotName}/${pduName}`);
            return null;
        }

        const converterInfo = this._getConverterInfo(channelInfo.type);
        if (!converterInfo) {
            console.error(`[PduConvertor] Invalid PDU type for ${robotName}/${pduName}: ${channelInfo.type}`);
            return null;
        }

        try {
            const module = await import(converterInfo.modulePath);
            const converterFunc = module[converterInfo.toPduFunc];
            if (typeof converterFunc !== 'function') {
                console.error(`[PduConvertor] Function ${converterInfo.toPduFunc} not found in ${converterInfo.modulePath}`);
                return null;
            }
            return converterFunc(jsonData);
        } catch (err) {
            console.error(`[PduConvertor] Failed to convert json to binary for ${pduName}:`, err);
            return null;
        }
    }
}
