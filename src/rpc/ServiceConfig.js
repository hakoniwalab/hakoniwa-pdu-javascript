// src/rpc/ServiceConfig.js

/**
 * Parses and stores RPC service configuration from a service.json file (env-agnostic).
 * - Browser: fetch(URL or relative path)
 * - Node:    fs/promises でファイル読み込み（動的 import）
 */
export class ServiceConfig {
    /**
     * @param {object} serviceConfig すでにパース済みの設定オブジェクト
     */
    constructor(serviceConfig) {
        if (!serviceConfig || typeof serviceConfig !== 'object') {
            throw new Error('ServiceConfig: constructor expects a parsed config object.');
        }
        /** @type {object} */
        this.serviceConfig = serviceConfig;
    }

    /**
     * ローダ（非同期）: URL/パス/オブジェクトのいずれかを受け、ServiceConfig を返す
     * @param {string|object} source
     * @returns {Promise<ServiceConfig>}
     */
    static async load(source) {
        // 既にオブジェクトならそのまま
        if (source && typeof source === 'object') {
            return new ServiceConfig(source);
        }
        if (typeof source !== 'string') {
            throw new TypeError('ServiceConfig.load: source must be a string path/URL or an object.');
        }

        // ブラウザ（または URL 指定）→ fetch で取得
        if (ServiceConfig._isBrowser() || ServiceConfig._looksLikeUrl(source)) {
            const res = await fetch(source);
            if (!res.ok) {
                throw new Error(`ServiceConfig.load: fetch failed for ${source} (${res.status} ${res.statusText})`);
            }
            const obj = await res.json();
            return new ServiceConfig(obj);
        }

        // Node → fs/promises を動的 import して読み込み
        const { readFile } = await import('node:fs/promises');
        const text = await readFile(source, 'utf8');
        const obj = JSON.parse(text);
        return new ServiceConfig(obj);
    }

    /**
     * 指定サービス名の設定を返す
     * @param {string} serviceName
     * @returns {object | undefined}
     */
    getService(serviceName) {
        return this.serviceConfig?.services?.find(s => s.name === serviceName);
    }

    // ---- helpers ----
    static _isBrowser() {
        return typeof window !== 'undefined' && typeof window.document !== 'undefined';
    }
    static _looksLikeUrl(s) {
        return /^https?:\/\//i.test(s);
    }
}
