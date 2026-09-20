import { browserConverterLoaders } from '../src/browser/generatedConverterRegistry.js';

describe('browser converter registry', () => {
    it('contains literal loaders for both generated encodings', () => {
        expect(browserConverterLoaders['cdr:std_msgs/String']).toBeInstanceOf(Function);
        expect(browserConverterLoaders['hako:std_msgs/String']).toBeInstanceOf(Function);
    });

    it('loads the std_msgs/String CDR converter', async () => {
        const module = await browserConverterLoaders['cdr:std_msgs/String']();
        expect(module.PduStringConverter.from_cdr).toBeInstanceOf(Function);
        expect(module.PduStringConverter.to_cdr).toBeInstanceOf(Function);
    });
});
