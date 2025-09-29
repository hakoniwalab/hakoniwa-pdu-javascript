import * as fs from 'fs';

/**
 * Parses and stores RPC service configuration from a service.json file.
 */
export class ServiceConfig {
    /**
     * @param {string} serviceConfigPath Path to the service.json configuration file.
     */
    constructor(serviceConfigPath) {
        /** @type {string} */
        this.serviceConfigPath = serviceConfigPath;
        /** @type {object} */
        this.serviceConfig = this._loadJson(serviceConfigPath);

        if (!this.serviceConfig) {
            throw new Error(`Failed to load service config from ${serviceConfigPath}`);
        }
    }

    /**
     * Finds and returns the configuration for a specific service.
     * @param {string} serviceName The name of the service to find.
     * @returns {object | undefined}
     */
    getService(serviceName) {
        return this.serviceConfig.services?.find(service => service.name === serviceName);
    }

    /**
     * @private
     * @param {string} path 
     * @returns {object | null}
     */
    _loadJson(path) {
        try {
            const fileContent = fs.readFileSync(path, 'utf8');
            return JSON.parse(fileContent);
        } catch (e) {
            console.error(`[ERROR] ServiceConfig: Failed to load or parse JSON file at ${path}`, e);
            return null;
        }
    }
}
