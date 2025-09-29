/**
 * Opcodes for the SystemControl service request.
 */
export const SystemControlOpCode = {
    ACTIVATE: 0,
    START: 1,
    STOP: 2,
    RESET: 3,
    TERMINATE: 4,
    STATUS: 5
};

/**
 * Status codes for the SystemControl service response.
 */
export const SystemControlStatusCode = {
    OK: 0,
    ERROR: 1,
    FATAL: 2,
    INTERNAL: 3
};

// ====== [ Common API Status / Result Codes ] ======
export const API_STATUS_NONE = 0;
export const API_STATUS_DOING = 1;
export const API_STATUS_CANCELING = 2;
export const API_STATUS_DONE = 3;
export const API_STATUS_ERROR = 4;

export const API_RESULT_CODE_OK = 0;
export const API_RESULT_CODE_ERROR = 1;
export const API_RESULT_CODE_CANCELED = 2;
export const API_RESULT_CODE_INVALID = 3;
export const API_RESULT_CODE_BUSY = 4;

// ====== [ Client Opcode ] ======
export const CLIENT_API_OPCODE_REQUEST = 0;
export const CLIENT_API_OPCODE_CANCEL = 1;

// ====== [ Client Events ] ======
export const CLIENT_API_EVENT_NONE = 0;
export const CLIENT_API_EVENT_RESPONSE_IN = 1;
export const CLIENT_API_EVENT_REQUEST_TIMEOUT = 2;
export const CLIENT_API_EVENT_REQUEST_CANCEL_DONE = 3;

// ====== [ Client State ] ======
export const CLIENT_API_STATE_IDLE = 0;
export const CLIENT_API_STATE_DOING = 1;
export const CLIENT_API_STATE_CANCELING = 2;

// ====== [ Server Events ] ======
export const SERVER_API_EVENT_NONE = 0;
export const SERVER_API_EVENT_REQUEST_IN = 1;
export const SERVER_API_EVENT_REQUEST_CANCEL = 2;

// ====== [ Server Status ] ======
export const SERVER_API_STATUS_IDLE = 0;
export const SERVER_API_STATUS_DOING = 1;
export const SERVER_API_STATUS_CANCELING = 2;

// ====== [ Trigger Events ] ======
export const TRIGGER_EVENT_ID_START = 0;
export const TRIGGER_EVENT_ID_STOP = 1;
export const TRIGGER_EVENT_ID_RESET = 2;
