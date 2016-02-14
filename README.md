# Openframe-PubSubServer
A central publish-subscribe event bus and real-time message broker for Openframe.

This repo represents the **Global Event Bus (pubsub)** in the following diagram. It is designed to run as an independent service (optionally on an independent box) from the API Server.

![alt tag](https://raw.github.com/OpenframeProject/Openframe-API/master/docs/img/API Diagram.jpg)

## Overview

This is a very basic implementation using [Faye](faye.jcoglan.com). It acts purely as an event bus, with no persistence or message queue.

The pubsub server keeps track of which frames are connected in order to send out a 'disconnected' event when a frame's connection is closed.

As it is a Faye server, clients can connect using the Faye client.

## Usage

To start up the server from the command line:

```bash
$ npm start
```

Or programmatically:

```javascript

var pubsubServer = require('openframe-pubsubserver');

// defaults to port 8889
pubsubServer.start();

// alternatively, pass a port into the start method:
// pubsubServer.start(1234);

```

## Built-in System Events (WIP)

#### /frame/connected/{frame_id}

#### /frame/disconnected/{frame_id}

#### /frame/updated/{frame_id}


## Proposed (not implemented)

#### /user/loggedin/{user_name}

#### /user/loggedout/{user_name}
