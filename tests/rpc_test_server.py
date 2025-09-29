import asyncio
import websockets
import sys
import json
import os

# Add src directory to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'hakoniwa-pdu-python', 'src')))

from hakoniwa_pdu.impl.websocket_server_communication_service import WebSocketServerCommunicationService
from hakoniwa_pdu.rpc.remote.remote_pdu_service_server_manager import RemotePduServiceServerManager
from hakoniwa_pdu.impl.data_packet import DataPacket, PDU_DATA_RPC_REQUEST, REGISTER_RPC_CLIENT
from hakoniwa_pdu.pdu_msgs.hako_srv_msgs.pdu_pytype_AddTwoIntsRequest import AddTwoIntsRequest
from hakoniwa_pdu.pdu_msgs.hako_srv_msgs.pdu_pytype_AddTwoIntsResponse import AddTwoIntsResponse
from hakoniwa_pdu.pdu_msgs.hako_srv_msgs.pdu_conv_AddTwoIntsRequest import pdu_to_py_AddTwoIntsRequest, py_to_pdu_AddTwoIntsRequest
from hakoniwa_pdu.pdu_msgs.hako_srv_msgs.pdu_conv_AddTwoIntsResponse import pdu_to_py_AddTwoIntsResponse, py_to_pdu_AddTwoIntsResponse
from hakoniwa_pdu.pdu_msgs.hako_srv_msgs.pdu_pytype_RegisterClientRequestPacket import RegisterClientRequestPacket
from hakoniwa_pdu.pdu_msgs.hako_srv_msgs.pdu_pytype_RegisterClientResponsePacket import RegisterClientResponsePacket
from hakoniwa_pdu.pdu_msgs.hako_srv_msgs.pdu_conv_RegisterClientRequestPacket import pdu_to_py_RegisterClientRequestPacket, py_to_pdu_RegisterClientRequestPacket
from hakoniwa_pdu.pdu_msgs.hako_srv_msgs.pdu_conv_RegisterClientResponsePacket import pdu_to_py_RegisterClientResponsePacket, py_to_pdu_RegisterClientResponsePacket
from hakoniwa_pdu.rpc.ipdu_service_manager import IPduServiceManager

# Paths relative to this script
PDU_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "pdu_config.json")
SERVICE_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "service.json")
OFFSET_PATH = os.path.join(os.path.dirname(__file__), "config", "offset") # Not strictly used by JS, but needed for Python PduConvertor

