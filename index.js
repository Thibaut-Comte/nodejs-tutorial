const express = require('express');
const app = express();
const v1 = express.Router();

const MessageService = require('./services/message');
const messageService = new MessageService();

app.use('/api/v1', v1);

v1.get('/message', (request, response) => {
    messageService.getMessages()
    .then(data => {
        response.send(data);
    });
});
v1.get('/message/:id', (request, response) => {
    const id = request.params.id;
    messageService.getMessage(id)
    .then(message => {
        message ? response.send(message) : response.sendStatus(404);
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
