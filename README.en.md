# hakoniwa-pdu-javascript

[日本語](./README.md) | [English](./README.en.md)

`hakoniwa-pdu-javascript` is a JavaScript library for handling Hakoniwa PDUs over WebSocket.

In Hakoniwa, communication between simulators and external applications is based on PDUs. A PDU is a communication unit encoded in a Hakoniwa-specific binary format derived from ROS IDL. This library makes that PDU-based communication easier to use from browsers and Node.js applications.

As a first practical target, this library is intended for connecting to the Hakoniwa drone simulator and monitoring or visualizing its state from a browser.

## What You Can Do With This Library

- Read and write Hakoniwa PDUs over WebSocket
- Monitor simulator state from a browser
- Visualize drone and sensor state with Three.js or similar libraries
- Integrate external tools using RPC-oriented PDUs

Typical use cases:

- Build a read-only monitor or viewer in the browser
- Visualize drone position and attitude with Three.js
- Control a Hakoniwa simulator from external tools such as Scratch

## Expected Setup

This library does not run a simulator by itself. A typical setup is:

1. Start a Hakoniwa simulator such as `hakoniwa-drone-core`
2. Start the WebSocket bridge provided by `hakoniwa-pdu-bridge-core`
3. Connect a browser or Node.js application built with this library to the bridge

For a first trial, the Hakoniwa drone simulator is the easiest target.

```text
+------------------------+       +-------------------------------+       +-------------------------------+
| hakoniwa-drone-core    | <---> | hakoniwa-pdu-bridge-core      | <---> | Browser / Node.js App         |
| (simulation)           |       | (WebSocket bridge)            |       | (hakoniwa-pdu-javascript)     |
+------------------------+       +-------------------------------+       +-------------------------------+
```

## Recommended First Target

For a first setup, the following combination is recommended:

- Simulator: `hakoniwa-drone-core`
- PDU bridge: `hakoniwa-pdu-bridge-core`
- Browser visualization reference: `hakoniwa-threejs-drone`
- RPC integration reference: `hakoniwa-scratch`

These related repositories are listed again in the "Related Projects" section below.

## Installation

If you want to use the npm package:

```bash
npm install hakoniwa-pdu-javascript
```

If you want to try this repository locally:

```bash
git clone https://github.com/hakoniwalab/hakoniwa-pdu-javascript.git
cd hakoniwa-pdu-javascript
npm install
```

Requirements:

- Node.js 18 or later
- npm 9 or later

## Minimal Connection Example

The following example shows the minimum setup: load a PDU definition file, connect to the WebSocket bridge, and access PDU metadata.

```javascript
import {
  PduManager,
  PduConvertor,
  WebSocketCommunicationService
} from 'hakoniwa-pdu-javascript';

async function main() {
  const manager = new PduManager({ wire_version: 'v2' });
  const transport = new WebSocketCommunicationService('v2');

  // Reuse the PDU definition file provided by hakoniwa-drone-core
  await manager.initialize('./drone_pdu_config.json', transport);
  await manager.start_service('ws://127.0.0.1:8080');

  const channelId = manager.get_pdu_channel_id('Drone', 'pos');
  const pduSize = manager.get_pdu_size('Drone', 'pos');
  const convertor = new PduConvertor('', manager.pdu_config);

  console.log('channelId =', channelId);
  console.log('pduSize =', pduSize);

  const raw = manager.read_pdu_raw_data('Drone', 'pos');
  if (raw) {
    const pos = await convertor.convert_binary_to_json('Drone', 'pos', raw);
    console.log(pos);
  }

  await manager.stop_service();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

To read a PDU as structured data:

```javascript
const raw = manager.read_pdu_raw_data('Drone', 'pos');
if (raw) {
  const convertor = new PduConvertor('', manager.pdu_config);
  const pos = await convertor.convert_binary_to_json('Drone', 'pos', raw);
  console.log(pos);
}
```

To write a PDU:

```javascript
const raw = new ArrayBuffer(8);
const view = new DataView(raw);
view.setBigUint64(0, 42n, true);

await manager.flush_pdu_raw_data('Drone', 'motor', raw);
```

In the drone simulator, commonly used PDUs include `pos`, `velocity`, `status`, and `motor`. For a first step, starting with read-only access to `pos` or `status` is the easiest path.

## About PDU Definition Files

This library loads a PDU definition file and resolves the mapping between `robot / pdu_name / channel_id / pdu_size / type`.

At the moment, the practical recommendation is to reuse the PDU definition files already provided by existing Hakoniwa drone simulator repositories.

Notes:

- Legacy PDU definition files are supported
- Compact PDU definition files are also supported
- In compact format, `pdudef.json` references `pdutypes.json`

Policy:

- Existing legacy PDU definition files remain supported
- For newly managed PDU definition files, compact format is recommended
- However, the simplest way to get started today is still to reuse the existing legacy drone PDU definition files

This README does not explain how to design and create custom PDU definition files. For now, start with the existing drone definitions.

## Related Projects

- Hakoniwa drone simulator: https://github.com/toppers/hakoniwa-drone-core
- WebSocket-based PDU bridge: https://github.com/hakoniwalab/hakoniwa-pdu-bridge-core
- Three.js drone visualization example: https://github.com/hakoniwalab/hakoniwa-threejs-drone
- Scratch integration example: https://github.com/hakoniwalab/hakoniwa-scratch

Guidance:

- If you want monitoring or visualization, start with `hakoniwa-threejs-drone`
- If you want external tool integration or control flows, look at `hakoniwa-scratch`

## Tests

This repository is a library, so validation is mainly done through unit tests and communication tests.

```bash
npm test
```

The tests mainly cover:

- PDU definition file loading
- Compatibility between legacy and compact formats
- `PduManager` initialization
- WebSocket send/receive behavior

## API Overview

In most cases, `PduManager` is the main entry point.

Main classes:

- `PduManager`
  - Loads PDU definition files
  - Initializes the communication service
  - Reads and writes PDUs
- `WebSocketCommunicationService`
  - Connects to the WebSocket bridge
- `PduConvertor`
  - Converts between binary PDUs and JavaScript objects
- `RemotePduServiceClientManager` / `RemotePduServiceServerManager`
  - Helpers for RPC-oriented usage

Typical flow:

1. Load a PDU definition file with `PduManager.initialize()`
2. Connect to the WebSocket bridge with `start_service()`
3. Inspect metadata with `get_pdu_channel_id()` and `get_pdu_size()`
4. Communicate with `read_pdu_raw_data()` and `flush_pdu_raw_data()`

## License

MIT License
