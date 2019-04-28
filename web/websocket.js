const WebSocket = require('ws')

const webSocketServer = new WebSocket.Server({ port: 3001 });
  
webSocketServer.on('connection', webSocket => {
    webSocket.send('Welcome!');
    webSocket.onmessage = messageEvent => {
        const message = messageEvent.data;
        webSocket.send(message);
        webSocketServer.clients.forEach(function each(client) {
            if (client !== webSocket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    };
});

module.exports = webSocketServer;
