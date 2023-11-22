# signalkinterface
Basic support for Node-Red to read/send data to/from signalK servers.

These nodes do not need to be run in an embedded Node-Red in SignalK. They can connect to both remove and local SignalK servers like a normal SignalK client.
This was made in mind for Victron systems having separate SignalK and Node-Red servers and you only need to read SignalK data and update via PUT.

The nodes uses a basic web-socket (which the user needs to deploy), but provides support to subscribe to SignalK paths as well as to autenticate to the SignalK server.
Authentication is needed if the user wants to change data in SignalK via PUT-messages.
Do note that these modules can't update any SignalK value, only values with a PUT handler associated with them (such as electrical switches).

The modules also provides a "flattening" node which takes SignalK JSON data and make it into Java Script objects to be used in other nodes. The node also separates deltas containing many values into multiple messages.
Flattened messages will have the SignalK path as <code>msg.topic</code> and the SignalK value as <code>msg.payload</code>. Other SignalK data will also be present in the message like timestamp.

## Installation/Use
1. Add a websocket in to your flow
    - For properties use
      - URL ws://[hostname]:[port]/signalk/v1/stream?subscribe=none  (ws://localhost:3000/signalk/v1/stream?subscribe=none)
      - Subprotocol:
      - Send/Receive: payload
2. Add a websocket out using the same configuration as above
3. Create a signalkhelper and connect the websocket in to the in-port and the 'control'-out port to the websocket out node. This will pass controll messages back to the web-socket.
4. Create a signalkflattener and connect it after the signalkhelper on the delta port

If you want to <code>PUT</code> values to Signal K, use the signalkputhelper and connect the output to the websocket out node.<br>
[Picture of example - TBD]
