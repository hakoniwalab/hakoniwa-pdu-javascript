import { PduManager } from './PduManager.js';
import { ICommunicationService } from './impl/ICommunicationService.js';
import { PduChannelConfig } from './impl/PduChannelConfig.js';
import { PduConvertor } from './impl/PduConvertor.js';
import * as pdu_utils from './pdu_msgs/pdu_utils.js';
import * as pdu_constants from './impl/DataPacket.js';
import { WebSocketCommunicationService } from './impl/WebSocketCommunicationService.js';
import { WebSocketServerCommunicationService } from './impl/WebSocketServerCommunicationService.js';
import { RemotePduServiceClientManager } from './rpc/RemotePduServiceClientManager.js';
import { RemotePduServiceServerManager } from './rpc/RemotePduServiceServerManager.js';
import { ServiceConfig } from './rpc/ServiceConfig.js';
import * as rpc_codes from './rpc/codes.js';

import { SystemControlRequest } from './pdu_msgs/hako_srv_msgs/pdu_jstype_SystemControlRequest.js';
import { SystemControlOpCode } from './rpc/codes.js';

// Drone Services
//DroneSetReady, DroneTakeOff, DroneLand, DroneGetState, DroneGoTo, CameraSetTilt, MagnetGrab
import { DroneSetReadyRequest } from './pdu_msgs/drone_srv_msgs/pdu_jstype_DroneSetReadyRequest.js';
import { DroneTakeOffRequest } from './pdu_msgs/drone_srv_msgs/pdu_jstype_DroneTakeOffRequest.js';
import { DroneLandRequest } from './pdu_msgs/drone_srv_msgs/pdu_jstype_DroneLandRequest.js';
import { DroneGetStateRequest } from './pdu_msgs/drone_srv_msgs/pdu_jstype_DroneGetStateRequest.js';
import { DroneGoToRequest } from './pdu_msgs/drone_srv_msgs/pdu_jstype_DroneGoToRequest.js';
import { CameraSetTiltRequest } from './pdu_msgs/drone_srv_msgs/pdu_jstype_CameraSetTiltRequest.js';
import { MagnetGrabRequest } from './pdu_msgs/drone_srv_msgs/pdu_jstype_MagnetGrabRequest.js';
import { Vector3 } from './pdu_msgs/geometry_msgs/pdu_jstype_Vector3.js';

// Main class
export { PduManager };

// Communication Services
export { 
    ICommunicationService, 
    WebSocketCommunicationService, 
    WebSocketServerCommunicationService 
};

// RPC
export { RemotePduServiceClientManager, RemotePduServiceServerManager, ServiceConfig as RpcServiceConfig, rpc_codes };

// Utility and configuration classes
export { PduChannelConfig, PduConvertor };

// Low-level utilities and constants
export { pdu_utils, pdu_constants };

// RPC auto-wire helpers
export { makeProtocolClient } from './rpc/autoWire.js';

export {
  SystemControlRequest,
  SystemControlOpCode,
  DroneSetReadyRequest,
  DroneTakeOffRequest,
  DroneLandRequest,
  DroneGetStateRequest,
  DroneGoToRequest,
  CameraSetTiltRequest,
  MagnetGrabRequest,
  Vector3
};
