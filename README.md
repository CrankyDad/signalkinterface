# signalkinterface
Basic support for Node-Red to read/send data to/from signalK servers.

These nodes do not need to be run in an embedded Node-Red in SignalK. They can connect to both remove and local SignalK servers like a normal SignalK client.
This was made in mind for Victron systems having separate SignalK and Node-Red servers and you only need to read SignalK data and update via PUT.

Abstracts [SignalK](https://signalk.org/) connection and server interaction to simplify connecting and using a SignalK server. It acts as a SignalK client.
It supports subscribing and unsubscribing by using messages on the fly or by the configuration.
It can also `GET` values if there only is a sporadic need of certain data (no need for subscribing) to paths.

The SignalK helper can authenticate to the SignalK server, either by username/password or by device authentication where the request needs to be accepted/approved by an admin on the server.

The SignalK helper also supports `PUT` messages which is used to change a value on the server. This is typically used for changing the status of electical switches.
Do note that the path containing the value to be changed need to have a PUT handler registered with it. The node needs to be authenticated with the right to write data.
The SignalK helper can't maipulate paths not having PUT handlers.

The SignalK helper indicates its status by showing:
 - Red - There is no websocket connection to the server
 - Yellow - There is a websocket connecton to the server, but no subscription of data
 - Green - There is a subscription and there are updates sent on the websocket

 The status shows:
 - a ring if the node is not authenticated
 - a dot if the node is authenticated

---


# Configuration
The node provides the following coniguration options:
 - **Device login** - Check if the node shall authenticate as a device (not username/passowrd)
 - **Client Id** - Identifier the identifes the client (node) to the server when device authentication is used
 - **Username/Password** - For a user in SignalK. The user needs write access if changes to data are to be made
 - **minPeriod** - Messages from a path will be sent with at least this internvall (not to flood the node/sever).
 
There are tree available subscription blocks with their own policy, paths and period.
If paths are left blank, the block will not be used.

If a value is left blank, the node will set a sensible default value.


 - **SK Host stream** - URL to the stream endpoint. Example ws://localhost:3000/signalk/v1/stream?subscribe=none
 - **SK Host** Base URL to the server. Example http://localhost:3000 


#  Inputs
`skaction`
    The command sent to the node. The commands are:
 -  `get`             One-time fetch of data from the server. Can be a single or multiple paths. Paths are sent in the topic
 -  `add-subscribe`   subscribe to the path/paths sent in topic
 -  `unsubscribe`     unsubscribe for all paths. topic is ignored
 -  `update`          update the value of path with the value in payload
 -  `authenticate`   trigger a reauthentication to the server if the authentication has expired

`topic`
    Which path or paths the command relates to. It can either be a string with a SignalK path
    or a JSON object with the following format {"paths":[path1,path2,path3]}. Pathx are all strings

`payload`
    The value that the path is to be set to. This is only used for updates

## add-subscribe adds the following inputs 
`policy`, `period` and `minPeriod`
[SignalK documentation provides information](https://signalk.org/specification/1.7.0/doc/subscription_protocol.html) about these settings.

---

# Outputs
The node has two outputs.
## Debug
General output for error messages and internal messages sent to the websocket or HTTP request.
Useble for debugging.
Raw data from the websocket-in has the topic set to _websocket-in_ (useful for filering).
The skaction is set as `topic` (for filtering). The original topic is moved to `payload.topic`

## Updates
Sends recieved data from SignalK. Messages are flattened, meaning that they only contain one path and its value per message.
The message are the same as messages sent by the embdded Node Red.
 -  `topic` the path the value relates to
 -  `payload` the value the path contains. This can be a number, string or an object
 -  `$source` the source as recorded by SignalK
 -  `timestamp` the date/time when the value was updated ("2023-12-21T22:38:11.459Z")

The node connects to the SignalK server by using Websocket or REST APIs and authenticates 
Authentication is needed if the user wants to change data in SignalK via PUT-messages.
Do note that these modules can't update any SignalK value, only values with a PUT handler associated with them (such as electrical switches).

The modules also provides a "flattening" node which takes SignalK JSON data and make it into Java Script objects to be used in other nodes. The node also separates deltas containing many values into multiple messages.
Flattened messages will have the SignalK path as <code>msg.topic</code> and the SignalK value as <code>msg.payload</code>. Other SignalK data will also be present in the message like timestamp.

## Installation/Use
Edit the configuration of the node to your liking.

[Picture of example - TBD]
