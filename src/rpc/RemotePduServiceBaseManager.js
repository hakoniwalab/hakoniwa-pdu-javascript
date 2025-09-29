import { PduManager } from '../PduManager.js';
import { ServiceConfig } from './ServiceConfig.js';

/**
 * Common functionality for remote RPC managers.
 * Extends PduManager to reuse its connection and PDU handling capabilities.
 */
export class RemotePduServiceBaseManager extends PduManager {
    /**
     * @param {string} asset_name
     * @param {string} pdu_config_path
     * @param {import('../impl/ICommunicationService').ICommunicationService} comm_service
     * @param {string} uri
     */
    constructor(asset_name, pdu_config_path, comm_service, uri) {
        super({ wire_version: comm_service.version });
        this.asset_name = asset_name;
        this.uri = uri;
        this.initialize(pdu_config_path, comm_service);

        /** @type {ServiceConfig | null} */
        this.service_config = null;
        /** @type {string | null} */
        this.service_config_path = null;
        /** @type {number | null} */
        this.delta_time_usec = null;
        /** @type {number | null} */
        this.delta_time_sec = null;
    }

    /**
     * Initializes the RPC services with a service configuration file.
     * @param {string} service_config_path 
     * @param {number} delta_time_usec 
     * @returns {number}
     */
    initialize_services(service_config_path, delta_time_usec) {
        this.service_config_path = service_config_path;
        this.service_config = new ServiceConfig(service_config_path);
        this.delta_time_usec = delta_time_usec;
        this.delta_time_sec = delta_time_usec / 1_000_000.0;
        return 0;
    }

    /**
     * Pauses execution for a specified amount of time.
     * @param {number} time_sec 
     * @returns {Promise<boolean>}
     */
    async sleep(time_sec) {
        return new Promise(resolve => setTimeout(() => resolve(true), time_sec * 1000));
    }
}
