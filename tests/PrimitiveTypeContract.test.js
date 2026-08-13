import * as PduUtils from '../src/pdu_msgs/pdu_utils.js';
import { pduToJs_Char, jsToPdu_Char } from '../src/pdu_msgs/std_msgs/pdu_conv_Char.js';
import { Char } from '../src/pdu_msgs/std_msgs/pdu_jstype_Char.js';
import {
    pduToJs_ByteMultiArray,
    jsToPdu_ByteMultiArray,
} from '../src/pdu_msgs/std_msgs/pdu_conv_ByteMultiArray.js';
import { ByteMultiArray } from '../src/pdu_msgs/std_msgs/pdu_jstype_ByteMultiArray.js';


describe.each(['byte', 'char'])('%s uint8 contract', (typeName) => {
    test('supports scalar and array values over the full uint8 range', () => {
        const scalar = PduUtils.typeToBin(typeName, 255, 1);
        expect(PduUtils.binToValue(typeName, scalar)).toBe(255);

        const array = PduUtils.typesToBin(typeName, [0, 127, 255]);
        expect(PduUtils.binToArrayValues(typeName, array, 3)).toEqual([0, 127, 255]);
    });
});


test('generated Char roundtrip uses a number', () => {
    const value = new Char();
    value.data = 254;

    const restored = pduToJs_Char(jsToPdu_Char(value));

    expect(restored.data).toBe(254);
    expect(typeof restored.data).toBe('number');
});


test('ByteMultiArray roundtrip accepts the full uint8 range', () => {
    const value = new ByteMultiArray();
    value.data = [0, 127, 255];

    const restored = pduToJs_ByteMultiArray(jsToPdu_ByteMultiArray(value));

    expect(Array.from(restored.data)).toEqual(value.data);
});
