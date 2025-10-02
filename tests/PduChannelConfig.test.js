import { PduChannelConfig } from '../src/impl/PduChannelConfig.js';
import { CommunicationBuffer } from '../src/impl/CommunicationBuffer.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAMPLE_CONFIG = {
    "robots": [
        {
            "name": "RobotA",
            "shm_pdu_readers": [
                {"org_name": "pos", "channel_id": 1, "pdu_size": 16, "type": "Pos"}
            ],
            "shm_pdu_writers": [
                {"org_name": "cmd", "channel_id": 2, "pdu_size": 8, "type": "Cmd"}
            ]
        },
        {
            "name": "RobotB",
            "shm_pdu_readers": [],
            "shm_pdu_writers": [
                {"org_name": "status", "channel_id": 3, "pdu_size": 32, "type": "Status"}
            ]
        }
    ]
};

describe('PduChannelConfig and CommunicationBuffer config queries', () => {
    let configFilePath;
    let pduConfig;
    let commBuffer;

    beforeAll(async () => {
        configFilePath = path.join(__dirname, 'temp_pdu_channel_config.json');
        fs.writeFileSync(configFilePath, JSON.stringify(SAMPLE_CONFIG));
        pduConfig = await PduChannelConfig.load(configFilePath);
        commBuffer = new CommunicationBuffer(pduConfig);
    });

    afterAll(() => {
        fs.unlinkSync(configFilePath);
    });

    describe('PduChannelConfig queries', () => {
        it('should get robot configuration by name', () => {
            const robotAConfig = pduConfig.getRobotConfig('RobotA');
            expect(robotAConfig).toBeDefined();
            expect(robotAConfig.name).toBe('RobotA');

            const nonExistentRobot = pduConfig.getRobotConfig('RobotC');
            expect(nonExistentRobot).toBeUndefined();
        });

        it('should get channel info by robot name and pdu name', () => {
            const posInfo = pduConfig.getChannelInfo('RobotA', 'pos');
            expect(posInfo).toBeDefined();
            expect(posInfo.channel_id).toBe(1);
            expect(posInfo.pdu_size).toBe(16);
            expect(posInfo.type).toBe('Pos');

            const cmdInfo = pduConfig.getChannelInfo('RobotA', 'cmd');
            expect(cmdInfo).toBeDefined();
            expect(cmdInfo.channel_id).toBe(2);
            expect(cmdInfo.pdu_size).toBe(8);
            expect(cmdInfo.type).toBe('Cmd');

            const nonExistentPdu = pduConfig.getChannelInfo('RobotA', 'unknown');
            expect(nonExistentPdu).toBeUndefined();

            const nonExistentRobotPdu = pduConfig.getChannelInfo('RobotC', 'pos');
            expect(nonExistentRobotPdu).toBeUndefined();
        });

        it('should get PDU info by robot name and channel ID', () => {
            const posInfo = pduConfig.getPduInfoByChannelId('RobotA', 1);
            expect(posInfo).toBeDefined();
            expect(posInfo.org_name).toBe('pos');
            expect(posInfo.pdu_size).toBe(16);
            expect(posInfo.type).toBe('Pos');

            const cmdInfo = pduConfig.getPduInfoByChannelId('RobotA', 2);
            expect(cmdInfo).toBeDefined();
            expect(cmdInfo.org_name).toBe('cmd');
            expect(cmdInfo.pdu_size).toBe(8);
            expect(cmdInfo.type).toBe('Cmd');

            const nonExistentChannel = pduConfig.getPduInfoByChannelId('RobotA', 999);
            expect(nonExistentChannel).toBeUndefined();

            const nonExistentRobotChannel = pduConfig.getPduInfoByChannelId('RobotC', 1);
            expect(nonExistentRobotChannel).toBeUndefined();
        });
    });

    describe('CommunicationBuffer config queries', () => {
        it('should get PDU channel ID by robot name and pdu name', () => {
            expect(commBuffer.get_pdu_channel_id('RobotA', 'pos')).toBe(1);
            expect(commBuffer.get_pdu_channel_id('RobotA', 'cmd')).toBe(2);
            expect(commBuffer.get_pdu_channel_id('RobotA', 'unknown')).toBe(-1);
            expect(commBuffer.get_pdu_channel_id('RobotC', 'pos')).toBe(-1);
        });

        it('should get PDU size by robot name and pdu name', () => {
            expect(commBuffer.get_pdu_size('RobotA', 'pos')).toBe(16);
            expect(commBuffer.get_pdu_size('RobotA', 'cmd')).toBe(8);
            expect(commBuffer.get_pdu_size('RobotA', 'unknown')).toBe(-1);
            expect(commBuffer.get_pdu_size('RobotC', 'pos')).toBe(-1);
        });
    });
});
