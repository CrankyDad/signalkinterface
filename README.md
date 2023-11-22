# signalkinterface
Supportfor Node-Red to read/send data to/from signalK servers.

These nodes do not need to be run in an embedded Node-Red and can connect to both local
and remote SignalK servers.
The nodes uses a basic web-socket, but provides support to subscribe to SignalK paths as well as to autenticate to the SignalK server.
Authentication is needed if the user wants to change data in SignalK via PUT-messges.
Do note that these modules can't update any SignalK value, only values with a PUT handler associated with them (such as electrical switches).

The modules also provides a "flattening" node which takes SignalK JSON data and make it into Java Script objects to be used on other nodes. Flattened massages will have the SignalK path as msg.topic and the SignalK value as msg.payload
