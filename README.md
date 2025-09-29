# hakoniwa-pdu-javascript
A communication library for Hakoniwa simulators, providing pub/sub and RPC on PDU (Packet Data Unit) over WebSocket, inspired by ROS.

## Installation

```bash
npm install hakoniwa-pdu-javascript
```

## Usage

```javascript
const hakoniwa = require('hakoniwa-pdu-javascript');

hakoniwa.sayHello();
```

## Testing

To run the integration tests, you need to start the Python test server first. This server will listen for WebSocket connections and echo back PDU data, and also handle RPC requests.


  **Run JavaScript Tests**:

    In a separate terminal, run the Jest tests:

    ```bash
    npm test
    ```

    This will execute all JavaScript test suites, including unit tests and integration tests against the running Python server.
