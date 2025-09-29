import { DataPacket, PDU_DATA } from '../src/impl/DataPacket.js';

describe('DataPacket', () => {
    describe('v1 Protocol', () => {
        it('should correctly encode and decode a packet in a round-trip', () => {
            const robotName = 'RobotA';
            const channelId = 42;
            const body = new Uint8Array([1, 2, 3]).buffer;

            // Encode
            const packet = new DataPacket(robotName, channelId, body);
            const encoded = packet.encode('v1');

            // Decode
            const decoded = DataPacket.decode(encoded, 'v1');

            // Assert
            expect(decoded).not.toBeNull();
            expect(decoded.robot_name).toBe(robotName);
            expect(decoded.channel_id).toBe(channelId);
            expect(new Uint8Array(decoded.body_data)).toEqual(new Uint8Array(body));
        });
    });

    describe('v2 Protocol', () => {
        it('should correctly encode and decode a packet in a round-trip', () => {
            const robotName = 'RobotB';
            const channelId = 123;
            const body = new Uint8Array([10, 20, 30, 40, 50]).buffer;
            const metaRequestType = PDU_DATA;

            // Encode
            const packet = new DataPacket(robotName, channelId, body);
            const encoded = packet.encode('v2', metaRequestType);

            // Decode
            const decoded = DataPacket.decode(encoded, 'v2');

            // Assert
            expect(decoded).not.toBeNull();
            expect(decoded.robot_name).toBe(robotName);
            expect(decoded.channel_id).toBe(channelId);
            expect(new Uint8Array(decoded.body_data)).toEqual(new Uint8Array(body));
            expect(decoded.meta_pdu).not.toBeNull();
            expect(decoded.meta_pdu.meta_request_type).toBe(metaRequestType);
        });
    });
});
