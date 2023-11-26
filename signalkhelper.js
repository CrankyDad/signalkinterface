module.exports = function(RED) {
    function SignalKHelperNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var nodeContext = this.context();
        
//
// Node start up
//        
        node.on('on start', function() {
// Code added here will be run once
// whenever the node is started.
// SKstate is the state in which SignalK is in
// 0 not connected
// 1 connected but not subscribed
// 2 subscribed to paths
			nodeContext.set("SKstate", 0);
			nodeContext.set("SKAutenticated",false);
			node.status({ fill: "red", shape: "ring", text: "disconnected" });
		}

//
// Restart or exit of node
//
		node.on('close', function() {
			/ Code added here will be run when the
// node is being stopped or re-deployed.
			nodeContext.set("SKstate", 0);
			nodeContext.set("SKAutenticated", false)
			node.status({ fill: "red", shape: "ring", text: "disconnected" });
		}
 
//
// Node recieved a message
//
        node.on('input', function(msg,send,done) {
			var skmsg = JSON.parse(msg.payload);
			var SKauth = nodeContext.get("SKAutenticated") || false;
			var SKstate = nodeContext.get("SKstate") || 0;
			var deltamsg = [];
			
	// For maximum backwards compatibility, check that send exists.
    // If this node is installed in Node-RED 0.x, it will need to
    // fallback to using `node.send`
			send = send || function() { node.send.apply(node,arguments) }

			if (skmsg.name != null) {
				nodeContext.set("SKAutenticated",false);
				nodeContext.set("SKstate",1);
				this.status({ fill: "yellow", shape: "ring", text: "connected" });
				msg.topic = "control";
			}

			if (skmsg.state == "COMPLETED" && skmsg.statusCode==200) {
				nodeContext.set("SKAutenticated", true);
				if (SKstate == 1) {
					this.status({ fill: "yellow", shape: "dot", text: "authenticated" });
				}
				if (SKstate == 2) {
					this.status({ fill: "green", shape: "dot", text: "connected and subscribing" });
				}
				msg.topic = "control";
			}

			if (skmsg.state == "COMPLETED" && skmsg.statusCode==403) {
				nodeContext.set("SKAutenticated", false);
				if (SKstate == 1) {
					this.status({ fill: "yellow", shape: "ring", text: "connected" });
				}
				if (SKstate == 2) {
					this.status({ fill: "green", shape: "ring", text: "connected and subscribing" });
				}
				msg.topic = "error";
			}

			if (skmsg.updates != null && SKstate!=2) {
				nodeContext.set("SKstate", 2);
				if (SKauth) {
					this.status({ fill: "green", shape: "dot", text: "authenticated and subscribed" });
				}
				else {
					this.status({ fill: "green", shape: "ring", text: "connected and subscribed" });
				}
			}

			//Update message (Delta)
			if (skmsg.updates != null) {
				// Flatten data and put each value as a message
				// Value goes as payload, path as topic
				for (const updates of skmsg.updates) {
				   for (const values of updates.values) {
					deltamsg.push({topic:values.path,
						payload:values.value,
						source:updates.source,
						$source:updates.$source,
						timestamp:new Date(updates.timestamp)
						})
				   } 
				}
				node.send([null,deltamsg,null]);
			}

			if (msg.topic == "control") {
				node.send([msg, null,null]);
			}

			if (msg.topic == "error") {
				// Error
				node.error("Login to SignalK failed: "+msg.payload);
				node.send([null,null,msg]);
			}
            
            // If an error is hit, report it to the runtime
			if (err) {
				if (done) {
				// Node-RED 1.0 compatible
					done(err);
				} else {
				// Node-RED 0.x compatible
				node.error(err, msg);
				}
			}
        });
    }
    
    RED.nodes.registerType("signalk-helper",SignalKHelperNode);
}
