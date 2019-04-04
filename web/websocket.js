const WebSocket = require('ws')

const webSocketServer = new WebSocket.Server({ port: 3001 });

webSocketServer.on('connection', webSocket => {
    console.log('connection established');
    webSocket.onmessage = message => {
        console.log(`Received message => ${message}`)
    };
    webSocket.onopen = event => {
        console.log('socket opened by client ', event);
    };
    webSocket.onerror = error => {
        console.error('WebSocket error occurs:', error);
    };
    webSocket.onclose = event => {
        console.error('WebSocket connection closed by client ', event); 
    }

    webSocket.send('message from back-end!');
});