class RpcTestServer:
    def __init__(self, uri, pdu_config_path, service_config_path, offset_path):
        self.uri = uri
        self.pdu_config_path = pdu_config_path
        self.service_config_path = service_config_path
        self.offset_path = offset_path
        self.server_comm = WebSocketServerCommunicationService(version="v2")
        self.server_pdu_manager = RemotePduServiceServerManager(
            "test_server", pdu_config_path, offset_path, self.server_comm, uri
        )
        self.server_pdu_manager.initialize_services(service_config_path, 1000 * 1000)
        self.server_comm.register_event_handler(self._handle_client_event)
        self.server_comm.register_data_event_handler(self._handle_rpc_request)
        self.client_id_map = {}

    async def _handle_client_event(self, packet: DataPacket, client_id: str):
        print(f"Python Server: Received client event: {packet.meta_pdu.meta_request_type}")
        if packet.meta_pdu.meta_request_type == REGISTER_RPC_CLIENT:
            req_packet = pdu_to_py_RegisterClientRequestPacket(packet.body_data)
            print(f"Python Server: Register client request from {req_packet.header.client_name} for service {req_packet.header.service_name}")
            
            # Simulate client registration response
            res_packet = RegisterClientResponsePacket()
            res_packet.header.request_id = req_packet.header.request_id
            res_packet.header.service_name = req_packet.header.service_name
            res_packet.header.client_name = req_packet.header.client_name
            res_packet.header.result_code = IPduServiceManager.API_RESULT_CODE_OK
            res_packet.body.request_channel_id = 100 # Dummy channel ID
            res_packet.body.response_channel_id = 101 # Dummy channel ID
            res_packet.body.asset_id = 1 # Dummy asset ID

            # Store client_id for later use if needed
            self.client_id_map[req_packet.header.client_name] = res_packet.body

            response_pdu_data = py_to_pdu_RegisterClientResponsePacket(res_packet)
            # Send response back to the client via the communication buffer
            # The client expects this response in its comm_buffer, keyed by service_name/client_name
            # The server needs to send it as a PDU_DATA_RPC_REPLY type, but the client's RemotePduServiceClientManager
            # polls its own comm_buffer for the response to REGISTER_RPC_CLIENT. So we need to put it there.
            # This is a bit tricky. The Python test uses make_protocol_server which handles this.
            # For this direct test, we'll simulate the client's expectation by sending it as a regular PDU_DATA
            # to the client's expected PDU name (which is service_name/client_name).
            # This is a hack for the test, as the actual protocol might be different.
            # Let's re-evaluate the client's register_client method.
            # The client's register_client polls comm_buffer.contains_buffer(service_name, client_name)
            # So the server needs to put the response into the client's comm_buffer under that key.
            # This means the server needs to send a PDU_DATA packet with robot_name=service_name and pdu_name=client_name
            # This is not how the actual RPC reply works. The actual RPC reply is PDU_DATA_RPC_REPLY.
            # The client's RemotePduServiceClientManager.register_client expects the response to be in its comm_buffer
            # under the key (service_name, client_name). This is a bit of a mismatch with how PDU_DATA is handled.
            # The Python test uses make_protocol_server which handles this abstraction.
            # For this test, the Python server needs to send a PDU_DATA_RPC_REPLY packet, and the client's comm_buffer
            # needs to be able to receive it and store it under the correct key.
            # Let's check RemotePduServiceClientManager.register_client again.
            # It polls: if self.comm_buffer.contains_buffer(service_name, client_name):
            # And the server's _handle_client_event is called when the server receives REGISTER_RPC_CLIENT.
            # The server needs to send a PDU_DATA_RPC_REPLY back to the client.
            # The client's WebSocketBaseCommunicationService._receive_loop_v2 handles PDU_DATA_RPC_REPLY and calls put_rpc_packet.
            # So the server needs to send a PDU_DATA_RPC_REPLY packet.
            # The client's register_client then polls the comm_buffer for (service_name, client_name).
            # This means the client's comm_buffer.put_rpc_packet is the one that stores it.
            # So the server needs to send a PDU_DATA_RPC_REPLY packet with the response_pdu_data as body.
            # The robot_name and channel_id in this packet should be the service_name and a dummy channel_id.
            
            # Send the response as a PDU_DATA_RPC_REPLY packet
            response_packet = DataPacket(
                robot_name=req_packet.header.service_name, # Use service name as robot name for RPC
                channel_id=res_packet.body.response_channel_id, # Use response channel ID
                body_data=response_pdu_data
            )
            encoded_response = response_packet.encode("v2", meta_request_type=PDU_DATA_RPC_REPLY)
            await self.server_comm.send_binary(encoded_response)

    async def _handle_rpc_request(self, packet: DataPacket):
        print(f"Python Server: Received RPC request: {packet.meta_pdu.meta_request_type}")
        if packet.meta_pdu.meta_request_type == PDU_DATA_RPC_REQUEST:
            req = pdu_to_py_AddTwoIntsRequest(packet.body_data)
            print(f"Python Server: AddTwoInts request: a={req.a}, b={req.b}")
            res = AddTwoIntsResponse()
            res.sum = req.a + req.b
            response_pdu_data = py_to_pdu_AddTwoIntsResponse(res)

            # Send response back as PDU_DATA_RPC_REPLY
            response_packet = DataPacket(
                robot_name=packet.robot_name, # Use original robot name
                channel_id=packet.channel_id, # Use original channel ID
                body_data=response_pdu_data
            )
            encoded_response = response_packet.encode("v2", meta_request_type=PDU_DATA_RPC_REPLY)
            await self.server_comm.send_binary(encoded_response)

    async def start(self, port):
        uri = f"ws://localhost:{port}"
        print(f"Python Server: Starting RPC test server on {uri}...")
        await self.server_pdu_manager.start_service(uri)
        print(f"Python Server: RPC test server started on {uri}")
        # Keep the server running
        await asyncio.Future()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8772
    server = RpcTestServer(
        uri=f"ws://localhost:{port}",
        pdu_config_path=PDU_CONFIG_PATH,
        service_config_path=SERVICE_CONFIG_PATH,
        offset_path=OFFSET_PATH
    )
    asyncio.run(server.start(port))
