const WebSocket = require('ws')

const webSocketServer = new WebSocket.Server({ port: 3001 });

webSocketServer.broadcast = function broadcast(data) {
    webSocketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};
  
webSocketServer.on('connection', webSocket => {
    console.log('connection established');
    webSocket.send('Welcome!');
    webSocket.onmessage = messageEvent => {
        console.log('Message received:', messageEvent.data);
        const message = messageEvent.data;
        webSocket.send(message);
        webSocketServer.clients.forEach(function each(client) {
            if (client !== webSocket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    };
    webSocket.onopen = event => {
        console.log('socket opened by client ', event);
    };
    webSocket.onerror = error => {
        console.error('WebSocket error occurs: ', error);
    };
    webSocket.onclose = event => {
        console.error('WebSocket connection closed by client ', event); 
    };
});
