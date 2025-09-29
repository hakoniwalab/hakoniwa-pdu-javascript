import asyncio
import websockets
import sys

async def echo(websocket, path):
    print("Python Server: Client connected.")
    try:
        async for message in websocket:
            print(f"Python Server: Received message, echoing back.")
            await websocket.send(message)
    except websockets.exceptions.ConnectionClosed:
        print("Python Server: Client disconnected.")
    except Exception as e:
        print(f"Python Server: An error occurred: {e}")

async def main(port):
    print(f"Python Server: Starting WebSocket server on port {port}...")
    async with websockets.serve(echo, "localhost", port):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    else:
        port = 8765
    asyncio.run(main(port))
