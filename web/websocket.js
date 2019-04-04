const WebSocket = require('ws')

const webSocketServer = new WebSocket.Server({ port: 3001 });

webSocketServer.on('connection', webSocket => {
    console.log('connection established');
    webSocket.send("Welcome!");
    webSocket.onmessage = messageEvent => {
        console.log('Message received:', messageEvent.data);
        const message = messageEvent.data;
        webSocket.send(message);
    };
    webSocket.onopen = event => {
        console.log('socket opened by client ', event);
        webSocket.send(messages);
    };
    webSocket.onerror = error => {
        console.error('WebSocket error occurs: ', error);
    };
    webSocket.onclose = event => {
        console.error('WebSocket connection closed by client ', event); 
    };
});

