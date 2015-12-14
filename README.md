# Openframe-PubSubServer
A central publish-subscribe event bus and real-time message broker for Openframe.

This repo represents the **Global Event Bus (pubsub)** in the following diagram. It is designed to run as an independent service (optionally on an independent box) from the API Server.

![alt tag](https://raw.github.com/OpenframeProject/Openframe-API/master/docs/img/API Diagram.jpg)

## Built-in System Events (WIP)

#### /frame/connected/{frame_id}

#### /frame/disconnected/{frame_id}

#### /frame/updated/{frame_id}

#### /user/loggedin/{user_name}

#### /user/loggedout/{user_name}
