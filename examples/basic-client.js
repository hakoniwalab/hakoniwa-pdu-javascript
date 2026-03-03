import {
  PduManager,
  PduConvertor,
  WebSocketCommunicationService
} from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, 'sample-config.json');

async function main() {
  const manager = new PduManager({ wire_version: 'v2' });
  const transport = new WebSocketCommunicationService('v2');

  await manager.initialize(configPath, transport);
  const convertor = new PduConvertor('', manager.pdu_config);

  if (!await manager.start_service('ws://127.0.0.1:8080')) {
    console.error('Failed to connect to WebSocket service.');
    process.exit(1);
  }

  const declared = await manager.declare_pdu_for_readwrite('sample_robot', 'actuator_command');
  if (!declared) {
    console.error('Failed to declare PDUs.');
    await manager.stop_service();
    process.exit(1);
  }

  const sensorBuffer = manager.read_pdu_raw_data('sample_robot', 'sensor_state');
  if (sensorBuffer) {
    const sensorState = await convertor.convert_binary_to_json('sample_robot', 'sensor_state', sensorBuffer);
    console.log('[sensor_state]', sensorState);
  } else {
    console.warn('No sensor data available yet.');
  }

  const commandBuffer = new ArrayBuffer(8);
  const commandView = new DataView(commandBuffer);
  commandView.setBigUint64(0, 42n, true);
  await manager.flush_pdu_raw_data('sample_robot', 'actuator_command', commandBuffer);
  console.log('Sent actuator command with payload 42.');

  await manager.stop_service();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
