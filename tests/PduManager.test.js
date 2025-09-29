import { PduManager } from '../src/PduManager.js';

describe('PduManager', () => {
    it('should be instantiable', () => {
        const manager = new PduManager();
        expect(manager).toBeInstanceOf(PduManager);
    });
});
