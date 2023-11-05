{
  "name": "signalkinterface",
  "version": "1.0.0",
  "description": "Nodes to connect to SignalK servers running locally or remotely. These nodes do not need to be run inside SignalK.",
  "main": "index.js",
  "scripts": {
    "test": "testsignalk"
  },
  "repository": {
    "type": "git",
    "url": "signalkinterface"
  },
  "keywords": [
    "SignalK",
    "Node-Red"
  ],
  "author": "Jan Wellergård",
  "license": "GPL-3.0-or-later",
  
  "node-red" : {
        "nodes": {
            "signalKinterfaceconfig": "signalKinterfaceconfig.js",
            "signalkin": "signalkin.js",
            "signalkout": "signalkout.js"
        }
  }
}
